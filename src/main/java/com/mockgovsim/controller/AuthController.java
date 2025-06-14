package com.mockgovsim.controller;

import com.mockgovsim.domain.RoleType;
import com.mockgovsim.domain.User;
import com.mockgovsim.domain.UserRole;
import com.mockgovsim.dto.AuthRequest;
import com.mockgovsim.dto.AuthResponse;
import com.mockgovsim.dto.RegisterRequest;
import com.mockgovsim.repository.UserRepository;
import com.mockgovsim.repository.UserRoleRepository;
import com.mockgovsim.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Check if user already exists
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().build();
            }

            // Create and save user with role in single transaction
            User user = new User();
            user.setUsername(request.getUsername().trim());
            user.setEmail(request.getEmail().trim());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            // Save user first
            User savedUser = userRepository.save(user);
            logger.info("User created with ID: {}", savedUser.getId());

            // Create default role with proper user reference
            UserRole defaultRole = new UserRole();
            defaultRole.setUser(savedUser);
            defaultRole.setType(RoleType.VOTER);
            defaultRole.setStartDate(LocalDate.now());
            defaultRole.setActive(true);
            
            // Save the role
            UserRole savedRole = userRoleRepository.save(defaultRole);
            logger.info("Role created with ID: {} for user: {}", savedRole.getId(), savedUser.getId());

            // Generate JWT token (User.getAuthorities() now has null check)
            var jwtToken = jwtService.generateToken(savedUser);
            logger.info("Registration successful for user: {}", savedUser.getUsername());
            
            return ResponseEntity.ok(new AuthResponse(jwtToken));
            
        } catch (Exception e) {
            // Log the error for debugging
            logger.error("Registration error for user {}: {}", request.getUsername(), e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername().trim(),
                            request.getPassword()
                    )
            );
            
            var user = userRepository.findByUsername(request.getUsername().trim())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));

            var jwtToken = jwtService.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(jwtToken));
            
        } catch (Exception e) {
            logger.error("Login error for user {}: {}", request.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(401).build();
        }
    }
} 