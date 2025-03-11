package com.travel.GlobeBound.repository;

import com.travel.GlobeBound.entity.Moderator;
import com.travel.GlobeBound.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModeratorRepository extends JpaRepository<Moderator, Long> {
    Optional<Moderator> findByUserUserId(Long userId);
    boolean existsByUserUserId(Long userId);

    boolean existsByUser(User user);
}
