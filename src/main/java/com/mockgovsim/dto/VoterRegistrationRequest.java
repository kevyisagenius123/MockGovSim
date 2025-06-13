package com.mockgovsim.dto;

public class VoterRegistrationRequest {
    private String fullName;
    private String dob;
    private String gender;
    private String state;
    private String county;
    private String electionType;
    private String votingSystem;
    private String party;
    private String voterSignature;
    private boolean agreedToTerms;

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
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

    public String getParty() {
        return party;
    }

    public void setParty(String party) {
        this.party = party;
    }

    public String getVoterSignature() {
        return voterSignature;
    }

    public void setVoterSignature(String voterSignature) {
        this.voterSignature = voterSignature;
    }

    public boolean hasAgreedToTerms() {
        return agreedToTerms;
    }

    public void setAgreedToTerms(boolean agreedToTerms) {
        this.agreedToTerms = agreedToTerms;
    }

    @Override
    public String toString() {
        return "VoterRegistrationRequest{" +
                "fullName='" + fullName + '\'' +
                ", state='" + state + '\'' +
                ", party='" + party + '\'' +
                '}';
    }
} 