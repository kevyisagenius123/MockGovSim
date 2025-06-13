package com.mockgovsim.repository;

import com.mockgovsim.domain.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    // This method is no longer valid as 'voterId' etc. are not properties of the new Vote entity.
    // Optional<Vote> findByVoterIdAndRegionCodeAndOfficeAndElectionType(String voterId, String regionCode, String office, String electionType);
    
} 