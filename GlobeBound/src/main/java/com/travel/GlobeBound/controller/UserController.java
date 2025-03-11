package com.travel.GlobeBound.controller;

import com.travel.GlobeBound.DTO.OwnerRequest;
import com.travel.GlobeBound.DTO.UserRequest;
import com.travel.GlobeBound.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/content/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserRequest> getCurrentUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getCurrentUserById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserRequest>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserRequest> updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserRequest> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @GetMapping("/owner/{userId}")
    public ResponseEntity<OwnerRequest> getOwner(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getOwnerUser(userId));
    }
}