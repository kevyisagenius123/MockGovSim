package com.mockgovsim.controller;

import com.mockgovsim.domain.User;
import com.mockgovsim.dto.AuthRequest;
import com.mockgovsim.dto.AuthResponse;
import com.mockgovsim.dto.RegisterRequest;
import com.mockgovsim.repository.UserRepository;
import com.mockgovsim.service.JwtService;
import com.mockgovsim.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            // Use the service to handle registration with proper transaction management
            User registeredUser = userService.registerUser(request);
            
            // Generate JWT token
            var jwtToken = jwtService.generateToken(registeredUser);
            logger.info("Registration successful for user: {}", registeredUser.getUsername());
            
            return ResponseEntity.ok(new AuthResponse(jwtToken));
            
        } catch (IllegalArgumentException e) {
            logger.warn("Registration validation error for user {}: {}", request.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
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