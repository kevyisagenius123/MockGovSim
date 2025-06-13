package com.mockgovsim.controller;

import com.mockgovsim.controller.dto.BillDto;
import com.mockgovsim.controller.dto.BillRequestDto;
import com.mockgovsim.controller.dto.UpdateBillStatusDto;
import com.mockgovsim.controller.dto.UserDto;
import com.mockgovsim.domain.Bill;
import com.mockgovsim.domain.User;
import com.mockgovsim.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody BillRequestDto billRequest) {
        Bill newBill = billService.createBill(billRequest.getTitle(), billRequest.getDescription(), billRequest.getSponsorId());
        return ResponseEntity.ok(newBill);
    }

    @GetMapping
    public ResponseEntity<List<BillDto>> getAllBills() {
        List<Bill> bills = billService.getAllBills();
        return ResponseEntity.ok(bills.stream().map(this::convertToDto).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillDto> getBillById(@PathVariable Long id) {
        Bill bill = billService.getBillById(id);
        return ResponseEntity.ok(convertToDto(bill));
    }

    @GetMapping("/latest")
    public ResponseEntity<BillDto> getLatestBill() {
        try {
            Bill latestBill = billService.getLatestBill();
            return ResponseEntity.ok(convertToDto(latestBill));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('SPEAKER')")
    public ResponseEntity<Bill> updateBillStatus(@PathVariable Long id, @RequestBody UpdateBillStatusDto statusDto) {
        Bill updatedBill = billService.updateBillStatus(id, statusDto.getStatus());
        return ResponseEntity.ok(updatedBill);
    }

    private BillDto convertToDto(Bill bill) {
        BillDto dto = new BillDto();
        dto.setId(bill.getId());
        dto.setTitle(bill.getTitle());
        dto.setDescription(bill.getDescription());
        dto.setStatus(bill.getStatus());
        dto.setCreatedAt(bill.getCreatedAt());
        dto.setUpdatedAt(bill.getUpdatedAt());

        if (bill.getSponsor() != null) {
            UserDto sponsorDto = new UserDto();
            sponsorDto.setId(bill.getSponsor().getId());
            sponsorDto.setUsername(bill.getSponsor().getUsername());
            dto.setSponsor(sponsorDto);
        }

        return dto;
    }
} 