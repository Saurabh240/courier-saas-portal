package com.courier.app.settings.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.util.Map;

@Data
public class TenantSettingsDTO {

    @NotBlank(message = "brandName is required")
    private String brandName;

    @URL(message = "logoUrl must be a valid URL")
    private String logoUrl;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "primaryColor must be a hex value like #RRGGBB")
    private String primaryColor;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "secondaryColor must be a hex value like #RRGGBB")
    private String secondaryColor;

    @NotBlank(message = "timezone is required")
    private String timezone;

    @Valid
    private Map<String, BusinessHoursDTO> businessHours;
}