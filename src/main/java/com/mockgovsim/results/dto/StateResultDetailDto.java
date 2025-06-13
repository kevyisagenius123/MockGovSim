package com.mockgovsim.results.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StateResultDetailDto {
    private String stateName;
    private String stateCode;
    private int precinctsReporting;
    private int totalPrecincts;
    private String lastUpdated;
    private List<CandidateResultDto> presidentialResults;
    private List<CandidateResultDto> gubernatorialResults;
    private List<TurnoutDto> voteTrend;
} 