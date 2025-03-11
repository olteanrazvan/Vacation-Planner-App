package com.travel.GlobeBound.DTO;

import com.travel.GlobeBound.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModeratorRequest {
    private Long modId;
    private Long userId;
}
