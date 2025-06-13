package com.mockgovsim.results.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurnoutDto {
    private long totalVotes;
    private long registeredVoters;
    private double percentage;
} 