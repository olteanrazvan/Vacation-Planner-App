package com.travel.GlobeBound.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.travel.GlobeBound.entity.Accommodation;
import com.travel.GlobeBound.entity.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OwnerRequest {
    private Long ownerId;

    @JsonIgnoreProperties("reviews")
    private User user;

    @JsonIgnore
    private List<Accommodation> accommodations = new ArrayList<>();
}
