package com.mockgovsim.controller;

import com.mockgovsim.domain.RoleType;
import com.mockgovsim.domain.User;
import com.mockgovsim.domain.UserRole;
import com.mockgovsim.dto.AuthRequest;
import com.mockgovsim.dto.AuthResponse;
import com.mockgovsim.dto.RegisterRequest;
import com.mockgovsim.repository.UserRepository;
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
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Like, make sure the user doesn't already exist, that would be so awkward.
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().build(); // Or some other error
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Every new user is, like, totally a voter by default.
        UserRole defaultRole = new UserRole();
        defaultRole.setUser(user);
        defaultRole.setType(RoleType.VOTER);
        defaultRole.setStartDate(LocalDate.now());
        defaultRole.setActive(true);
        user.setRoles(Set.of(defaultRole));

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        // If we get here, the user is, like, totally authenticated!
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(); // This should, like, never happen if auth passed.

        var jwtToken = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }
} 