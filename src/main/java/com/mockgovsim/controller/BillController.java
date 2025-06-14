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
        try {
            // Validate input
            if (billRequest == null) {
                return ResponseEntity.badRequest().build();
            }
            if (billRequest.getTitle() == null || billRequest.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (billRequest.getDescription() == null || billRequest.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (billRequest.getSponsorId() == null || billRequest.getSponsorId() <= 0) {
                return ResponseEntity.badRequest().build();
            }
            
            Bill newBill = billService.createBill(
                billRequest.getTitle().trim(), 
                billRequest.getDescription().trim(), 
                billRequest.getSponsorId()
            );
            return ResponseEntity.ok(newBill);
        } catch (IllegalArgumentException e) {
            System.err.println("Error creating bill: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Unexpected error creating bill: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<BillDto>> getAllBills() {
        List<Bill> bills = billService.getAllBills();
        if (bills.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(bills.stream().map(this::convertToDto).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillDto> getBillById(@PathVariable("id") Long id) {
        try {
            // Validate input
            if (id == null || id <= 0) {
                return ResponseEntity.badRequest().build();
            }
            
            Bill bill = billService.getBillById(id);
            return ResponseEntity.ok(convertToDto(bill));
        } catch (IllegalArgumentException e) {
            System.err.println("Bill not found with id: " + id + " - " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error fetching bill with id: " + id + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<BillDto> getLatestBill() {
        try {
            Bill latestBill = billService.getLatestBill();
            if (latestBill == null) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(convertToDto(latestBill));
        } catch (Exception e) {
            // Log the exception for debugging purposes
            // In a real app, you'd use a proper logger
            System.out.println("Error fetching latest bill: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('SPEAKER')")
    public ResponseEntity<Bill> updateBillStatus(@PathVariable("id") Long id, @RequestBody UpdateBillStatusDto statusDto) {
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