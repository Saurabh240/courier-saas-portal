package com.courier.app.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class BusinessHoursDTO {

    @NotBlank(message = "open time is required")
    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "open must be in HH:mm format")
    private String open;

    @NotBlank(message = "close time is required")
    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "close must be in HH:mm format")
    private String close;
}