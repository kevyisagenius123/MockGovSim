package com.mockgovsim.dto;

import lombok.Data;

@Data
public class AmendmentRequestDto {
    private Long billId;
    private Long sponsorId;
    private String title;
    private String text;
} 