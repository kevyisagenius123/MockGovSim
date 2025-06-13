package com.mockgovsim.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class PollResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    // We can link to a Candidate entity later if needed
    private String candidateName;
    
    private double percentage;
} 