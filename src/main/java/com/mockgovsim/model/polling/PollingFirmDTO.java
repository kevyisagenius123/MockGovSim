package com.mockgovsim.model.polling;

import lombok.Data;

@Data
public class PollingFirmDTO {
    private Long id;
    private String name;
    private String description;
    private boolean isApproved;
    private int reputationScore;
    private String biasRating;
} 