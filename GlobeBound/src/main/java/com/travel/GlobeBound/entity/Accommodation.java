package com.travel.GlobeBound.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.travel.GlobeBound.entity.enums.AccommodationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accommodation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Accommodation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne
    @JoinColumn(name = "ownerId", nullable = true)
    private Owner owner;

    @OneToMany(mappedBy = "accommodation", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("accommodation")
    private List<AccommodationPhoto> photos = new ArrayList<>();

    @OneToMany(mappedBy = "accommodation", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "accommodation", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();
}