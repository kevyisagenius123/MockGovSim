package com.mockgovsim.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String pollster; // This could be the firm's name
    private String electionType;
    private String region; // e.g., "National", "CA-ON"
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "firm_id")
    @JsonBackReference
    private PollingFirm firm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "election_id")
    private Election election;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PollResult> results;

    private Integer sampleSize;
    private String methodology; // e.g., "Online Panel", "IVR"
    private LocalDate startDate;
    private LocalDate endDate;
    private Double marginOfError;
    private boolean isPublished;
} 