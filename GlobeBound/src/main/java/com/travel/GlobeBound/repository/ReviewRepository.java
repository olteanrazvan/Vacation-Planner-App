package com.travel.GlobeBound.repository;

import com.travel.GlobeBound.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByAccommodationAccommodationId(Long accommodationId);
    List<Review> findByUserUserId(Long userId);
}
