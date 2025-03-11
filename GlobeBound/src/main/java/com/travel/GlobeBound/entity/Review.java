package com.travel.GlobeBound.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    private String review;

    private Float rating;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "accommodationId", nullable = true)
    private Accommodation accommodation;
}
