package com.mockgovsim.web.dto.results;

import lombok.Data;

@Data
public class CandidateResultDto {
    private String candidateName;
    private String party;
    private long votes;
    private double percentage;
    private double changeFromLastElection;
} 