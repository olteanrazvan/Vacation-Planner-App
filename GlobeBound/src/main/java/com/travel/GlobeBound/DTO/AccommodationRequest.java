package com.travel.GlobeBound.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.travel.GlobeBound.entity.AccommodationPhoto;
import com.travel.GlobeBound.entity.Owner;
import com.travel.GlobeBound.entity.Reservation;
import com.travel.GlobeBound.entity.Review;
import com.travel.GlobeBound.entity.enums.AccommodationType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccommodationRequest {
    private Long accommodationId;
    private String name;
    private String country;
    private String city;
    private String street;
    private String description;

    private Float pricePerNight;
    private Float singleRoomPrice;
    private Float doubleRoomPrice;
    private Float tripleRoomPrice;
    private Float quadrupleRoomPrice;

    @Enumerated(EnumType.STRING)
    private AccommodationType accommodationType;

    private Integer totalSingleRooms;
    private Integer totalDoubleRooms;
    private Integer totalTripleRooms;
    private Integer totalQuadrupleRooms;

    @JsonIgnore
    private Owner owner;
    private List<AccommodationPhoto> photos;
    @JsonIgnore
    private List<Review> reviews;
    @JsonIgnore
    private List<Reservation> reservations;
}
