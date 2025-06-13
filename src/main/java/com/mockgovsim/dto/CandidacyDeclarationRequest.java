package com.mockgovsim.dto;

import lombok.Data;

@Data
public class CandidacyDeclarationRequest {
    private String fullName;
    private String party;
    private String office;
    private String regionCode;
    private String electionType;
    private String slogan;
    private String platformStatement;
    private String previousPoliticalExperience;
    private String photoUrl;
} 