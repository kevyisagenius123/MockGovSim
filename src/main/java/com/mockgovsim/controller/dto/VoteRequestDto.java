package com.mockgovsim.controller.dto;

import com.mockgovsim.domain.VoteOption;
import lombok.Data;

@Data
public class VoteRequestDto {
    private Long billId;
    private Long userId;
    private VoteOption voteOption;
} 