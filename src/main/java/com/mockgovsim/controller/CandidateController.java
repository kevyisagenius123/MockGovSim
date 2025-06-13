package com.mockgovsim.controller;

import com.mockgovsim.domain.Candidate;
import com.mockgovsim.domain.User;
import com.mockgovsim.dto.CandidacyDeclarationRequest;
import com.mockgovsim.service.CandidateService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping("/declare")
    public ResponseEntity<Candidate> declareCandidacy(@RequestBody CandidacyDeclarationRequest request,
                                                      @AuthenticationPrincipal User user) {
        Candidate newCandidate = candidateService.declareCandidacy(request, user);
        return ResponseEntity.ok(newCandidate);
    }

    @GetMapping("/approved")
    public List<Candidate> getApprovedCandidates() {
        return candidateService.getApprovedCandidates();
    }
    
    @GetMapping("/pending")
    public List<Candidate> getPendingCandidates() {
        return candidateService.getPendingCandidates();
    }

    @GetMapping("/region")
    public List<Candidate> getCandidatesByRegion(
            @RequestParam String regionCode,
            @RequestParam String office,
            @RequestParam String electionType) {
        return candidateService.findByRegionAndOfficeAndElectionType(regionCode, office, electionType);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('GAME_ADMIN')")
    public ResponseEntity<Candidate> approveCandidate(@PathVariable Long id) {
        Candidate updatedCandidate = candidateService.approveCandidate(id);
        return ResponseEntity.ok(updatedCandidate);
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('GAME_ADMIN')")
    public ResponseEntity<Candidate> rejectCandidate(@PathVariable Long id) {
        Candidate updatedCandidate = candidateService.rejectCandidate(id);
        return ResponseEntity.ok(updatedCandidate);
    }

    @GetMapping
    public List<Candidate> getAllCandidates() {
        return candidateService.getAllCandidates();
    }
} 