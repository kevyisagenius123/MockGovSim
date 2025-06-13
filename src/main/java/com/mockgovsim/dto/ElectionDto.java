package com.mockgovsim.dto;

import com.mockgovsim.domain.ElectionStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ElectionDto {
    private Long id;
    private String name;
    private String country;
    private String region;
    private String office;
    private String electionType;
    private String votingSystem;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ElectionStatus status;
} 