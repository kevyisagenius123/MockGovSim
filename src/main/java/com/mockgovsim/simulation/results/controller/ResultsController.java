package com.mockgovsim.simulation.results.controller;

import com.mockgovsim.results.dto.CountyResultDto;
import com.mockgovsim.results.dto.StateResultDetailDto;
import com.mockgovsim.simulation.results.service.ResultsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultsController {

    private final ResultsService resultsService;

    @GetMapping("/national")
    public ResponseEntity<Object> getNationalResults() {
        Object results = resultsService.getNationalResults();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/state/{stateCode}")
    public ResponseEntity<StateResultDetailDto> getDetailedStateResults(@PathVariable String stateCode) {
        StateResultDetailDto results = resultsService.getDetailedStateResults(stateCode);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/state/{stateCode}/counties")
    public ResponseEntity<List<CountyResultDto>> getCountyResults(@PathVariable String stateCode) {
        List<CountyResultDto> results = resultsService.getCountyResults(stateCode);
        return ResponseEntity.ok(results);
    }
} 