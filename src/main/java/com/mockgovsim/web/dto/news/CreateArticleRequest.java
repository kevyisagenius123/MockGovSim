package com.mockgovsim.web.dto.news;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateArticleRequest {
    @NotEmpty(message = "Headline cannot be empty.")
    private String headline;

    @NotEmpty(message = "Article body cannot be empty.")
    private String body;

    private String tags;

    @NotNull(message = "News agency ID cannot be null.")
    private Long newsAgencyId;
} 