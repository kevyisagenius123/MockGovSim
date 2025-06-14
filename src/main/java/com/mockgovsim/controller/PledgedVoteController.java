package com.mockgovsim.controller;

import com.mockgovsim.domain.PledgedVote;
import com.mockgovsim.domain.VoteOption;
import com.mockgovsim.dto.PledgedVoteDto;
import com.mockgovsim.dto.PledgedVoteRequestDto;
import com.mockgovsim.service.PledgedVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pledges")
public class PledgedVoteController {

    @Autowired
    private PledgedVoteService pledgedVoteService;

    @GetMapping("/bill/{billId}")
    public ResponseEntity<List<PledgedVoteDto>> getPledgesForBill(@PathVariable("billId") Long billId) {
        List<PledgedVote> pledges = pledgedVoteService.findByBillId(billId);
        return ResponseEntity.ok(pledges.stream().map(this::convertToDto).collect(Collectors.toList()));
    }

    @GetMapping("/bill/{billId}/whip-breakdown")
    public ResponseEntity<Map<VoteOption, Long>> getWhipBreakdown(@PathVariable("billId") Long billId) {
        return ResponseEntity.ok(pledgedVoteService.getWhipBreakdown(billId));
    }

    @PostMapping
    public ResponseEntity<PledgedVoteDto> addPledge(@RequestBody PledgedVoteRequestDto request) {
        PledgedVote newPledge = pledgedVoteService.addPledgedVote(request);
        return ResponseEntity.ok(convertToDto(newPledge));
    }

    private PledgedVoteDto convertToDto(PledgedVote pledge) {
        PledgedVoteDto dto = new PledgedVoteDto();
        dto.setMemberId(pledge.getUser().getId());
        dto.setBillId(pledge.getBill().getId());
        dto.setVoteOption(pledge.getVoteOption());
        return dto;
    }
} 