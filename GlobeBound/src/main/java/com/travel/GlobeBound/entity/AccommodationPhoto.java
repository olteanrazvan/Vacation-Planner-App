package com.travel.GlobeBound.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accommodationphoto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long photoId;

    @Column(nullable = false)
    private String photoUrl;

    @Column
    private String fileName;

    @ManyToOne
    @JoinColumn(name = "accommodationId", nullable = true)
    @JsonIgnore
    private Accommodation accommodation;
}