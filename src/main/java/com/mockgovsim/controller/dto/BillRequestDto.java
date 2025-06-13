package com.mockgovsim.controller.dto;

import lombok.Data;

@Data
public class BillRequestDto {
    private String title;
    private String description;
    private Long sponsorId;
} 