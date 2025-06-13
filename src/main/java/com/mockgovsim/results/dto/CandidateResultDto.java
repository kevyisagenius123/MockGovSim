package com.mockgovsim.results.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResultDto {
    private String candidateId;
    private String name;
    private String party;
    private long voteCount;
    private double percentage;
} 