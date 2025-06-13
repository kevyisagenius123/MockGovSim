package com.mockgovsim.controller;

import com.mockgovsim.dto.BallotSubmission;
import com.mockgovsim.dto.VoterRegistrationRequest;
import com.mockgovsim.service.VotingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class VotingController {

    @Autowired
    private VotingService votingService;

    @PostMapping("/vote")
    public ResponseEntity<?> vote(@RequestBody BallotSubmission submission) {
        try {
            // Add validation here: e.g., check voter eligibility, if election is open, etc.
            votingService.processVote(submission);
            return ResponseEntity.ok("Vote successfully cast.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while processing the vote.");
        }
    }

    @PostMapping("/register-voter")
    public ResponseEntity<?> registerVoter(@RequestBody VoterRegistrationRequest registrationRequest) {
        // In a real implementation, you would save this to the database via a service
        System.out.println("Received voter registration: " + registrationRequest);
        
        // Add logic to create a new SimulatedVoter and save it
        // SimulatedVoter newVoter = voterRegistrationService.register(registrationRequest);
        
        // For now, just acknowledging receipt
        return ResponseEntity.ok("Voter registration received.");
    }
} 