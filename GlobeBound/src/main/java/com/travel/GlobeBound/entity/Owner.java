package com.travel.GlobeBound.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "owner")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Owner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ownerId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId", nullable = true)
    private User user;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Accommodation> accommodations = new ArrayList<>();
}
