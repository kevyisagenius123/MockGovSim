package com.mockgovsim.service;

import com.mockgovsim.domain.RoleType;
import com.mockgovsim.domain.User;
import com.mockgovsim.domain.UserRole;
import com.mockgovsim.dto.RegisterRequest;
import com.mockgovsim.repository.UserRepository;
import com.mockgovsim.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(RegisterRequest request) {
        logger.info("Starting registration for user: {}", request.getUsername());
        
        // Validate input
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        // Check if user already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        try {
            // Create and save user
            User user = new User();
            user.setUsername(request.getUsername().trim());
            user.setEmail(request.getEmail().trim());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            User savedUser = userRepository.save(user);
            logger.info("User saved with ID: {}", savedUser.getId());

            // Create default role
            UserRole defaultRole = new UserRole();
            defaultRole.setUser(savedUser);
            defaultRole.setType(RoleType.VOTER);
            defaultRole.setStartDate(LocalDate.now());
            defaultRole.setActive(true);
            
            UserRole savedRole = userRoleRepository.save(defaultRole);
            logger.info("Role saved with ID: {} for user: {}", savedRole.getId(), savedUser.getId());

            return savedUser;
            
        } catch (Exception e) {
            logger.error("Error during user registration for {}: {}", request.getUsername(), e.getMessage(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }
} 