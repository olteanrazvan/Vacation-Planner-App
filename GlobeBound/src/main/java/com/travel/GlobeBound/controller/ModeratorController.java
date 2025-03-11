package com.travel.GlobeBound.controller;

import com.travel.GlobeBound.DTO.ModeratorRequest;
import com.travel.GlobeBound.DTO.OwnerRequest;
import com.travel.GlobeBound.service.ModeratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ModeratorController {
    private final ModeratorService moderatorService;

    @GetMapping("/moderators")
    public ResponseEntity<List<ModeratorRequest>> findAll() {
        return ResponseEntity.ok(moderatorService.findAll());
    }

    @GetMapping("/moderators/{id}")
    public ResponseEntity<ModeratorRequest> findById(@PathVariable Long id) {
        return ResponseEntity.ok(moderatorService.findById(id));
    }

    @PostMapping("/moderators")
    public ResponseEntity<ModeratorRequest> createModerator(@RequestBody ModeratorRequest request) {
        ModeratorRequest moderatorRequest = moderatorService.createModerator(request);
        return ResponseEntity.created(URI.create("api/moderators/" + moderatorRequest.getModId())).body(moderatorRequest);
    }

    @DeleteMapping("/moderators/{id}")
    public ResponseEntity<ModeratorRequest> deleteModerator(@PathVariable Long id) {
        return ResponseEntity.ok(moderatorService.deleteModerator(id));
    }
}