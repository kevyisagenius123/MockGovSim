package com.mockgovsim.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String country;
    private String region; // e.g., State, Province
    private String office; // e.g., President, Governor, Senator

    @Column(nullable = false)
    private String electionType; // e.g., GENERAL, PRIMARY, RUNOFF

    private String votingSystem; // e.g., FPTP, RCV, APPROVAL

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ElectionStatus status;
} 