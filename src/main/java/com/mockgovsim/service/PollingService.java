package com.mockgovsim.service;

import com.mockgovsim.domain.Poll;
import com.mockgovsim.domain.PollResult;
import com.mockgovsim.domain.PollingFirm;
import com.mockgovsim.domain.User;
import com.mockgovsim.controller.PollingController.PollingFirmApplicationRequest;
import com.mockgovsim.domain.Election;
import com.mockgovsim.domain.PollRequest;
import com.mockgovsim.model.polling.PollDTO;
import com.mockgovsim.model.polling.PollResultDTO;
import com.mockgovsim.model.polling.PollingFirmDTO;
import com.mockgovsim.repository.ElectionRepository;
import com.mockgovsim.repository.PollRepository;
import com.mockgovsim.repository.PollingFirmRepository;
import com.mockgovsim.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PollingService {

    private final PollingFirmRepository pollingFirmRepository;
    private final PollRepository pollRepository;
    private final UserRepository userRepository;
    private final ElectionRepository electionRepository;

    @Transactional
    public PollingFirm applyForFirm(PollingFirmApplicationRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found."));

        pollingFirmRepository.findByUserId(owner.getId()).ifPresent(f -> {
            throw new IllegalStateException("User already owns a polling firm.");
        });

        PollingFirm newFirm = new PollingFirm();
        newFirm.setName(request.getName());
        newFirm.setDescription(request.getDescription());
        newFirm.setUserId(owner.getId());
        newFirm.setApproved(false);
        newFirm.setReputationScore(50); 

        return pollingFirmRepository.save(newFirm);
    }

    @Transactional
    public Poll savePoll(PollRequest request) {
        PollingFirm firm = pollingFirmRepository.findById(request.getFirmId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid firm ID."));
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found."));
        if (!firm.getUserId().equals(user.getId())) {
            // Future: check for admin role or other permissions
            throw new IllegalStateException("User not authorized for this firm.");
        }

        Poll poll = new Poll();
        poll.setTitle(request.getTitle());
        poll.setPollster(request.getPollster());
        poll.setElectionType(request.getElectionType());
        poll.setRegion(request.getRegion());
        poll.setStartDate(request.getStartDate());
        poll.setEndDate(request.getEndDate());
        poll.setSampleSize(request.getSampleSize());
        poll.setMarginOfError(request.getMarginOfError());
        poll.setMethodology(request.getMethodology());
        poll.setPublished(request.isPublished());
        poll.setFirm(firm);

        if (request.getElectionId() != null) {
            Election election = electionRepository.findById(request.getElectionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid election ID."));
            poll.setElection(election);
        }
        
        // Save the poll first to generate its ID before associating results
        Poll savedPoll = pollRepository.save(poll);

        List<PollResult> pollResults = new ArrayList<>();
        if (request.getResults() != null) {
            for (PollRequest.PollResultRequest resultRequest : request.getResults()) {
                PollResult pollResult = new PollResult();
                pollResult.setPoll(savedPoll); // Associate with the now-persisted poll
                pollResult.setCandidateName(resultRequest.getCandidateName());
                pollResult.setPercentage(resultRequest.getPercentage());
                pollResults.add(pollResult);
            }
        }
        // The PollResult entities are implicitly saved via the Poll's cascade setting.
        // If not, we would save them explicitly here.
        savedPoll.setResults(pollResults);

        return pollRepository.save(savedPoll);
    }

    @Transactional(readOnly = true)
    public List<PollingFirm> getUnapprovedFirms() {
        return pollingFirmRepository.findAll().stream()
                .filter(firm -> !firm.isApproved())
                .collect(Collectors.toList());
    }

    @Transactional
    public PollingFirm approveFirm(Long firmId) {
        PollingFirm firm = pollingFirmRepository.findById(firmId)
                .orElseThrow(() -> new IllegalArgumentException("Polling firm not found with id: " + firmId));

        firm.setApproved(true);
        return pollingFirmRepository.save(firm);
    }

    @Transactional(readOnly = true)
    public List<Poll> getPollsByElection(Long electionId) {
        return pollRepository.findByElection_Id(electionId);
    }

    @Transactional(readOnly = true)
    public List<Poll> getPollsByFirm(Long firmId) {
        return pollRepository.findByFirm_Id(firmId);
    }

    @Transactional(readOnly = true)
    public Optional<PollingFirm> getMyFirm() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found."));
        return pollingFirmRepository.findByUserId(owner.getId());
    }

    @Transactional(readOnly = true)
    public List<PollingFirmDTO> getAllFirms() {
        return pollingFirmRepository.findAll().stream()
                .map(this::toFirmDTO)
                .collect(Collectors.toList());
    }

    private PollingFirmDTO toFirmDTO(PollingFirm firm) {
        PollingFirmDTO dto = new PollingFirmDTO();
        dto.setId(firm.getId());
        dto.setName(firm.getName());
        dto.setDescription(firm.getDescription());
        dto.setApproved(firm.isApproved());
        dto.setReputationScore(firm.getReputationScore());
        dto.setBiasRating(firm.getBiasRating());
        return dto;
    }

    @Transactional(readOnly = true)
    public Optional<PollingFirmDTO> getFirmById(Long firmId) {
        return pollingFirmRepository.findById(firmId).map(this::toFirmDTO);
    }

    @Transactional
    public PollingFirm updateFirm(Long firmId, PollingFirmApplicationRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found."));

        PollingFirm firm = pollingFirmRepository.findById(firmId)
                .orElseThrow(() -> new IllegalArgumentException("Polling firm not found with id: " + firmId));

        if (!firm.getUserId().equals(user.getId())) {
            // TODO: Add admin override
            throw new IllegalStateException("User is not authorized to update this firm.");
        }

        firm.setName(request.getName());
        firm.setDescription(request.getDescription());

        return pollingFirmRepository.save(firm);
    }
     @Transactional
    public void deleteFirm(Long firmId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found."));

        PollingFirm firm = pollingFirmRepository.findById(firmId)
                .orElseThrow(() -> new IllegalArgumentException("Polling firm not found with id: " + firmId));

        if (!firm.getUserId().equals(user.getId())) {
            // TODO: Add admin override
            throw new IllegalStateException("User is not authorized to delete this firm.");
        }

        pollRepository.deleteAll(pollRepository.findByFirm_Id(firmId));

        pollingFirmRepository.delete(firm);
    }

    @Transactional(readOnly = true)
    public List<PollDTO> getAllPolls() {
        return pollRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private PollDTO toDTO(Poll poll) {
        PollDTO dto = new PollDTO();
        dto.setId(poll.getId());
        dto.setTitle(poll.getTitle());
        dto.setElectionType(poll.getElectionType());
        dto.setRegion(poll.getRegion());
        dto.setSampleSize(poll.getSampleSize());
        dto.setMethodology(poll.getMethodology());
        dto.setStartDate(poll.getStartDate());
        dto.setEndDate(poll.getEndDate());
        dto.setMarginOfError(poll.getMarginOfError());
        dto.setPublished(poll.isPublished());

        if (poll.getFirm() != null) {
            PollingFirmDTO firmDTO = new PollingFirmDTO();
            firmDTO.setId(poll.getFirm().getId());
            firmDTO.setName(poll.getFirm().getName());
            dto.setFirm(firmDTO);
        }

        if (poll.getResults() != null) {
            dto.setResults(poll.getResults().stream().map(result -> {
                PollResultDTO resultDTO = new PollResultDTO();
                resultDTO.setCandidateName(result.getCandidateName());
                resultDTO.setPercentage(result.getPercentage());
                return resultDTO;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public Optional<Poll> getPollById(Long pollId) {
        return pollRepository.findById(pollId);
    }

    @Transactional
    public void deletePoll(Long pollId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found."));

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new IllegalArgumentException("Poll not found with id: " + pollId));
        
        if (!poll.getFirm().getUserId().equals(user.getId())) {
            // TODO: Add admin override
            throw new IllegalStateException("User is not authorized to delete this poll.");
        }
        
        pollRepository.delete(poll);
    }
} 