package com.mockgovsim.service;

import com.mockgovsim.dto.BallotSubmission;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class VotingService {

    public void processVote(BallotSubmission ballot) {
        // In a real implementation, you would need to validate the voter's eligibility
        // e.g., check if voter exists, hasn't voted yet in this election, etc.
        System.out.println("Processing vote for voter " + ballot.getVoterId() + " in region " + ballot.getRegion());

        switch (ballot.getVotingSystem()) {
            case "FPTP" -> processFPTP(ballot.getRankedCandidates().get(0));
            case "Ranked" -> processRankedChoice(ballot.getRankedCandidates());
            case "Approval" -> processApproval(ballot.getApprovedCandidates());
            case "Score" -> processScore(ballot.getScoredCandidates());
            default -> throw new IllegalArgumentException("Unknown voting system: " + ballot.getVotingSystem());
        }

        // Mark the voter as having voted
        // voterRepository.findById(ballot.getVoterId()).ifPresent(v -> {
        //     v.setVoted(true);
        //     voterRepository.save(v);
        // });
    }

    private void processFPTP(String winningCandidateId) {
        System.out.println("Processing FPTP vote for candidate: " + winningCandidateId);
        // Logic to increment vote count for the winning candidate
    }

    private void processRankedChoice(List<String> rankedCandidates) {
        System.out.println("Processing Ranked Choice vote for candidates: " + rankedCandidates);
        // Complex logic to handle ranked-choice vote tallying
    }

    private void processApproval(List<String> approvedCandidates) {
        System.out.println("Processing Approval vote for candidates: " + approvedCandidates);
        // Logic to increment vote counts for all approved candidates
    }

    private void processScore(Map<String, Integer> scoredCandidates) {
        System.out.println("Processing Score vote: " + scoredCandidates);
        // Logic to sum scores for each candidate
    }
} 