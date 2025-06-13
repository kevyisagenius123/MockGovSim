package com.mockgovsim.controller;

import com.mockgovsim.model.news.Article;
import com.mockgovsim.model.news.NewsAgency;
import com.mockgovsim.service.news.NewsService;
import com.mockgovsim.web.dto.news.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    // --- Agencies ---

    @PostMapping("/agencies")
    public ResponseEntity<NewsAgencyDto> createNewsAgency(@Valid @RequestBody CreateNewsAgencyRequest request) {
        Long founderId = 1L; // Placeholder for authenticated user
        NewsAgency agency = newsService.createNewsAgency(request, founderId);
        return ResponseEntity.ok(toDto(agency));
    }

    @GetMapping("/agencies")
    public ResponseEntity<List<NewsAgencyDto>> getNewsAgencies() {
        List<NewsAgency> agencies = newsService.getNewsAgencies();
        return ResponseEntity.ok(agencies.stream().map(this::toDto).collect(Collectors.toList()));
    }

    // --- Articles ---

    @PostMapping("/articles")
    public ResponseEntity<ArticleDto> createArticle(@Valid @RequestBody CreateArticleRequest request) {
        Long authorId = 1L; // Placeholder for authenticated user
        Article article = newsService.createArticle(request, authorId);
        return ResponseEntity.ok(toDto(article));
    }

    @GetMapping("/articles")
    public ResponseEntity<List<ArticleDto>> getArticles() {
        List<Article> articles = newsService.getArticles();
        return ResponseEntity.ok(articles.stream().map(this::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<ArticleDto> getArticleById(@PathVariable Long id) {
        Article article = newsService.getArticleById(id);
        return ResponseEntity.ok(toDto(article));
    }

    // --- DTO Converters ---

    private NewsAgencyDto toDto(NewsAgency agency) {
        NewsAgencyDto dto = new NewsAgencyDto();
        dto.setId(agency.getId());
        dto.setName(agency.getName());
        dto.setSlogan(agency.getSlogan());
        dto.setLogoUrl(agency.getLogoUrl());
        dto.setEditorialStance(agency.getEditorialStance());
        dto.setFounderId(agency.getFounder().getId());
        dto.setCreatedAt(agency.getCreatedAt());
        return dto;
    }

    private ArticleDto toDto(Article article) {
        ArticleDto dto = new ArticleDto();
        dto.setId(article.getId());
        dto.setHeadline(article.getHeadline());
        dto.setBody(article.getBody());
        dto.setTags(article.getTags());
        dto.setNewsAgencyId(article.getNewsAgency().getId());
        dto.setNewsAgencyName(article.getNewsAgency().getName());
        dto.setAuthorId(article.getAuthor().getId());
        dto.setAuthorName(article.getAuthor().getUsername());
        dto.setStatus(article.getStatus());
        dto.setPublishedAt(article.getPublishedAt());
        dto.setCreatedAt(article.getCreatedAt());
        return dto;
    }
} 