package com.mockgovsim.model.polling;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PollDTO {
    private Long id;
    private String title;
    private String electionType;
    private String region;
    private PollingFirmDTO firm;
    private List<PollResultDTO> results;
    private Integer sampleSize;
    private String methodology;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double marginOfError;
    private boolean isPublished;
} 