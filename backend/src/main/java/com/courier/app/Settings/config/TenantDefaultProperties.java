package com.courier.app.Settings.config;

import lombok.*;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "tenant.defaults")
@Data
public class TenantDefaultProperties {
    private String businessHours;
    private String brandName;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String timezone;
}
