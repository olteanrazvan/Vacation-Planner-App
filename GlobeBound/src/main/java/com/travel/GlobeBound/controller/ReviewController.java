package com.travel.GlobeBound.controller;

import com.travel.GlobeBound.DTO.ReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.travel.GlobeBound.service.ReviewService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/content/accommodations/{accommodationId}/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewRequest>> findAllByAccommodation(@PathVariable Long accommodationId) {
        return ResponseEntity.ok(reviewService.findAllByAccommodation(accommodationId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewRequest> findById(@PathVariable Long accommodationId, @PathVariable Long id) {
        return ResponseEntity.ok(reviewService.findById(accommodationId, id));
    }

    @PostMapping
    public ResponseEntity<ReviewRequest> createReview(
            @PathVariable Long accommodationId,
            @RequestBody ReviewRequest request) {
        ReviewRequest reviewRequest = reviewService.createReview(request, accommodationId);
        return ResponseEntity.created(URI.create("/api/content/accommodations/" + accommodationId + "/reviews/" + reviewRequest.getReviewId()))
                .body(reviewRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ReviewRequest> deleteReview(
            @PathVariable Long accommodationId,
            @PathVariable Long id) {
        return ResponseEntity.ok(reviewService.deleteReview(accommodationId, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewRequest> updateReview(
            @PathVariable Long accommodationId,
            @PathVariable Long id,
            @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(accommodationId, id, request));
    }
}