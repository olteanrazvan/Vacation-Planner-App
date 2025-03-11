package com.travel.GlobeBound.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.travel.GlobeBound.entity.Accommodation;
import com.travel.GlobeBound.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    private Long reviewId;

    @Size(min = 1, max = 200)
    private String review;

    @Size(min = 1, max = 5)
    private Float rating;

    @JsonIgnore
    private Accommodation accommodation;

    @JsonIgnoreProperties("reviews")
    private User user;

}
