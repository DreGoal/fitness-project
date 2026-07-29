package com.fitness.userservice.repository;

import com.fitness.userservice.models.User;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    boolean existsByKeyClockId(String id);

    User findByEmail(@Email(message="Invalid email format") String email);
}
