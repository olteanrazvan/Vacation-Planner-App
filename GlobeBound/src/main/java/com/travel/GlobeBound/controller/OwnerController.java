package com.travel.GlobeBound.controller;

import com.travel.GlobeBound.DTO.AccommodationPhotoRequest;
import com.travel.GlobeBound.DTO.AccommodationRequest;
import com.travel.GlobeBound.DTO.OwnerRequest;
import com.travel.GlobeBound.service.AccommodationService;
import com.travel.GlobeBound.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/owners")
@RequiredArgsConstructor
public class OwnerController {
    private final OwnerService ownerService;
    private final AccommodationService accommodationService;

    @GetMapping("/{ownerId}/accommodations")
    public ResponseEntity<List<AccommodationRequest>> getOwnerAccommodations(@PathVariable Long ownerId) {
        return ResponseEntity.ok(ownerService.getMyAccommodations(ownerId));
    }

    @GetMapping("/{ownerId}/accommodations/{accommodationId}")
    public ResponseEntity<AccommodationRequest> getOwnerAccommodation(
            @PathVariable Long ownerId,
            @PathVariable Long accommodationId) {
        return ResponseEntity.ok(ownerService.getMyAccommodation(ownerId, accommodationId));
    }

    @PostMapping("/{ownerId}/accommodations")
    public ResponseEntity<AccommodationRequest> createAccommodation(
            @PathVariable Long ownerId,
            @RequestBody AccommodationRequest request) {
        AccommodationRequest response = ownerService.createAccommodation(request, ownerId);
        return ResponseEntity.created(URI.create("/api/owners/" + ownerId + "/accommodations/" + response.getAccommodationId()))
                .body(response);
    }

    @PutMapping("/{ownerId}/accommodations/{accommodationId}")
    public ResponseEntity<AccommodationRequest> updateAccommodation(
            @PathVariable Long ownerId,
            @PathVariable Long accommodationId,
            @RequestBody AccommodationRequest request) {
        return ResponseEntity.ok(ownerService.updateAccommodation(ownerId, accommodationId, request));
    }

    @DeleteMapping("/{ownerId}/accommodations/{accommodationId}")
    public ResponseEntity<AccommodationRequest> deleteAccommodation(
            @PathVariable Long ownerId,
            @PathVariable Long accommodationId) {
        return ResponseEntity.ok(ownerService.deleteAccommodation(ownerId, accommodationId));
    }

    @PostMapping("/{ownerId}/accommodations/{accommodationId}/photos")
    public ResponseEntity<List<AccommodationPhotoRequest>> addPhotos(
            @PathVariable Long ownerId,
            @PathVariable Long accommodationId,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(accommodationService.addPhotos(ownerId, accommodationId, files));
    }

    @DeleteMapping("/{ownerId}/accommodations/{accommodationId}/photos/{photoId}")
    public ResponseEntity<AccommodationPhotoRequest> deletePhoto(
            @PathVariable Long ownerId,
            @PathVariable Long accommodationId,
            @PathVariable Long photoId) {
        return ResponseEntity.ok(accommodationService.deletePhoto(ownerId, accommodationId, photoId));
    }

    @GetMapping("/{ownerId}/accommodations/{accommodationId}/photos")
    public ResponseEntity<List<AccommodationPhotoRequest>> getAccommodationPhotos(
            @PathVariable Long ownerId,
            @PathVariable Long accommodationId) {
        return ResponseEntity.ok(accommodationService.getAccommodationPhotos(ownerId, accommodationId));
    }

    @GetMapping
    public ResponseEntity<List<OwnerRequest>> getOwners() {
        return ResponseEntity.ok(ownerService.findAll());
    }

    @PostMapping
    public ResponseEntity<OwnerRequest> createOwner(@RequestBody OwnerRequest request) {
        return ResponseEntity.ok(ownerService.createOwner(request));
    }
}