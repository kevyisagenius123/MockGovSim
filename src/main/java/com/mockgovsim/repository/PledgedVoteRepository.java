package com.mockgovsim.repository;

import com.mockgovsim.domain.PledgedVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PledgedVoteRepository extends JpaRepository<PledgedVote, Long> {

    @Query("SELECT pv FROM PledgedVote pv WHERE pv.bill.id = :billId")
    List<PledgedVote> findByBillId(@Param("billId") Long billId);
}