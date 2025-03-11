package com.travel.GlobeBound.service;

import com.travel.GlobeBound.DTO.AccommodationRequest;
import com.travel.GlobeBound.entity.AccommodationPhoto;
import com.travel.GlobeBound.entity.User;
import com.travel.GlobeBound.mapper.AccommodationMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.travel.GlobeBound.repository.AccommodationPhotoRepository;
import com.travel.GlobeBound.exceptions.ResourceNotFoundException;
import com.travel.GlobeBound.exceptions.UnauthorizedException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccommodationPhotoService {
    private final AccommodationPhotoRepository photoRepository;
    private final AccommodationService accommodationService;
    private final AccommodationMapper accommodationMapper;
    private final UserService userService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // Initialize upload directory
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public AccommodationPhoto addPhoto(Long accommodationId, MultipartFile file) {
        AccommodationRequest accommodation = accommodationService.findById(accommodationId);
        User currentUser = userService.getCurrentUser();

        // Verify if current user is the owner of the accommodation
        if (!accommodation.getOwner().getUser().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedException("Only the owner can add photos");
        }

        try {
            // Create unique filename
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir).resolve(fileName);

            // Save file to filesystem
            Files.copy(file.getInputStream(), filePath);

            // Create and save photo entity
            AccommodationPhoto photo = new AccommodationPhoto();
            photo.setAccommodation(accommodationMapper.toAccommodation(accommodation));
            photo.setPhotoUrl("/uploads/" + fileName); // Store relative URL
            photo.setFileName(file.getOriginalFilename());

            return photoRepository.save(photo);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public void deletePhoto(Long photoId) {
        AccommodationPhoto photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found"));

        User currentUser = userService.getCurrentUser();
        if (!photo.getAccommodation().getOwner().getUser().getUserId().equals(currentUser.getUserId())) {
            throw new UnauthorizedException("Only the owner can delete photos");
        }

        try {
            // Delete file from filesystem
            String fileName = photo.getPhotoUrl().substring(photo.getPhotoUrl().lastIndexOf('/') + 1);
            Files.deleteIfExists(Paths.get(uploadDir).resolve(fileName));

            // Delete database record
            photoRepository.delete(photo);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    public List<AccommodationPhoto> getAccommodationPhotos(Long accommodationId) {
        return photoRepository.findByAccommodationAccommodationId(accommodationId);
    }
}