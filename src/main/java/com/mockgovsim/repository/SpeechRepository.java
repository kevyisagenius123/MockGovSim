package com.mockgovsim.repository;

import com.mockgovsim.domain.Speech;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeechRepository extends JpaRepository<Speech, Long> {
    List<Speech> findByBillIdOrderByCreatedAtAsc(Long billId);
} 