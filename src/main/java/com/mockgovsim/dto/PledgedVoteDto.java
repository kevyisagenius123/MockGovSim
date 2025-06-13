package com.mockgovsim.dto;

import com.mockgovsim.domain.VoteOption;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PledgedVoteDto {
    private Long memberId;
    private Long billId;
    private VoteOption voteOption;
    private LocalDateTime pledgedAt;
} 