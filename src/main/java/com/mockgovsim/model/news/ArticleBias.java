package com.mockgovsim.model.news;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ArticleBias {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private Article article;

    private String biasClassification; // e.g., Left, Center, Right

    private double emotionalChargeScore; // 0.0 to 1.0

    private double misleadingLanguageScore; // 0.0 to 1.0

    @Column(columnDefinition = "TEXT")
    private String suggestedTags; // Comma-separated

    @Column(columnDefinition = "TEXT")
    private String analysisNotes; // For verbose output from the AI

    private LocalDateTime analysisTimestamp;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        analysisTimestamp = LocalDateTime.now();
    }
} 