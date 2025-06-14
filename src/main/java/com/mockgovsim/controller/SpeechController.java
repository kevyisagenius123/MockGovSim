package com.mockgovsim.controller;

import com.mockgovsim.controller.dto.SpeechRequestDto;
import com.mockgovsim.domain.Speech;
import com.mockgovsim.service.SpeechService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills/{billId}/speeches")
public class SpeechController {

    @Autowired
    private SpeechService speechService;

    @PostMapping
    public ResponseEntity<Speech> giveSpeech(@PathVariable("billId") Long billId, @RequestBody SpeechRequestDto speechRequest) {
        Speech newSpeech = speechService.giveSpeech(billId, speechRequest.getUserId(), speechRequest.getText());
        return ResponseEntity.ok(newSpeech);
    }

    @GetMapping
    public ResponseEntity<List<Speech>> getSpeeches(@PathVariable("billId") Long billId) {
        List<Speech> speeches = speechService.getSpeechesForBill(billId);
        return ResponseEntity.ok(speeches);
    }
} 