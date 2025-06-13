package com.mockgovsim.web.dto.news;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentDto {
    private Long id;
    private String content;
    private Long authorId;
    private String authorName;
    private Long articleId;
    private Long parentCommentId;
    private LocalDateTime createdAt;
    private List<CommentDto> replies;
} 