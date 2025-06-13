package com.mockgovsim.simulation.results.service;

import com.mockgovsim.results.dto.CandidateResultDto;
import com.mockgovsim.results.dto.CountyResultDto;
import com.mockgovsim.results.dto.StateResultDetailDto;
import com.mockgovsim.results.dto.TurnoutDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class ResultsService {

    public Object getNationalResults() {
        // This is mock data that matches the frontend's expected structure.
        List<Object> presidentialResults = Arrays.asList(
            Map.of("regionId", "CA", "leadingParty", "left", "margin", 15.2, "leader", "A. Smith"),
            Map.of("regionId", "TX", "leadingParty", "right", "margin", 8.1, "leader", "B. Jones"),
            Map.of("regionId", "FL", "leadingParty", "right", "margin", 3.3, "leader", "B. Jones"),
            Map.of("regionId", "PA", "leadingParty", "left", "margin", 1.2, "leader", "A. Smith"),
            Map.of("regionId", "OH", "leadingParty", "right", "margin", 7.8, "leader", "B. Jones"),
            Map.of("regionId", "MI", "leadingParty", "left", "margin", 2.5, "leader", "A. Smith"),
            Map.of("regionId", "GA", "leadingParty", "left", "margin", 0.2, "leader", "A. Smith"),
            Map.of("regionId", "AZ", "leadingParty", "left", "margin", 0.3, "leader", "A. Smith"),
            Map.of("regionId", "NC", "leadingParty", "right", "margin", 1.4, "leader", "B. Jones"),
            Map.of("regionId", "WI", "leadingParty", "left", "margin", 0.6, "leader", "A. Smith")
        );
        return Map.of("presidentialResults", presidentialResults);
    }

    public StateResultDetailDto getDetailedStateResults(String stateCode) {
        // This is mock data. In a real application, you would fetch this from a database.
        StateResultDetailDto stateResult = new StateResultDetailDto();
        stateResult.setStateName("California");
        stateResult.setStateCode("CA");
        stateResult.setPrecinctsReporting(485);
        stateResult.setTotalPrecincts(500);
        stateResult.setLastUpdated(LocalDateTime.now().minusMinutes(5).format(DateTimeFormatter.ofPattern("h:mm:ss a")));

        CandidateResultDto presResult1 = new CandidateResultDto(null, "A. Smith", "Progressive", 11250345, 52.3);
        CandidateResultDto presResult2 = new CandidateResultDto(null, "B. Jones", "Federalist", 9876543, 45.9);
        stateResult.setPresidentialResults(Arrays.asList(presResult1, presResult2));

        TurnoutDto turnout1 = new TurnoutDto(5800000, 3000000, 0); // Assuming total, registered
        TurnoutDto turnout2 = new TurnoutDto(13500000, 7000000, 0);
        TurnoutDto turnout3 = new TurnoutDto(21126888, 11250345, 0);
        stateResult.setVoteTrend(Arrays.asList(turnout1, turnout2, turnout3));

        return stateResult;
    }

    public List<CountyResultDto> getCountyResults(String stateCode) {
        // Mock data for counties in California (CA)
        if ("CA".equalsIgnoreCase(stateCode)) {
            CountyResultDto county1 = new CountyResultDto("Los Angeles", new TurnoutDto(2700000, 1800000, 0), null);
            CountyResultDto county2 = new CountyResultDto("San Diego", new TurnoutDto(1100000, 600000, 0), null);
            CountyResultDto county3 = new CountyResultDto("Orange", new TurnoutDto(1200000, 550000, 0), null);
            CountyResultDto county4 = new CountyResultDto("Riverside", new TurnoutDto(850000, 400000, 0), null);
            CountyResultDto county5 = new CountyResultDto("San Bernardino", new TurnoutDto(730000, 350000, 0), null);
            CountyResultDto county6 = new CountyResultDto("Santa Clara", new TurnoutDto(700000, 500000, 0), null);
            CountyResultDto county7 = new CountyResultDto("Alameda", new TurnoutDto(550000, 450000, 0), null);
            return Arrays.asList(county1, county2, county3, county4, county5, county6, county7);
        }
        // Return empty list for other states for now
        return Collections.emptyList();
    }
} 