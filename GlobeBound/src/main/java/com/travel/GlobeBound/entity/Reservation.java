package com.travel.GlobeBound.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;

    @Column(columnDefinition = "DATE")
    private LocalDate checkIn;

    @Column(columnDefinition = "DATE")
    private LocalDate checkOut;

    private Float totalPrice;
    private String address;
    private Integer singleRoomsNumber;
    private Integer doubleRoomsNumber;
    private Integer tripleRoomsNumber;
    private Integer quadrupleRoomsNumber;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "accommodationId", nullable = true)
    private Accommodation accommodation;

}
