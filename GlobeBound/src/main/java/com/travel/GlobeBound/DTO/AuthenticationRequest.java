package com.travel.GlobeBound.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {
    private String username;
    private String password;
}
