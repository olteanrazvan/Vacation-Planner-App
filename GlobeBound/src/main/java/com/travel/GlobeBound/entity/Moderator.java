package com.travel.GlobeBound.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "moderator")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Moderator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long modId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId", nullable = true)
    private User user;
}
