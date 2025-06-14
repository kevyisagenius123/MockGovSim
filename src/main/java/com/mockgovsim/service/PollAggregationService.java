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
        try {
            LocalDate cutoffDate = LocalDate.now().minusDays(daysBack);
            List<Poll> polls = pollRepository.findAllRecent(region, electionType, cutoffDate);

            Map<String, List<TrendPoint>> trendData = new HashMap<>();

            for (Poll poll : polls) {
                if (poll.getResults() != null) {
                    for (PollResult result : poll.getResults()) {
                        if (result.getCandidateName() != null && result.getPercentage() != null) {
                            trendData.computeIfAbsent(result.getCandidateName(), k -> new ArrayList<>())
                                     .add(new TrendPoint(poll.getEndDate(), result.getPercentage()));
                        }
                    }
                }
            }
            
            // Sort the points by date for each candidate
            trendData.values().forEach(points -> points.sort((a, b) -> a.date().compareTo(b.date())));

            // If no real data found, return mock data for demonstration
            if (trendData.isEmpty()) {
                return generateMockTrendData(daysBack);
            }

            return trendData;
        } catch (Exception e) {
            // Log the error and return mock data as fallback
            System.err.println("Error fetching trend data: " + e.getMessage());
            return generateMockTrendData(daysBack);
        }
    }

    private Map<String, List<TrendPoint>> generateMockTrendData(int daysBack) {
        Map<String, List<TrendPoint>> mockData = new HashMap<>();
        LocalDate startDate = LocalDate.now().minusDays(daysBack);
        
        // Generate mock data for demonstration candidates
        String[] candidates = {"John Doe", "Jane Smith", "Alex Ray"};
        double[] baseValues = {48.5, 45.2, 6.3};
        
        for (int i = 0; i < candidates.length; i++) {
            List<TrendPoint> points = new ArrayList<>();
            double currentValue = baseValues[i];
            
            for (int day = 0; day <= daysBack; day += 7) { // Weekly data points
                LocalDate date = startDate.plusDays(day);
                // Add some random variation
                double variation = (Math.random() - 0.5) * 4; // ±2% variation
                currentValue = Math.max(0, Math.min(100, currentValue + variation));
                points.add(new TrendPoint(date, currentValue));
            }
            
            mockData.put(candidates[i], points);
        }
        
        return mockData;
    }
} 