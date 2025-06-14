package com.mockgovsim.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mockgovsim.domain.PollingFirm;
import com.mockgovsim.service.PollingService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.fasterxml.jackson.databind.JsonNode;
import com.mockgovsim.domain.Poll;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.mockgovsim.service.PollAggregationService;
import com.mockgovsim.domain.PollRequest;
import com.mockgovsim.model.polling.PollDTO;
import com.mockgovsim.model.polling.PollingFirmDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/polling")
@RequiredArgsConstructor
public class PollingController {

    private final PollingService pollingService;
    private final PollAggregationService pollAggregationService;

    @Data
    public static class PollingFirmApplicationRequest {
        @NotBlank(message = "Firm name is required.")
        @Size(min = 3, max = 100, message = "Firm name must be between 3 and 100 characters.")
        private String name;

        @Size(max = 1000, message = "Description can be up to 1000 characters.")
        private String description;

        // The logoUrl is handled client-side or through a future dedicated endpoint
        // private String logoUrl;
    }

    @PostMapping("/firms")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> applyForPollingFirm(@Valid @RequestBody PollingFirmApplicationRequest request) {
        try {
            PollingFirm newFirm = pollingService.applyForFirm(request);
            return ResponseEntity.ok(newFirm);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/polls/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitPoll(@Valid @RequestBody PollRequest request) {
        try {
            Poll newPoll = pollingService.savePoll(request);
            return ResponseEntity.ok(newPoll);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected error occurred.");
        }
    }

    // --- Poll Endpoints ---
    @GetMapping("/polls/election/{electionId}")
    public ResponseEntity<List<Poll>> getPollsByElection(@PathVariable Long electionId) {
        return ResponseEntity.ok(pollingService.getPollsByElection(electionId));
    }

    @GetMapping("/polls/firm/{firmId}")
    public ResponseEntity<List<Poll>> getPollsByFirm(@PathVariable Long firmId) {
        return ResponseEntity.ok(pollingService.getPollsByFirm(firmId));
    }

    @GetMapping("/polls")
    public ResponseEntity<List<PollDTO>> getAllPolls() {
        return ResponseEntity.ok(pollingService.getAllPolls());
    }

    @GetMapping("/polls/{pollId}")
    public ResponseEntity<Poll> getPollById(@PathVariable Long pollId) {
        return pollingService.getPollById(pollId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/polls/{pollId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletePoll(@PathVariable Long pollId) {
        try {
            pollingService.deletePoll(pollId);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/trends")
    public ResponseEntity<?> getTrendline(
            @RequestParam String region,
            @RequestParam String electionType,
            @RequestParam(defaultValue = "90") int daysBack) {
        try {
            // Validate input parameters
            if (region == null || region.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Region parameter is required");
            }
            if (electionType == null || electionType.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("ElectionType parameter is required");
            }
            if (daysBack < 1 || daysBack > 365) {
                return ResponseEntity.badRequest().body("DaysBack must be between 1 and 365");
            }

            var result = pollAggregationService.getTrendline(region.trim(), electionType.trim(), daysBack);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid argument for trends endpoint: " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid parameters: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error in trends endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to generate trendline data: " + e.getMessage());
        }
    }

    // --- Polling Firm Endpoints ---
    @GetMapping("/firms/my-firm")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PollingFirm> getMyFirm() {
        return pollingService.getMyFirm()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/firms")
    public ResponseEntity<List<PollingFirmDTO>> getAllFirms() {
        return ResponseEntity.ok(pollingService.getAllFirms());
    }

    @GetMapping("/firms/{firmId}")
    public ResponseEntity<PollingFirmDTO> getFirmById(@PathVariable Long firmId) {
        return pollingService.getFirmById(firmId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/firms/{firmId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateFirm(@PathVariable Long firmId, @Valid @RequestBody PollingFirmApplicationRequest request) {
        try {
            PollingFirm updatedFirm = pollingService.updateFirm(firmId, request);
            return ResponseEntity.ok(updatedFirm);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/firms/{firmId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteFirm(@PathVariable Long firmId) {
        try {
            pollingService.deleteFirm(firmId);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Add new endpoint for state polling data
    @GetMapping("/states")
    public ResponseEntity<?> getStatePollingData() {
        try {
            // For now, return mock data. In a real implementation, this would aggregate 
            // actual polling data by state from the database
            Map<String, Object> mockStateData = new HashMap<>();
            
            // Sample mock data - in production this would be calculated from actual polls
            mockStateData.put("AL", Map.of("leader", "Doe", "party", "right", "margin", 15.0));
            mockStateData.put("AK", Map.of("leader", "Doe", "party", "right", "margin", 12.0));
            mockStateData.put("AZ", Map.of("leader", "Smith", "party", "left", "margin", 1.2));
            mockStateData.put("AR", Map.of("leader", "Doe", "party", "right", "margin", 20.0));
            mockStateData.put("CA", Map.of("leader", "Smith", "party", "left", "margin", 25.0));
            mockStateData.put("CO", Map.of("leader", "Smith", "party", "left", "margin", 8.0));
            mockStateData.put("CT", Map.of("leader", "Smith", "party", "left", "margin", 18.0));
            mockStateData.put("DE", Map.of("leader", "Smith", "party", "left", "margin", 22.0));
            mockStateData.put("FL", Map.of("leader", "Doe", "party", "right", "margin", 3.5));
            mockStateData.put("GA", Map.of("leader", "Smith", "party", "left", "margin", 0.8));
            mockStateData.put("HI", Map.of("leader", "Smith", "party", "left", "margin", 30.0));
            mockStateData.put("ID", Map.of("leader", "Doe", "party", "right", "margin", 25.0));
            mockStateData.put("IL", Map.of("leader", "Smith", "party", "left", "margin", 15.0));
            mockStateData.put("IN", Map.of("leader", "Doe", "party", "right", "margin", 11.0));
            mockStateData.put("IA", Map.of("leader", "Doe", "party", "right", "margin", 6.0));
            mockStateData.put("KS", Map.of("leader", "Doe", "party", "right", "margin", 14.0));
            // Add more states as needed...
            
            return ResponseEntity.ok(mockStateData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch state polling data.");
        }
    }

    // --- Admin Endpoints ---

    @GetMapping("/firms/unapproved")
    @PreAuthorize("hasRole('GAME_ADMIN')")
    public ResponseEntity<?> getUnapprovedFirms() {
        return ResponseEntity.ok(pollingService.getUnapprovedFirms());
    }

    @PostMapping("/firms/{firmId}/approve")
    @PreAuthorize("hasRole('GAME_ADMIN')")
    public ResponseEntity<?> approveFirm(@PathVariable Long firmId) {
        try {
            PollingFirm approvedFirm = pollingService.approveFirm(firmId);
            return ResponseEntity.ok(approvedFirm);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 