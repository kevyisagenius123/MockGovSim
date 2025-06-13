package com.mockgovsim.web.dto.news;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCommentRequest {
    @NotNull
    private Long articleId;
    
    private Long parentCommentId;

    @NotEmpty(message = "Comment content cannot be empty.")
    private String content;
} 