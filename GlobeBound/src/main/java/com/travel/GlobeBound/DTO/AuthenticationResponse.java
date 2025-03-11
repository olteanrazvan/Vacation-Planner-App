package com.travel.GlobeBound.DTO;

import com.travel.GlobeBound.entity.enums.UserType;
import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
    private String username;
    private String role;
    private Long userId;
}
