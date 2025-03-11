package com.travel.GlobeBound.repository;

import com.travel.GlobeBound.entity.Accommodation;
import com.travel.GlobeBound.entity.enums.AccommodationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    List<Accommodation> findByCityAndAccommodationType(String city, AccommodationType type);
    List<Accommodation> findByCity(String city);
    List<Accommodation> findByAccommodationType(AccommodationType type);
    List<Accommodation> findByOwnerOwnerId(Long ownerId);
}
