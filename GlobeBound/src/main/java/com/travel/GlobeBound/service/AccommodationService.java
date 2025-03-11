package com.travel.GlobeBound.service;

import com.travel.GlobeBound.DTO.AccommodationPhotoRequest;
import com.travel.GlobeBound.DTO.AccommodationRequest;
import com.travel.GlobeBound.entity.Accommodation;
import com.travel.GlobeBound.entity.AccommodationPhoto;
import com.travel.GlobeBound.entity.enums.AccommodationType;
import com.travel.GlobeBound.exceptions.BadRequestException;
import com.travel.GlobeBound.exceptions.UnauthorizedException;
import com.travel.GlobeBound.mapper.AccommodationMapper;
import com.travel.GlobeBound.mapper.AccommodationPhotoMapper;
import com.travel.GlobeBound.repository.AccommodationPhotoRepository;
import jakarta.annotation.PostConstruct;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.*;
import com.travel.GlobeBound.repository.AccommodationRepository;
import com.travel.GlobeBound.exceptions.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccommodationService {
    private final AccommodationRepository accommodationRepository;
    private final AccommodationMapper accommodationMapper;
    private final AccommodationPhotoRepository photoRepository;
    private final AccommodationPhotoMapper photoMapper;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public List<AccommodationRequest> findAccommodations(String city, AccommodationType type) {
        List<Accommodation> accommodations;
        if (city != null && type != null) {
            accommodations = accommodationRepository.findByCityAndAccommodationType(city, type);
        } else if (city != null) {
            accommodations = accommodationRepository.findByCity(city);
        } else if (type != null) {
            accommodations = accommodationRepository.findByAccommodationType(type);
        } else {
            accommodations = accommodationRepository.findAll();
        }
        return accommodationMapper.toAccommodationRequests(accommodations);
    }

    public AccommodationRequest findById(Long id) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));
        return accommodationMapper.toAccommodationRequest(accommodation);
    }

    public AccommodationRequest delete(Long id) {
        Accommodation accommodation = accommodationRepository.findById(id).orElseThrow(() -> (new ResourceNotFoundException("Accommodation with id " + id + " not found")));
        AccommodationRequest accommodationRequest = accommodationMapper.toAccommodationRequest(accommodation);
        return accommodationRequest;
    }

    public AccommodationRequest update(Long accommodationId, AccommodationRequest request) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId).orElseThrow(() -> (new ResourceNotFoundException("Accommodation with id " + accommodationId + " not found")));
        accommodationMapper.updateAccommodation(accommodation, request);
        return accommodationMapper.toAccommodationRequest(accommodation);
    }

    public AccommodationRequest add(AccommodationRequest request) {
        return request;
    }

    public boolean isOwner(Long accommodationId, Principal principal) {
        AccommodationRequest accommodationRequest = findById(accommodationId);
        return accommodationRequest.getOwner().getUser().getUsername().equals(principal.getName());
    }

    public List<AccommodationPhotoRequest> addPhotos(Long ownerId, Long accommodationId, List<MultipartFile> files) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        if (!accommodation.getOwner().getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to add photos to this accommodation");
        }

        List<AccommodationPhoto> savedPhotos = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir).resolve(fileName);

            try {
                Files.copy(file.getInputStream(), filePath);
                AccommodationPhoto photo = new AccommodationPhoto();
                photo.setAccommodation(accommodation);
                photo.setPhotoUrl("http://localhost:8080/uploads/" + fileName);
                photo.setFileName(fileName);
                savedPhotos.add(photoRepository.save(photo));
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }
        }

        return photoMapper.toAccommodationPhotoRequests(savedPhotos);
    }

    public AccommodationPhotoRequest deletePhoto(Long ownerId, Long accommodationId, Long photoId) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        if (!accommodation.getOwner().getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to delete photos from this accommodation");
        }

        AccommodationPhoto photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found"));

        if (!photo.getAccommodation().getAccommodationId().equals(accommodationId)) {
            throw new BadRequestException("Photo does not belong to this accommodation");
        }

        try {
            String fileName = photo.getPhotoUrl().substring(photo.getPhotoUrl().lastIndexOf('/') + 1);
            Files.deleteIfExists(Paths.get(uploadDir).resolve(fileName));

            AccommodationPhotoRequest photoRequest = photoMapper.toAccommodationPhotoRequest(photo);
            photoRepository.delete(photo);
            return photoRequest;

        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    public List<AccommodationPhotoRequest> getAccommodationPhotos(Long ownerId, Long accommodationId) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        if (!accommodation.getOwner().getOwnerId().equals(ownerId)) {
            throw new UnauthorizedException("Not authorized to view photos for this accommodation");
        }

        List<AccommodationPhoto> photos = photoRepository.findByAccommodationAccommodationId(accommodationId);
        return photoMapper.toAccommodationPhotoRequests(photos);
    }

    public AccommodationRequest update(Long accommodationId, AccommodationRequest request, Principal principal) {
        if (!isOwner(accommodationId, principal)) {
            throw new UnauthorizedException("Only the owner can update the accommodation");
        }

        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found"));

        accommodationMapper.updateAccommodation(accommodation, request);
        Accommodation updatedAccommodation = accommodationRepository.save(accommodation);
        return accommodationMapper.toAccommodationRequest(updatedAccommodation);
    }
}
