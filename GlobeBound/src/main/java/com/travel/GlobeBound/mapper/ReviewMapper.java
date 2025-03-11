package com.travel.GlobeBound.mapper;

import com.travel.GlobeBound.DTO.ReservationRequest;
import com.travel.GlobeBound.DTO.ReviewRequest;
import com.travel.GlobeBound.entity.Reservation;
import com.travel.GlobeBound.entity.Review;
import com.travel.GlobeBound.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    Review toReview(ReviewRequest reviewRequest);
    ReviewRequest toReviewRequest(Review review);
    List<Review> toReview(List<ReviewRequest> reviewRequests);
    List<ReviewRequest> toReviewRequests(List<Review> review);
    @Mapping(target = "reviewId", ignore = true)
    void updateReview(@MappingTarget Review review, ReviewRequest reviewRequest);
    @Mapping(target = "user", source = "currentUser")
    ReviewRequest toReviewRequest(Review review, User currentUser);
    @Mapping(target = "user", source = "currentUser")
    Review toReview(ReviewRequest reviewRequest, User currentUser);
}
