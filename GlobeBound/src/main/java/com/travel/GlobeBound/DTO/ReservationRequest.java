package com.travel.GlobeBound.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.travel.GlobeBound.entity.Accommodation;
import com.travel.GlobeBound.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {
    private Long reservationId;

    @JsonIgnoreProperties({"owner", "reviews", "reservations"})
    private Accommodation accommodation;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private Float totalPrice;

    private String address;

    private Integer singleRoomsNumber;

    private Integer doubleRoomsNumber;

    private Integer tripleRoomsNumber;

    private Integer quadrupleRoomsNumber;

    @JsonIgnoreProperties("reservations")
    private User user;
}
