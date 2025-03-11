package com.travel.GlobeBound.mapper;

import com.travel.GlobeBound.DTO.ModeratorRequest;
import com.travel.GlobeBound.entity.Moderator;
import com.travel.GlobeBound.entity.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ModeratorMapper {
    @Mapping(target = "user", source = "user")
    Moderator toModerator(ModeratorRequest request, User user);

    ModeratorRequest toModeratorRequest(Moderator moderator);

    List<ModeratorRequest> toModeratorRequests(List<Moderator> moderators);

    void updateModerator(@MappingTarget Moderator moderator, ModeratorRequest request);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "user", ignore = true)
    void updateModeratorFromRequest(@MappingTarget Moderator moderator, ModeratorRequest request);
}