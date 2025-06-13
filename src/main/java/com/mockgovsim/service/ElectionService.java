package com.mockgovsim.service;

import com.mockgovsim.domain.Election;
import com.mockgovsim.domain.ElectionStatus;
import com.mockgovsim.dto.ElectionDto;
import com.mockgovsim.repository.ElectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;

    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    public Election createElection(ElectionDto electionDto) {
        Election election = new Election();
        mapDtoToEntity(electionDto, election);
        return electionRepository.save(election);
    }

    public Election updateElection(Long id, ElectionDto electionDto) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found with id: " + id));
        mapDtoToEntity(electionDto, election);
        return electionRepository.save(election);
    }

    private void mapDtoToEntity(ElectionDto dto, Election entity) {
        entity.setName(dto.getName());
        entity.setCountry(dto.getCountry());
        entity.setRegion(dto.getRegion());
        entity.setOffice(dto.getOffice());
        entity.setElectionType(dto.getElectionType());
        entity.setVotingSystem(dto.getVotingSystem());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setStatus(dto.getStatus());
    }
} 