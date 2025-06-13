package com.mockgovsim.controller;

import com.mockgovsim.controller.dto.VoteRequestDto;
import com.mockgovsim.domain.Vote;
import com.mockgovsim.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @PostMapping("/bill/{billId}")
    public ResponseEntity<Vote> castVote(@PathVariable Long billId, @RequestBody VoteRequestDto voteRequest) {
        Vote newVote = voteService.castVote(billId, voteRequest.getUserId(), voteRequest.getVoteOption());
        return ResponseEntity.ok(newVote);
    }
} 