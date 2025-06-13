package com.mockgovsim.repository;

import com.mockgovsim.domain.Election;
import com.mockgovsim.domain.ElectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectionRepository extends JpaRepository<Election, Long> {
    List<Election> findByStatus(ElectionStatus status);
} 