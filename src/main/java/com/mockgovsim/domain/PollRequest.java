package com.mockgovsim.domain;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PollRequest {
    private String title;
    private String pollster;
    private String electionType;
    private String region;
    private Long firmId;
    private Long electionId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer sampleSize;
    private Double marginOfError;
    private String methodology;
    private boolean isPublished;
    private List<PollResultRequest> results;

    @Data
    public static class PollResultRequest {
        private String candidateName;
        private double percentage;
    }
} 