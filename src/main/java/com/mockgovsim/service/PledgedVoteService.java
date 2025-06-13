package com.mockgovsim.service;

import com.mockgovsim.domain.Bill;
import com.mockgovsim.domain.PledgedVote;
import com.mockgovsim.domain.User;
import com.mockgovsim.domain.VoteOption;
import com.mockgovsim.dto.PledgedVoteRequestDto;
import com.mockgovsim.repository.BillRepository;
import com.mockgovsim.repository.PledgedVoteRepository;
import com.mockgovsim.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.EnumMap;

@Service
public class PledgedVoteService {

    @Autowired
    private PledgedVoteRepository pledgedVoteRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PledgedVote> findByBillId(Long billId) {
        return pledgedVoteRepository.findByBillId(billId);
    }

    public PledgedVote addPledgedVote(PledgedVoteRequestDto request) {
        Bill bill = billRepository.findById(request.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        User member = userRepository.findById(request.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        PledgedVote pledgedVote = new PledgedVote(member, bill, request.getVoteOption());

        return pledgedVoteRepository.save(pledgedVote);
    }

    public Map<VoteOption, Long> getWhipBreakdown(Long billId) {
        // Initialize the map with all vote types and zero counts.
        Map<VoteOption, Long> breakdown = new EnumMap<>(VoteOption.class);
        for (VoteOption type : VoteOption.values()) {
            breakdown.put(type, 0L);
        }

        // Fetch votes and update the counts.
        List<PledgedVote> votes = pledgedVoteRepository.findByBillId(billId);
        if (votes != null) {
            for (PledgedVote vote : votes) {
                if (vote != null && vote.getVoteOption() != null) {
                    breakdown.merge(vote.getVoteOption(), 1L, Long::sum);
                }
            }
        }
        return breakdown;
    }
} 