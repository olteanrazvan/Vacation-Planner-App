package com.travel.GlobeBound.controller;

import com.travel.GlobeBound.DTO.AccommodationRequest;
import com.travel.GlobeBound.DTO.AccommodationRequest;
import com.travel.GlobeBound.entity.enums.AccommodationType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.travel.GlobeBound.service.AccommodationService;
import com.travel.GlobeBound.service.ReviewService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/content/accommodations")
@RequiredArgsConstructor
public class AccommodationController {
    private final AccommodationService accommodationService;
    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<AccommodationRequest>> getAllAccommodations(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) AccommodationType type) {
        return ResponseEntity.ok(accommodationService.findAccommodations(city, type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccommodationRequest> getAccommodation(@PathVariable Long id) {
        return ResponseEntity.ok(accommodationService.findById(id));
    }

    @PostMapping()
    public ResponseEntity<AccommodationRequest> createAccommodation(@RequestBody AccommodationRequest accommodationRequest) {
        AccommodationRequest request = accommodationService.add(accommodationRequest);
        return ResponseEntity.created(URI.create("/api/content/accommodations/" + request.getAccommodationId())).body(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AccommodationRequest> deleteAccommodation(@PathVariable Long id) {
        return ResponseEntity.ok(accommodationService.delete(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccommodationRequest> updateAccommodation(
            @PathVariable Long id,
            @RequestBody AccommodationRequest request) {
        return ResponseEntity.ok(accommodationService.update(id, request));
    }
}