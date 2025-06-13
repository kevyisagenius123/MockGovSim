package com.mockgovsim.dto;

import com.mockgovsim.domain.Amendment.AmendmentStatus;
import lombok.Data;

@Data
public class AmendmentDto {
    private Long id;
    private Long billId;
    private Long sponsorId;
    private String title;
    private String text;
    private AmendmentStatus status;
} 