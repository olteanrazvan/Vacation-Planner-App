package com.travel.GlobeBound.mapper;

import com.travel.GlobeBound.DTO.ReservationRequest;
import com.travel.GlobeBound.entity.Reservation;
import com.travel.GlobeBound.entity.Review;
import com.travel.GlobeBound.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservationMapper {
    Reservation toReservation(ReservationRequest reservationRequest);
    ReservationRequest toReservationRequest(Reservation reservation);
    List<Reservation> toReservations(List<ReservationRequest> reservationRequests);
    List<ReservationRequest> toReservationRequests(List<Reservation> reservations);
    @Mapping(target = "reservationId", ignore = true)
    void updateReservation(@MappingTarget Reservation reservation, ReservationRequest reservationRequest);
    @Mapping(target = "user", source = "currentUser")
    ReservationRequest toReservationRequest(Reservation reservation, User currentUser);
    @Mapping(target = "user", source = "currentUser")
    Reservation toReservation(ReservationRequest reservationRequest, User currentUser);
}
