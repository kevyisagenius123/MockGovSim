package com.mockgovsim.repository;

import com.mockgovsim.domain.PollingFirm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PollingFirmRepository extends JpaRepository<PollingFirm, Long> {
    List<PollingFirm> findByIsApproved(boolean isApproved);
    Optional<PollingFirm> findByUserId(Long userId);
} 