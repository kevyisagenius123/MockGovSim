package com.mockgovsim.model.polling;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class PollingFirmApplicationRequest {

    @NotBlank(message = "Firm name is required.")
    @Size(min = 3, max = 100, message = "Firm name must be between 3 and 100 characters.")
    private String name;

    @Size(max = 1000, message = "Description can be up to 1000 characters.")
    private String description;

    private String logoUrl;
} 