package com.mockgovsim.controller;

import com.mockgovsim.domain.Amendment;
import com.mockgovsim.dto.AmendmentRequestDto;
import com.mockgovsim.service.AmendmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amendments")
public class AmendmentController {

    @Autowired
    private AmendmentService amendmentService;

    @GetMapping("/bill/{billId}")
    public ResponseEntity<List<Amendment>> getAmendmentsForBill(@PathVariable Long billId) {
        return ResponseEntity.ok(amendmentService.findByBillId(billId));
    }

    @PostMapping
    public ResponseEntity<Amendment> createAmendment(@RequestBody AmendmentRequestDto request) {
        return ResponseEntity.ok(amendmentService.createAmendment(request));
    }

    @PutMapping("/{amendmentId}/status")
    public ResponseEntity<Amendment> updateAmendmentStatus(
            @PathVariable Long amendmentId,
            @RequestParam("status") Amendment.AmendmentStatus status) {
        return ResponseEntity.ok(amendmentService.updateStatus(amendmentId, status));
    }
} 