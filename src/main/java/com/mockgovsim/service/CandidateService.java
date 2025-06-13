package com.mockgovsim.service;

import com.mockgovsim.domain.Candidate;
import com.mockgovsim.domain.User;
import com.mockgovsim.dto.CandidacyDeclarationRequest;
import com.mockgovsim.repository.CandidateRepository;
import com.mockgovsim.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;

    public CandidateService(CandidateRepository candidateRepository, UserRepository userRepository) {
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
    }

    public List<Candidate> getApprovedCandidates() {
        return candidateRepository.findByStatus("APPROVED");
    }

    public List<Candidate> getPendingCandidates() {
        return candidateRepository.findByStatus("PENDING");
    }

    public List<Candidate> findByRegionAndOfficeAndElectionType(String regionCode, String office, String electionType) {
        return getApprovedCandidates().stream()
                .filter(c -> c.getRegionCode().equals(regionCode))
                .filter(c -> c.getOffice().equals(office))
                .filter(c -> c.getElectionType().equals(electionType))
                .toList();
    }

    @Transactional
    public Candidate declareCandidacy(CandidacyDeclarationRequest request, User user) {
        // TODO: Add validation from the user's feature list
        // - Age Checker
        // - Region Lock
        // - One Race Rule

        Candidate candidate = new Candidate();
        candidate.setAppUser(user);
        candidate.setFullName(request.getFullName());
        candidate.setParty(request.getParty());
        candidate.setOffice(request.getOffice());
        candidate.setRegionCode(request.getRegionCode());
        candidate.setElectionType(request.getElectionType());
        candidate.setSlogan(request.getSlogan());
        candidate.setPlatformStatement(request.getPlatformStatement());
        candidate.setPreviousPoliticalExperience(request.getPreviousPoliticalExperience());
        candidate.setPhotoUrl(request.getPhotoUrl());

        candidate.setStatus("PENDING"); // Initial status for admin review
        candidate.setDeclaredAt(LocalDateTime.now());

        return candidateRepository.save(candidate);
    }

    @Transactional
    public Candidate approveCandidate(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + candidateId));
        candidate.setStatus("APPROVED");
        return candidateRepository.save(candidate);
    }

    @Transactional
    public Candidate rejectCandidate(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found with id: " + candidateId));
        candidate.setStatus("REJECTED");
        return candidateRepository.save(candidate);
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }
} 