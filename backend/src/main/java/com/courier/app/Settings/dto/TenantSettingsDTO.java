package com.courier.app.Settings.dto;

import lombok.Data;

import java.util.Map;

@Data
public class TenantSettingsDTO {
    private Map<String, String> businessHours;
    private String brandName;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String timezone;
}
