package com.travel.GlobeBound.mapper;

import com.travel.GlobeBound.DTO.OwnerRequest;
import com.travel.GlobeBound.entity.Owner;
import com.travel.GlobeBound.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OwnerMapper {
    Owner toOwner(OwnerRequest ownerRequest);
    @Mapping(target = "user", source = "user")
    Owner toOwner(OwnerRequest ownerRequest, User user);
    OwnerRequest toOwnerRequest(Owner owner);
    List<Owner> toOwners(List<OwnerRequest> ownerRequests);
    List<OwnerRequest> toOwnerRequests(List<Owner> owners);
}
