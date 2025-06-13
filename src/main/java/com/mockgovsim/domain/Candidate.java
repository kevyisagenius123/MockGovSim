package com.mockgovsim.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User appUser;

    private String fullName;
    private String party;
    private String office; // e.g., President, MP, Premier
    private String regionCode; // FIPS or CA-ON-001
    private String electionType; // GENERAL, PRIMARY, etc.
    private String slogan;

    @Column(length = 3000)
    private String platformStatement;

    @Column(length = 3000)
    private String previousPoliticalExperience;

    private String photoUrl;
    private String status; // PENDING, APPROVED, REJECTED, WITHDRAWN
    private LocalDateTime declaredAt;
} 