package com.travel.GlobeBound.controller;

import com.travel.GlobeBound.DTO.ReservationRequest;
import com.travel.GlobeBound.entity.User;
import com.travel.GlobeBound.exceptions.UnauthorizedException;
import com.travel.GlobeBound.service.UserService;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.travel.GlobeBound.service.ReservationService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/content/users/{userId}/reservations")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<ReservationRequest>> getUserReservations(@PathVariable Long userId) {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to view these reservations");
        }
        return ResponseEntity.ok(reservationService.getUserReservations(userId));
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationRequest> getReservationById(
            @PathVariable Long userId,
            @PathVariable Long reservationId) {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to view this reservation");
        }
        return ResponseEntity.ok(reservationService.getUserReservationById(userId, reservationId));
    }

    @PostMapping
    public ResponseEntity<ReservationRequest> createReservation(
            @PathVariable Long userId,
            @RequestBody ReservationRequest request) {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to create reservations for this user");
        }
        ReservationRequest reservationRequest = reservationService.createUserReservation(userId, request);
        return ResponseEntity.created(URI.create("/api/content/users/" + userId + "/reservations/" +
                reservationRequest.getReservationId())).body(reservationRequest);
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<ReservationRequest> cancelReservation(
            @PathVariable Long userId,
            @PathVariable Long reservationId) {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to cancel this reservation");
        }
        return ResponseEntity.ok(reservationService.cancelUserReservation(userId, reservationId));
    }

    @PutMapping("/{reservationId}")
    public ResponseEntity<ReservationRequest> updateReservation(
            @PathVariable Long userId,
            @PathVariable Long reservationId,
            @RequestBody ReservationRequest request) {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to update this reservation");
        }
        return ResponseEntity.ok(reservationService.updateUserReservation(userId, reservationId, request));
    }
}