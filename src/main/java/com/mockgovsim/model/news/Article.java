package com.mockgovsim.model.news;

import com.mockgovsim.domain.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String headline;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    private String tags; // Comma-separated or could be a separate entity

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_agency_id", nullable = false)
    private NewsAgency newsAgency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArticleStatus status;

    private LocalDateTime publishedAt;

    private int likes = 0;
    private int shares = 0;

    // For the impact engine
    private double visibilityLevel = 0.0;
    private double impactModifier = 1.0;

    @OneToOne(mappedBy = "article", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ArticleBias biasScore;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 