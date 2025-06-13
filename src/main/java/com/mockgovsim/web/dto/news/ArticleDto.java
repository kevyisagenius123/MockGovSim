package com.mockgovsim.web.dto.news;

import com.mockgovsim.model.news.ArticleStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArticleDto {
    private Long id;
    private String headline;
    private String body;
    private String tags;
    private Long newsAgencyId;
    private String newsAgencyName;
    private Long authorId;
    private String authorName;
    private ArticleStatus status;
    private LocalDateTime publishedAt;
    private int likes;
    private int shares;
    private double visibilityLevel;
    private double impactModifier;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 