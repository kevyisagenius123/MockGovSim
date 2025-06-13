package com.mockgovsim.controller.dto;

import lombok.Data;

@Data
public class SpeechRequestDto {
    private Long userId;
    private String text;
} 