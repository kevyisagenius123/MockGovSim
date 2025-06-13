package com.mockgovsim.service;

import com.mockgovsim.domain.Amendment;
import com.mockgovsim.domain.Bill;
import com.mockgovsim.domain.User;
import com.mockgovsim.dto.AmendmentRequestDto;
import com.mockgovsim.repository.AmendmentRepository;
import com.mockgovsim.repository.BillRepository;
import com.mockgovsim.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AmendmentService {

    @Autowired
    private AmendmentRepository amendmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Amendment> findByBillId(Long billId) {
        return amendmentRepository.findByBillId(billId);
    }

    public Amendment createAmendment(AmendmentRequestDto request) {
        Bill bill = billRepository.findById(request.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        User sponsor = userRepository.findById(request.getSponsorId())
                .orElseThrow(() -> new RuntimeException("Sponsor not found"));

        Amendment amendment = new Amendment();
        amendment.setBill(bill);
        amendment.setSponsor(sponsor);
        amendment.setText(request.getText());
        // Status is set to PENDING on creation via @PrePersist

        return amendmentRepository.save(amendment);
    }

    public Amendment updateStatus(Long amendmentId, Amendment.AmendmentStatus status) {
        Amendment amendment = amendmentRepository.findById(amendmentId)
                .orElseThrow(() -> new RuntimeException("Amendment not found"));
        amendment.setStatus(status);
        return amendmentRepository.save(amendment);
    }
} 