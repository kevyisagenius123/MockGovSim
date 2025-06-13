package com.mockgovsim.repository;

import com.mockgovsim.domain.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    List<Poll> findByElection_Id(Long electionId);
    List<Poll> findByFirm_Id(Long firmId);

    @Query("SELECT p FROM Poll p WHERE p.region = :region AND p.electionType = :electionType AND p.endDate >= :cutoffDate AND p.isPublished = true")
    List<Poll> findAllRecent(
        @Param("region") String region,
        @Param("electionType") String electionType,
        @Param("cutoffDate") LocalDate cutoffDate
    );
} 