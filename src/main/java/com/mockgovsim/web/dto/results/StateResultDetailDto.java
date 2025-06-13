package com.mockgovsim.web.dto.results;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class StateResultDetailDto {
    private String stateName;
    private String stateCode;
    private int precinctsReporting;
    private int totalPrecincts;
    private LocalDateTime lastUpdated;
    private List<CandidateResultDto> presidentialResults;
    private List<CandidateResultDto> gubernatorialResults;
    private TurnoutDto turnout;
    // For charting: A map of timestamps to vote counts for each candidate
    private Map<String, Map<LocalDateTime, Long>> voteTrend; 
} 