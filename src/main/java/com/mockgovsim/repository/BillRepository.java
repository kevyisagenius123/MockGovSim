package com.mockgovsim.repository;

import com.mockgovsim.domain.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findTopByOrderByCreatedAtDesc();
} 