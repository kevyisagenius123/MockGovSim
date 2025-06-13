package com.mockgovsim.service;

import com.mockgovsim.domain.Bill;
import com.mockgovsim.domain.Speech;
import com.mockgovsim.domain.User;
import com.mockgovsim.repository.BillRepository;
import com.mockgovsim.repository.SpeechRepository;
import com.mockgovsim.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SpeechService {

    @Autowired
    private SpeechRepository speechRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BillRepository billRepository;

    @Transactional
    public Speech giveSpeech(Long billId, Long userId, String text) {
        User speaker = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found"));

        // Add any business logic here, e.g., checking if debate is open,
        // or limiting speeches per user.

        Speech speech = new Speech();
        speech.setSpeaker(speaker);
        speech.setBill(bill);
        speech.setText(text);

        return speechRepository.save(speech);
    }

    public List<Speech> getSpeechesForBill(Long billId) {
        return speechRepository.findByBillIdOrderByCreatedAtAsc(billId);
    }
} 