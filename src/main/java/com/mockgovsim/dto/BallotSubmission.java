package com.mockgovsim.dto;

import java.util.List;
import java.util.Map;

public class BallotSubmission {
    private String voterId;
    private String region;
    private String electionType;
    private String votingSystem;
    private List<String> rankedCandidates;
    private List<String> approvedCandidates;
    private Map<String, Integer> scoredCandidates;

    // Getters and Setters
    public String getVoterId() {
        return voterId;
    }

    public void setVoterId(String voterId) {
        this.voterId = voterId;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getElectionType() {
        return electionType;
    }

    public void setElectionType(String electionType) {
        this.electionType = electionType;
    }

    public String getVotingSystem() {
        return votingSystem;
    }

    public void setVotingSystem(String votingSystem) {
        this.votingSystem = votingSystem;
    }

    public List<String> getRankedCandidates() {
        return rankedCandidates;
    }

    public void setRankedCandidates(List<String> rankedCandidates) {
        this.rankedCandidates = rankedCandidates;
    }

    public List<String> getApprovedCandidates() {
        return approvedCandidates;
    }

    public void setApprovedCandidates(List<String> approvedCandidates) {
        this.approvedCandidates = approvedCandidates;
    }

    public Map<String, Integer> getScoredCandidates() {
        return scoredCandidates;
    }

    public void setScoredCandidates(Map<String, Integer> scoredCandidates) {
        this.scoredCandidates = scoredCandidates;
    }
} 