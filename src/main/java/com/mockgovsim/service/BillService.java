package com.mockgovsim.service;

import com.mockgovsim.domain.Bill;
import com.mockgovsim.domain.BillStatus;
import com.mockgovsim.domain.User;
import com.mockgovsim.repository.BillRepository;
import com.mockgovsim.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mockgovsim.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Bill createBill(String title, String description, Long sponsorId) {
        User sponsor = userRepository.findById(sponsorId)
                .orElseThrow(() -> new IllegalArgumentException("Sponsor not found"));

        Bill bill = new Bill();
        bill.setTitle(title);
        bill.setDescription(description);
        bill.setSponsor(sponsor);
        // Status is automatically set to INTRODUCED by @PrePersist

        return billRepository.save(bill);
    }

    @Transactional(readOnly = true)
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found"));
    }

    @Transactional
    public Bill updateBillStatus(Long billId, BillStatus newStatus) {
        Bill bill = getBillById(billId);

        // Add logic here to validate status transitions, e.g.,
        // a bill can only move from INTRODUCED to DEBATE.
        
        bill.setStatus(newStatus);
        return billRepository.save(bill);
    }

    @Transactional(readOnly = true)
    public Bill getLatestBill() {
        return billRepository.findTopByOrderByCreatedAtDesc()
                .orElse(null);
    }
} 