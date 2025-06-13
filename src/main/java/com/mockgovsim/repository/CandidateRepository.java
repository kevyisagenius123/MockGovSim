package com.mockgovsim.repository;

import com.mockgovsim.domain.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByRegionCodeAndOfficeAndElectionTypeAndStatus(
        String regionCode, String office, String electionType, String status
    );

    List<Candidate> findByStatus(String status);
} 