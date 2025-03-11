package com.travel.GlobeBound.service;

import com.travel.GlobeBound.DTO.ModeratorRequest;
import com.travel.GlobeBound.DTO.OwnerRequest;
import com.travel.GlobeBound.entity.Moderator;
import com.travel.GlobeBound.entity.User;
import com.travel.GlobeBound.entity.enums.UserType;
import com.travel.GlobeBound.exceptions.BadRequestException;
import com.travel.GlobeBound.exceptions.UnauthorizedException;
import com.travel.GlobeBound.mapper.ModeratorMapper;
import com.travel.GlobeBound.mapper.UserMapper;
import com.travel.GlobeBound.repository.ModeratorRepository;
import com.travel.GlobeBound.exceptions.ResourceNotFoundException;
import com.travel.GlobeBound.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModeratorService {
    private final ModeratorRepository moderatorRepository;
    private final ModeratorMapper moderatorMapper;
    private final OwnerService ownerService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<ModeratorRequest> findAll() {
        List<Moderator> moderators = moderatorRepository.findAll();
        return moderatorMapper.toModeratorRequests(moderators);
    }

    public ModeratorRequest findById(Long id) {
        Moderator moderator = moderatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Moderator not found"));
        return moderatorMapper.toModeratorRequest(moderator);
    }

    @Transactional
    public ModeratorRequest createModerator(ModeratorRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getUserType() == UserType.MODERATOR) {
            throw new BadRequestException("User is already a moderator");
        }

        user.setUserType(UserType.MODERATOR);
        userRepository.save(user);

        Moderator moderator = new Moderator();
        moderator.setUser(user);
        Moderator savedModerator = moderatorRepository.save(moderator);

        return moderatorMapper.toModeratorRequest(savedModerator);
    }

    public ModeratorRequest deleteModerator(Long id) {
        Moderator moderator = moderatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Moderator with id " + id + " not found"));
        User user = moderator.getUser();
        user.setUserType(UserType.USER);
        ModeratorRequest moderatorRequest = moderatorMapper.toModeratorRequest(moderator);
        moderatorRepository.deleteById(id);
        return moderatorRequest;
    }

    public Moderator getCurrentModerator() {
        User currentUser = userService.getCurrentUser();
        return moderatorRepository.findByUserUserId(currentUser.getUserId())
                .orElseThrow(() -> new UnauthorizedException("Current user is not a moderator"));
    }
}