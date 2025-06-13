package com.mockgovsim.controller;

import com.mockgovsim.domain.Election;
import com.mockgovsim.dto.ElectionDto;
import com.mockgovsim.service.ElectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
@RequiredArgsConstructor
public class ElectionController {

    private final ElectionService electionService;

    @GetMapping
    public List<Election> getAllElections() {
        return electionService.getAllElections();
    }

    @PostMapping
    @PreAuthorize("hasRole('GAME_ADMIN')")
    public Election createElection(@RequestBody ElectionDto electionDto) {
        return electionService.createElection(electionDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GAME_ADMIN')")
    public ResponseEntity<Election> updateElection(@PathVariable Long id, @RequestBody ElectionDto electionDto) {
        Election updatedElection = electionService.updateElection(id, electionDto);
        return ResponseEntity.ok(updatedElection);
    }
} 