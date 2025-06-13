package com.mockgovsim.service.news;

import com.mockgovsim.model.news.Article;
import com.mockgovsim.model.news.ArticleStatus;
import com.mockgovsim.model.news.Comment;
import com.mockgovsim.model.news.NewsAgency;
import com.mockgovsim.repository.UserRepository;
import com.mockgovsim.repository.news.ArticleRepository;
import com.mockgovsim.repository.news.CommentRepository;
import com.mockgovsim.repository.news.NewsAgencyRepository;
import com.mockgovsim.web.dto.news.CreateArticleRequest;
import com.mockgovsim.web.dto.news.CreateCommentRequest;
import com.mockgovsim.web.dto.news.CreateNewsAgencyRequest;
import com.mockgovsim.web.dto.news.NewsAgencyDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NewsService {

    @Autowired
    private NewsAgencyRepository newsAgencyRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository; // Assuming this exists

    public NewsAgency createNewsAgency(CreateNewsAgencyRequest request, Long founderId) {
        // In a real app, you'd get the current user from security context
        var founder = userRepository.findById(founderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NewsAgency agency = new NewsAgency();
        agency.setName(request.getName());
        agency.setSlogan(request.getSlogan());
        agency.setLogoUrl(request.getLogoUrl());
        agency.setEditorialStance(request.getEditorialStance());
        agency.setFounder(founder);

        return newsAgencyRepository.save(agency);
    }

    public Article createArticle(CreateArticleRequest request, Long authorId) {
        var author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var agency = newsAgencyRepository.findById(request.getNewsAgencyId())
                .orElseThrow(() -> new RuntimeException("News agency not found"));

        // TODO: Check if author is part of the agency staff

        Article article = new Article();
        article.setHeadline(request.getHeadline());
        article.setBody(request.getBody());
        article.setTags(request.getTags());
        article.setNewsAgency(agency);
        article.setAuthor(author);
        article.setStatus(ArticleStatus.DRAFT); // Default to DRAFT

        return articleRepository.save(article);
    }

    public Comment createComment(CreateCommentRequest request, Long authorId) {
        var author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var article = articleRepository.findById(request.getArticleId())
                .orElseThrow(() -> new RuntimeException("Article not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setAuthor(author);
        comment.setArticle(article);

        if (request.getParentCommentId() != null) {
            var parentComment = commentRepository.findById(request.getParentCommentId())
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parentComment);
        }

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByArticle(Long articleId) {
        return commentRepository.findByArticleIdAndParentCommentIsNull(articleId);
    }

    public List<NewsAgency> getNewsAgencies() {
        return newsAgencyRepository.findAll();
    }

    public List<Article> getArticles() {
        // Later, this should be paginated and filtered
        return articleRepository.findByStatus(ArticleStatus.PUBLISHED);
    }

    public Article getArticleById(Long articleId) {
        return articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));
    }

    // We will add methods here
} 