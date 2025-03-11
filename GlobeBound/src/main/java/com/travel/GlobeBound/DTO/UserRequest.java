package com.travel.GlobeBound.DTO;

import com.travel.GlobeBound.entity.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private Long userId;
    private String username;
    private String email;
    private Integer age;
    private String phone;

    private UserType userType;
}