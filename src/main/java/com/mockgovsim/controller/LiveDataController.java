package com.mockgovsim.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5175"})
public class LiveDataController {

    // Live statistics endpoint
    @GetMapping("/elections/live-stats")
    public ResponseEntity<Map<String, Object>> getLiveStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // These would typically come from database queries or external APIs
        stats.put("voterTurnout", 67.8 + (Math.random() * 2 - 1)); // Simulated variance
        stats.put("totalPolls", 1247 + (int)(Math.random() * 20 - 10));
        stats.put("activeRaces", 435);
        stats.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ofPattern("h:mm a")));
        stats.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(stats);
    }

    // Live polling aggregates
    @GetMapping("/polling/live-aggregates")
    public ResponseEntity<Map<String, Object>> getLivePollingData() {
        Map<String, Object> data = new HashMap<>();
        
        // National polling averages, formatted as an array of objects
        List<Map<String, Object>> national = new ArrayList<>();

        // Candidate 1: Biden
        Map<String, Object> bidenData = new HashMap<>();
        bidenData.put("name", "Biden");
        bidenData.put("percentage", 47.2 + (Math.random() * 2 - 1));
        bidenData.put("trend", Math.random() - 0.2); // Simulate trend
        bidenData.put("party", "left");
        national.add(bidenData);

        // Candidate 2: Trump
        Map<String, Object> trumpData = new HashMap<>();
        trumpData.put("name", "Trump");
        trumpData.put("percentage", 44.8 + (Math.random() * 2 - 1));
        trumpData.put("trend", Math.random() - 0.8); // Simulate trend
        trumpData.put("party", "right");
        national.add(trumpData);

        // Candidate 3: Other
        Map<String, Object> otherData = new HashMap<>();
        otherData.put("name", "Other");
        otherData.put("percentage", 8.0 + (Math.random() * 1 - 0.5));
        otherData.put("trend", Math.random() - 0.5);
        otherData.put("party", "independent");
        national.add(otherData);

        data.put("national", national);
        
        // Trend data for charts
        List<Map<String, Object>> trendData = new ArrayList<>();
        String[] dates = {"10-01", "10-08", "10-15", "10-22", "10-29", "11-05"};
        for (String date : dates) {
            Map<String, Object> trend = new HashMap<>();
            trend.put("date", date);
            trend.put("approval", 42 + (int)(Math.random() * 8));
            trend.put("disapproval", 51 - (int)(Math.random() * 8));
            trendData.add(trend);
        }
        data.put("trendData", trendData);
        data.put("lastUpdated", LocalDateTime.now().toString());
        
        return ResponseEntity.ok(data);
    }

    // Competitive races with live updates
    @GetMapping("/elections/competitive-races")
    public ResponseEntity<List<Map<String, Object>>> getCompetitiveRaces() {
        List<Map<String, Object>> races = new ArrayList<>();
        
        // Pennsylvania Senate
        Map<String, Object> paSenate = new HashMap<>();
        paSenate.put("state", "Pennsylvania");
        paSenate.put("type", "Senate");
        paSenate.put("margin", String.format("+%.1f", 0.8 + (Math.random() * 0.4 - 0.2)));
        paSenate.put("leader", "Fetterman (D)");
        paSenate.put("trending", Math.random() > 0.5 ? "up" : "stable");
        races.add(paSenate);
        
        // Arizona Governor
        Map<String, Object> azGov = new HashMap<>();
        azGov.put("state", "Arizona");
        azGov.put("type", "Governor");
        azGov.put("margin", String.format("+%.1f", 1.2 + (Math.random() * 0.6 - 0.3)));
        azGov.put("leader", "Lake (R)");
        azGov.put("trending", Math.random() > 0.6 ? "down" : "stable");
        races.add(azGov);
        
        // Georgia Senate
        Map<String, Object> gaSenate = new HashMap<>();
        gaSenate.put("state", "Georgia");
        gaSenate.put("type", "Senate");
        gaSenate.put("margin", String.format("+%.1f", 0.5 + (Math.random() * 0.3 - 0.15)));
        gaSenate.put("leader", "Warnock (D)");
        gaSenate.put("trending", "up");
        races.add(gaSenate);
        
        // Nevada Senate
        Map<String, Object> nvSenate = new HashMap<>();
        nvSenate.put("state", "Nevada");
        nvSenate.put("type", "Senate");
        nvSenate.put("margin", String.format("+%.1f", 2.1 + (Math.random() * 0.8 - 0.4)));
        nvSenate.put("leader", "Cortez Masto (D)");
        nvSenate.put("trending", "stable");
        races.add(nvSenate);
        
        return ResponseEntity.ok(races);
    }

    // Live news feed
    @GetMapping("/news/election-feed")
    public ResponseEntity<List<Map<String, Object>>> getLiveNews() {
        List<Map<String, Object>> news = new ArrayList<>();
        
        Map<String, Object> news1 = new HashMap<>();
        news1.put("id", 1);
        news1.put("title", "Latest Poll Shows Tight Presidential Race");
        news1.put("time", getRandomRecentTime());
        news1.put("source", "AP News");
        news1.put("url", "#");
        news.add(news1);
        
        Map<String, Object> news2 = new HashMap<>();
        news2.put("id", 2);
        news2.put("title", "Early Voting Numbers Exceed 2020 Levels");
        news2.put("time", getRandomRecentTime());
        news2.put("source", "Reuters");
        news2.put("url", "#");
        news.add(news2);
        
        Map<String, Object> news3 = new HashMap<>();
        news3.put("id", 3);
        news3.put("title", "Supreme Court Ruling on Election Laws");
        news3.put("time", getRandomRecentTime());
        news3.put("source", "CNN");
        news3.put("url", "#");
        news.add(news3);
        
        Map<String, Object> news4 = new HashMap<>();
        news4.put("id", 4);
        news4.put("title", "Candidate Debate Schedule Released");
        news4.put("time", getRandomRecentTime());
        news4.put("source", "NPR");
        news4.put("url", "#");
        news.add(news4);
        
        return ResponseEntity.ok(news);
    }

    // Electoral predictions endpoint
    @GetMapping("/elections/electoral-predictions")
    public ResponseEntity<Map<String, Object>> getElectoralPredictions() {
        Map<String, Object> predictions = new HashMap<>();
        
        int democratBase = 226;
        int republicanBase = 219;
        int tossupBase = 93;
        
        // Add some variance to simulate live updates
        int variance = (int)(Math.random() * 10 - 5);
        
        predictions.put("democrat", democratBase + variance);
        predictions.put("republican", republicanBase - variance);
        predictions.put("tossup", tossupBase);
        predictions.put("total", 538);
        predictions.put("lastUpdated", LocalDateTime.now().toString());
        
        return ResponseEntity.ok(predictions);
    }

    // Social media sentiment endpoint
    @GetMapping("/social/sentiment-analysis")
    public ResponseEntity<Map<String, Object>> getSocialSentiment() {
        Map<String, Object> sentiment = new HashMap<>();
        
        sentiment.put("positive", 45 + (int)(Math.random() * 10 - 5));
        sentiment.put("negative", 35 + (int)(Math.random() * 10 - 5));
        sentiment.put("neutral", 20 + (int)(Math.random() * 6 - 3));
        sentiment.put("volume", 125000 + (int)(Math.random() * 25000 - 12500));
        sentiment.put("lastUpdated", LocalDateTime.now().toString());
        
        return ResponseEntity.ok(sentiment);
    }

    // Prediction markets data
    @GetMapping("/markets/election-odds")
    public ResponseEntity<Map<String, Object>> getPredictionMarkets() {
        Map<String, Object> markets = new HashMap<>();
        
        double bidenOdds = 52.3 + (Math.random() * 4 - 2);
        double trumpOdds = 100 - bidenOdds;
        
        markets.put("biden", Math.round(bidenOdds * 10.0) / 10.0);
        markets.put("trump", Math.round(trumpOdds * 10.0) / 10.0);
        markets.put("lastUpdated", System.currentTimeMillis());
        
        return ResponseEntity.ok(markets);
    }

    private String getRandomRecentTime() {
        int randomMinutes = (int)(Math.random() * 300) + 1; // 1-300 minutes ago
        
        if (randomMinutes < 60) {
            return randomMinutes + " min ago";
        } else {
            int hours = randomMinutes / 60;
            return hours + " hour" + (hours == 1 ? "" : "s") + " ago";
        }
    }
} 