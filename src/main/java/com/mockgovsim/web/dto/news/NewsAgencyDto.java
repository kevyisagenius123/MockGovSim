package com.mockgovsim.web.dto.news;

import com.mockgovsim.model.news.EditorialStance;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class NewsAgencyDto {
    private Long id;
    private String name;
    private String logoUrl;
    private String slogan;
    private EditorialStance editorialStance;
    private Long founderId;
    private Set<Long> staffIds;
    private LocalDateTime createdAt;
} 