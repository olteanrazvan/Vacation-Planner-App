package com.travel.GlobeBound.mapper;

import com.travel.GlobeBound.DTO.AccommodationPhotoRequest;
import com.travel.GlobeBound.entity.AccommodationPhoto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AccommodationPhotoMapper {
    AccommodationPhotoRequest toAccommodationPhotoRequest(AccommodationPhoto accommodationPhoto);
    AccommodationPhoto toAccommodationPhoto(AccommodationPhotoRequest request);
    List<AccommodationPhotoRequest> toAccommodationPhotoRequests(List<AccommodationPhoto> photos);
    List<AccommodationPhoto> toAccommodationPhotos(List<AccommodationPhotoRequest> requests);
}