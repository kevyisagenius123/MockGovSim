package com.mockgovsim.results.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CountyResultDto {
    private String countyName;
    private TurnoutDto turnout;
    private List<CandidateResultDto> results;
}