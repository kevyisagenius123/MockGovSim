package com.mockgovsim.web.dto.news;

import com.mockgovsim.model.news.EditorialStance;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class CreateNewsAgencyRequest {
    @NotEmpty(message = "Agency name cannot be empty.")
    private String name;
    private String slogan;
    private String logoUrl;
    private EditorialStance editorialStance;
} 