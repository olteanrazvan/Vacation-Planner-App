package com.travel.GlobeBound.service;

import com.travel.GlobeBound.DTO.AccommodationRequest;
import com.travel.GlobeBound.DTO.OwnerRequest;
import com.travel.GlobeBound.entity.Accommodation;
import com.travel.GlobeBound.entity.Owner;
import com.travel.GlobeBound.entity.User;
import com.travel.GlobeBound.entity.enums.UserType;
import com.travel.GlobeBound.exceptions.ResourceNotFoundException;
import com.travel.GlobeBound.mapper.AccommodationMapper;
import com.travel.GlobeBound.mapper.OwnerMapper;
import com.travel.GlobeBound.mapper.UserMapper;
import com.travel.GlobeBound.repository.AccommodationRepository;
import com.travel.GlobeBound.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.travel.GlobeBound.repository.OwnerRepository;
import com.travel.GlobeBound.exceptions.UnauthorizedException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerService {
    private final AccommodationRepository accommodationRepository;
    private final OwnerRepository ownerRepository;
    private final OwnerMapper ownerMapper;
    private final AccommodationMapper accommodationMapper;
    private final UserRepository userRepository;

    public List<AccommodationRequest> getMyAccommodations(Long ownerId) {
        return accommodationRepository.findByOwnerOwnerId(ownerId).stream()
                .map(accommodationMapper::toAccommodationRequest)
                .collect(Collectors.toList());
    }

    public AccommodationRequest getMyAccommodation(Long ownerId, Long accommodationId) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        if (!accommodation.getOwner().getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to view this accommodation");
        }

        return accommodationMapper.toAccommodationRequest(accommodation);
    }

    public AccommodationRequest createAccommodation(AccommodationRequest request, Long ownerId) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Accommodation accommodation = accommodationMapper.toAccommodation(request);
        accommodation.setOwner(owner);

        return accommodationMapper.toAccommodationRequest(accommodationRepository.save(accommodation));
    }

    public AccommodationRequest updateAccommodation(Long ownerId, Long accommodationId, AccommodationRequest request) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        if (!accommodation.getOwner().getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to update this accommodation");
        }

        accommodationMapper.updateAccommodation(accommodation, request);
        return accommodationMapper.toAccommodationRequest(accommodationRepository.save(accommodation));
    }

    public AccommodationRequest deleteAccommodation(Long ownerId, Long accommodationId) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        if (!accommodation.getOwner().getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to delete this accommodation");
        }

        AccommodationRequest request = accommodationMapper.toAccommodationRequest(accommodation);
        accommodationRepository.delete(accommodation);
        return request;
    }

    public List<OwnerRequest> findAll(){
        List<Owner> owners = ownerRepository.findAll();
        return ownerMapper.toOwnerRequests(owners);
    }

    @Transactional
    public OwnerRequest createOwner(OwnerRequest request) {
        User user = userRepository.findById(request.getUser().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setUserType(UserType.OWNER);
        userRepository.save(user);

        Owner owner = new Owner();
        owner.setUser(user);
        Owner savedOwner = ownerRepository.save(owner);

        return ownerMapper.toOwnerRequest(savedOwner);
    }
}
