package com.mockgovsim.dto;

import com.mockgovsim.domain.VoteOption;
import lombok.Data;

@Data
public class PledgedVoteRequestDto {
    private Long billId;
    private Long memberId;
    private VoteOption voteOption;
    private String reason;
} 