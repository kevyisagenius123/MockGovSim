package com.mockgovsim.service;

import com.mockgovsim.domain.Bill;
import com.mockgovsim.domain.User;
import com.mockgovsim.domain.Vote;
import com.mockgovsim.domain.VoteOption;
import com.mockgovsim.domain.BillStatus;
import com.mockgovsim.repository.BillRepository;
import com.mockgovsim.repository.UserRepository;
import com.mockgovsim.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Vote castVote(Long billId, Long userId, VoteOption voteOption) {
        Bill bill = billRepository.findById(billId).orElseThrow(() -> new RuntimeException("Bill not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (bill.getStatus() != BillStatus.VOTING) {
            throw new IllegalStateException("This bill is not currently open for voting.");
        }

        Vote vote = new Vote();
        vote.setUser(user);
        vote.setBill(bill);
        vote.setVoteOption(voteOption);

        return voteRepository.save(vote);
    }
} 