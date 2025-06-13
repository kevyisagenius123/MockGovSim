package com.mockgovsim.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PollingFirm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @OneToMany(mappedBy = "firm", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Poll> polls;

    // The user who owns and manages the firm. Storing ID for loose coupling.
    private Long userId; 
    
    // Admin-controlled fields
    private boolean isApproved = false;
    private int reputationScore; // A score from 0-100, managed by admins.
    private String biasRating; // e.g., "Lean Liberal", "Center-Right"
} 