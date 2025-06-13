package com.mockgovsim.service;

import com.mockgovsim.domain.Poll;
import com.mockgovsim.domain.PollResult;
import com.mockgovsim.repository.PollRepository;
import com.mockgovsim.repository.PollResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PollAggregationService {

    private final PollRepository pollRepository;
    private final PollResultRepository pollResultRepository;

    // Define the record for a single data point in a trendline
    public record TrendPoint(LocalDate date, Double value) {}

    @Transactional(readOnly = true)
    public Map<String, List<TrendPoint>> getTrendline(String region, String electionType, int daysBack) {
        LocalDate cutoffDate = LocalDate.now().minusDays(daysBack);
        List<Poll> polls = pollRepository.findAllRecent(region, electionType, cutoffDate);

        Map<String, List<TrendPoint>> trendData = new HashMap<>();

        for (Poll poll : polls) {
            for (PollResult result : poll.getResults()) {
                trendData.computeIfAbsent(result.getCandidateName(), k -> new ArrayList<>())
                         .add(new TrendPoint(poll.getEndDate(), result.getPercentage()));
            }
        }
        
        // Sort the points by date for each candidate
        trendData.values().forEach(points -> points.sort((a, b) -> a.date().compareTo(b.date())));

        return trendData;
    }
} 