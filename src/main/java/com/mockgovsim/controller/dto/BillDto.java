package com.mockgovsim.controller.dto;

import com.mockgovsim.domain.BillStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BillDto {
    private Long id;
    private String title;
    private String description;
    private BillStatus status;
    private UserDto sponsor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 