package com.travel.GlobeBound.repository;

import com.travel.GlobeBound.entity.AccommodationPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccommodationPhotoRepository extends JpaRepository<AccommodationPhoto, Long> {
    List<AccommodationPhoto> findByAccommodationAccommodationId(Long accommodationId);
}
