package com.travel.GlobeBound.service;

import com.travel.GlobeBound.DTO.ChangePasswordRequest;
import com.travel.GlobeBound.DTO.OwnerRequest;
import com.travel.GlobeBound.DTO.RegisterRequest;
import com.travel.GlobeBound.DTO.UserRequest;
import com.travel.GlobeBound.entity.*;
import com.travel.GlobeBound.entity.enums.UserType;
import com.travel.GlobeBound.exceptions.ResourceNotFoundException;
import com.travel.GlobeBound.mapper.OwnerMapper;
import com.travel.GlobeBound.mapper.UserMapper;
import com.travel.GlobeBound.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.*;
import com.travel.GlobeBound.exceptions.BadRequestException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OwnerRepository ownerRepository;
    private final OwnerMapper ownerMapper;
    private final UserMapper userMapper;
    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final AccommodationRepository accommodationRepository;
    private final AccommodationPhotoRepository photoRepository;
    private final ModeratorRepository moderatorRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                getAuthorities(user.getUserType().name())
        );
    }

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAge(request.getAge());
        user.setPhone(request.getPhone());
        user.setUserType(UserType.USER);

        return userRepository.save(user);
    }

    public void changePassword(ChangePasswordRequest request) {
        User currentUser = getCurrentUser();

        if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(currentUser);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    public boolean existsByUsername(@NotBlank @Size(min = 3, max = 25) String username) {
        return userRepository.existsByUsername(username);
    }

    public UserRequest findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toUserRequest(user);
    }

    public List<UserRequest> findAll() {
        List<User> users = userRepository.findAll();
        return userMapper.toUserRequests(users);
    }

    public OwnerRequest getOwnerUser(Long userId){
        Owner owner = ownerRepository.findByUserUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return ownerMapper.toOwnerRequest(owner);
    }

    public UserRequest getCurrentUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toUserRequest(user);
    }

    public UserRequest updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }

        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        userMapper.updateUser(user, request);
        User updatedUser = userRepository.save(user);
        return userMapper.toUserRequest(updatedUser);
    }

    @Transactional
    public UserRequest deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserRequest userRequest = userMapper.toUserRequest(user);

        reviewRepository.deleteAll(reviewRepository.findByUserUserId(userId));

        reservationRepository.deleteAll(reservationRepository.findByUserUserId(userId));

        if (user.getUserType() == UserType.OWNER) {
            Optional<Owner> owner = ownerRepository.findByUserUserId(userId);
            if (owner.isPresent()) {
                List<Accommodation> accommodations = accommodationRepository.findByOwnerOwnerId(owner.get().getOwnerId());

                for (Accommodation accommodation : accommodations) {
                    List<AccommodationPhoto> photos = photoRepository.findByAccommodationAccommodationId(
                            accommodation.getAccommodationId()
                    );

                    photoRepository.deleteAll(photos);

                    reviewRepository.deleteAll(reviewRepository.findByAccommodationAccommodationId(
                            accommodation.getAccommodationId()
                    ));

                    reservationRepository.deleteAll(accommodation.getReservations());
                }

                accommodationRepository.deleteAll(accommodations);

                ownerRepository.delete(owner.get());
            }
        }

        if (user.getUserType() == UserType.MODERATOR) {
            Optional<Moderator> moderator = moderatorRepository.findByUserUserId(userId);
            moderator.ifPresent(moderatorRepository::delete);
        }

        userRepository.delete(user);

        return userRequest;
    }
}