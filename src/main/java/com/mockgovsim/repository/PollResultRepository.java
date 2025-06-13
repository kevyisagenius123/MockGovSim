package com.mockgovsim.repository;

import com.mockgovsim.domain.Poll;
import com.mockgovsim.domain.PollResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollResultRepository extends JpaRepository<PollResult, Long> {

    List<PollResult> findByPoll(Poll poll);
    
    List<PollResult> findByPollId(Long pollId);
} 