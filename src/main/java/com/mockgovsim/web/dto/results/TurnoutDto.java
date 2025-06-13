package com.mockgovsim.web.dto.results;

import lombok.Data;

@Data
public class TurnoutDto {
    private long totalVotes;
    private long eligibleVoters;
    private double turnoutPercentage;
    private double changeFromLastElection;
} 