package com.travel.GlobeBound.service;

import com.travel.GlobeBound.DTO.ReviewRequest;
import com.travel.GlobeBound.entity.Accommodation;
import com.travel.GlobeBound.entity.Review;
import com.travel.GlobeBound.entity.User;
import com.travel.GlobeBound.mapper.ReviewMapper;
import com.travel.GlobeBound.repository.AccommodationRepository;
import lombok.*;
import org.springframework.stereotype.*;
import com.travel.GlobeBound.repository.ReviewRepository;
import com.travel.GlobeBound.exceptions.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final UserService userService;
    private final AccommodationRepository accommodationRepository;

    public List<ReviewRequest> findAllByAccommodation(Long accommodationId) {
        List<Review> reviews = reviewRepository.findByAccommodationAccommodationId(accommodationId);
        return reviewMapper.toReviewRequests(reviews);
    }

    public ReviewRequest findById(Long accommodationId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getAccommodation().getAccommodationId().equals(accommodationId)) {
            throw new ResourceNotFoundException("Review not found for this accommodation");
        }

        return reviewMapper.toReviewRequest(review);
    }

    public ReviewRequest createReview(ReviewRequest request, Long accommodationId) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        User user = userService.getCurrentUser();

        Review review = reviewMapper.toReview(request);
        review.setAccommodation(accommodation);
        review.setUser(user);

        Review savedReview = reviewRepository.save(review);
        return reviewMapper.toReviewRequest(savedReview);
    }

    public ReviewRequest deleteReview(Long accommodationId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getAccommodation().getAccommodationId().equals(accommodationId)) {
            throw new ResourceNotFoundException("Review not found for this accommodation");
        }

        ReviewRequest reviewRequest = reviewMapper.toReviewRequest(review);
        reviewRepository.deleteById(reviewId);
        return reviewRequest;
    }

    public ReviewRequest updateReview(Long accommodationId, Long reviewId, ReviewRequest reviewRequest) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getAccommodation().getAccommodationId().equals(accommodationId)) {
            throw new ResourceNotFoundException("Review not found for this accommodation");
        }

        reviewMapper.updateReview(review, reviewRequest);
        Review updatedReview = reviewRepository.save(review);
        return reviewMapper.toReviewRequest(updatedReview);
    }
}