package com.mockgovsim.repository.news;

import com.mockgovsim.model.news.Article;
import com.mockgovsim.model.news.ArticleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    // Find articles by status
    Page<Article> findByStatus(ArticleStatus status, Pageable pageable);
    
    List<Article> findByStatus(ArticleStatus status);

    // Find articles by agency
    Page<Article> findByNewsAgencyId(Long newsAgencyId, Pageable pageable);

    // Find articles by author
    Page<Article> findByAuthorId(Long authorId, Pageable pageable);
    
    // For searching articles
    Page<Article> findByHeadlineContainingIgnoreCaseAndStatus(String headline, ArticleStatus status, Pageable pageable);
} 