package com.travel.GlobeBound.service;

import com.travel.GlobeBound.DTO.ReservationRequest;
import com.travel.GlobeBound.entity.Accommodation;
import com.travel.GlobeBound.entity.Reservation;
import com.travel.GlobeBound.entity.User;
import com.travel.GlobeBound.exceptions.BadRequestException;
import com.travel.GlobeBound.exceptions.UnauthorizedException;
import com.travel.GlobeBound.mapper.ReservationMapper;
import com.travel.GlobeBound.repository.AccommodationRepository;
import com.travel.GlobeBound.repository.ReservationRepository;
import com.travel.GlobeBound.exceptions.ResourceNotFoundException;
import com.travel.GlobeBound.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;
    private final AccommodationRepository accommodationRepository;
    private final UserRepository userRepository;

    public List<ReservationRequest> getUserReservations(Long userId) {
        List<Reservation> reservations = reservationRepository.findByUserUserId(userId);
        return reservationMapper.toReservationRequests(reservations);
    }

    public ReservationRequest getUserReservationById(Long userId, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("Reservation does not belong to this user");
        }

        return reservationMapper.toReservationRequest(reservation);
    }

    private void validateRoomAvailability(Accommodation accommodation, ReservationRequest request) {
        if ((request.getSingleRoomsNumber() != null &&
                request.getSingleRoomsNumber() > accommodation.getTotalSingleRooms()) ||
                (request.getDoubleRoomsNumber() != null &&
                        request.getDoubleRoomsNumber() > accommodation.getTotalDoubleRooms()) ||
                (request.getTripleRoomsNumber() != null &&
                        request.getTripleRoomsNumber() > accommodation.getTotalTripleRooms()) ||
                (request.getQuadrupleRoomsNumber() != null &&
                        request.getQuadrupleRoomsNumber() > accommodation.getTotalQuadrupleRooms())) {
            throw new BadRequestException("Not enough rooms available for this reservation");
        }
    }

    private void updateAccommodationRooms(Accommodation accommodation, ReservationRequest request, boolean isCreating) {
        int modifier = isCreating ? -1 : 1;

        accommodation.setTotalSingleRooms(accommodation.getTotalSingleRooms() +
                (request.getSingleRoomsNumber() * modifier));
        accommodation.setTotalDoubleRooms(accommodation.getTotalDoubleRooms() +
                (request.getDoubleRoomsNumber() * modifier));
        accommodation.setTotalTripleRooms(accommodation.getTotalTripleRooms() +
                (request.getTripleRoomsNumber() * modifier));
        accommodation.setTotalQuadrupleRooms(accommodation.getTotalQuadrupleRooms() +
                (request.getQuadrupleRoomsNumber() * modifier));

        accommodationRepository.save(accommodation);
    }

    public ReservationRequest createUserReservation(Long userId, ReservationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Accommodation accommodation = accommodationRepository.findById(request.getAccommodation().getAccommodationId())
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        validateRoomAvailability(accommodation, request);

        Reservation reservation = reservationMapper.toReservation(request);
        reservation.setUser(user);
        reservation.setAccommodation(accommodation);

        updateAccommodationRooms(accommodation, request, true);

        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.toReservationRequest(savedReservation);
    }

    public ReservationRequest cancelUserReservation(Long userId, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!reservation.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("Reservation does not belong to this user");
        }

        updateAccommodationRooms(reservation.getAccommodation(),
                reservationMapper.toReservationRequest(reservation), false);

        ReservationRequest reservationRequest = reservationMapper.toReservationRequest(reservation);
        reservationRepository.delete(reservation);
        return reservationRequest;
    }

    public ReservationRequest updateUserReservation(Long userId, Long reservationId, ReservationRequest request) {
        Reservation existingReservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));

        if (!existingReservation.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("Reservation does not belong to this user");
        }

        Accommodation accommodation = existingReservation.getAccommodation();

        int singleRoomsDiff = (request.getSingleRoomsNumber() != null ? request.getSingleRoomsNumber() : 0)
                - existingReservation.getSingleRoomsNumber();
        int doubleRoomsDiff = (request.getDoubleRoomsNumber() != null ? request.getDoubleRoomsNumber() : 0)
                - existingReservation.getDoubleRoomsNumber();
        int tripleRoomsDiff = (request.getTripleRoomsNumber() != null ? request.getTripleRoomsNumber() : 0)
                - existingReservation.getTripleRoomsNumber();
        int quadrupleRoomsDiff = (request.getQuadrupleRoomsNumber() != null ? request.getQuadrupleRoomsNumber() : 0)
                - existingReservation.getQuadrupleRoomsNumber();

        if (accommodation.getTotalSingleRooms() - singleRoomsDiff < 0 ||
                accommodation.getTotalDoubleRooms() - doubleRoomsDiff < 0 ||
                accommodation.getTotalTripleRooms() - tripleRoomsDiff < 0 ||
                accommodation.getTotalQuadrupleRooms() - quadrupleRoomsDiff < 0) {
            throw new BadRequestException("Not enough rooms available for the requested changes");
        }

        accommodation.setTotalSingleRooms(accommodation.getTotalSingleRooms() - singleRoomsDiff);
        accommodation.setTotalDoubleRooms(accommodation.getTotalDoubleRooms() - doubleRoomsDiff);
        accommodation.setTotalTripleRooms(accommodation.getTotalTripleRooms() - tripleRoomsDiff);
        accommodation.setTotalQuadrupleRooms(accommodation.getTotalQuadrupleRooms() - quadrupleRoomsDiff);

        accommodationRepository.save(accommodation);

        reservationMapper.updateReservation(existingReservation, request);
        Reservation updatedReservation = reservationRepository.save(existingReservation);
        return reservationMapper.toReservationRequest(updatedReservation);
    }
}