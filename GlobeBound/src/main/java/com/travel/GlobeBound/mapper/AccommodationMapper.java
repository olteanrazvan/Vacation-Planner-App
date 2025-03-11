package com.travel.GlobeBound.mapper;

import com.travel.GlobeBound.DTO.AccommodationRequest;
import com.travel.GlobeBound.entity.Accommodation;
import com.travel.GlobeBound.entity.Owner;
import com.travel.GlobeBound.entity.AccommodationPhoto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AccommodationMapper {
    Accommodation toAccommodation(AccommodationRequest accommodationRequest);
    AccommodationRequest toAccommodationRequest(Accommodation accommodation);
    List<Accommodation> toAccommodation(List<AccommodationRequest> accommodationRequests);
    List<AccommodationRequest> toAccommodationRequests(List<Accommodation> accommodations);
    @Mapping(target = "accommodationId", ignore = true)
    void updateAccommodation(@MappingTarget Accommodation accommodation, AccommodationRequest accommodationRequest);
    @Mapping(target = "owner", source = "currentOwner")
    AccommodationRequest toAccommodationRequest(Accommodation accommodation, Owner currentOwner);
    @Mapping(target = "owner", source = "currentOwner")
    Accommodation toAccommodation(AccommodationRequest accommodationRequest, Owner currentOwner);
    default List<String> getPhotoUrls(Accommodation accommodation) {
        if (accommodation.getPhotos() == null) {
            return new ArrayList<>();
        }
        return accommodation.getPhotos().stream()
                .map(AccommodationPhoto::getPhotoUrl)
                .collect(Collectors.toList());
    }
}
