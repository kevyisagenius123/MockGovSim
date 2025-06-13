package com.mockgovsim.controller;

import com.mockgovsim.model.news.Comment;
import com.mockgovsim.service.news.NewsService;
import com.mockgovsim.web.dto.news.CommentDto;
import com.mockgovsim.web.dto.news.CreateCommentRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private NewsService newsService;

    @PostMapping("/comments")
    public ResponseEntity<CommentDto> createComment(@Valid @RequestBody CreateCommentRequest request) {
        // Placeholder for authenticated user ID
        Long userId = 1L; 
        Comment comment = newsService.createComment(request, userId);
        return ResponseEntity.ok(toDto(comment));
    }

    @GetMapping("/articles/{articleId}/comments")
    public ResponseEntity<List<CommentDto>> getCommentsForArticle(@PathVariable Long articleId) {
        List<Comment> comments = newsService.getCommentsByArticle(articleId);
        List<CommentDto> dtos = comments.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    // --- Helper DTO Converters ---
    private CommentDto toDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setAuthorId(comment.getAuthor().getId());
        dto.setAuthorName(comment.getAuthor().getUsername()); // Assuming User has getUsername()
        dto.setArticleId(comment.getArticle().getId());
        dto.setCreatedAt(comment.getCreatedAt());

        if (comment.getParentComment() != null) {
            dto.setParentCommentId(comment.getParentComment().getId());
        }

        dto.setReplies(comment.getReplies().stream().map(this::toDto).collect(Collectors.toList()));
        return dto;
    }
} 