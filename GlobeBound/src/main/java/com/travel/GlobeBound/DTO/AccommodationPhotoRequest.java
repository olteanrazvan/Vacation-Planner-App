package com.travel.GlobeBound.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationPhotoRequest {
    private Long photoId;
    private String photoUrl;
    private String fileName;
}