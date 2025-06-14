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
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
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

            // Create and save user first
            User user = new User();
            user.setUsername(request.getUsername().trim());
            user.setEmail(request.getEmail().trim());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            // Save user first without roles
            User savedUser = userRepository.save(user);

            // Create default role after user is saved
            UserRole defaultRole = new UserRole();
            defaultRole.setUser(savedUser);
            defaultRole.setType(RoleType.VOTER);
            defaultRole.setStartDate(LocalDate.now());
            defaultRole.setActive(true);
            
            // Save the role separately
            userRoleRepository.save(defaultRole);

            var jwtToken = jwtService.generateToken(savedUser);
            return ResponseEntity.ok(new AuthResponse(jwtToken));
            
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
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
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).build();
        }
    }
} 