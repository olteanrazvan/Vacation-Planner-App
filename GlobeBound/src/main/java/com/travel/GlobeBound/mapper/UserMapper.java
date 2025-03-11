package com.travel.GlobeBound.mapper;

import com.travel.GlobeBound.DTO.UserRequest;
import com.travel.GlobeBound.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "userType", ignore = true)
    User toUser(UserRequest request);

    @Mapping(target = "userType", source = "userType")
    UserRequest toUserRequest(User user);

    List<UserRequest> toUserRequests(List<User> users);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "userType", ignore = true)
    @Mapping(target = "userId", ignore = true)
    void updateUser(@MappingTarget User user, UserRequest request);
}