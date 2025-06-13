package com.mockgovsim.repository;

import com.mockgovsim.domain.SimulatedVoter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimulatedVoterRepository extends JpaRepository<SimulatedVoter, String> {
} 