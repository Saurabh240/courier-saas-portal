package com.courier.app.settings.service.impl;

import com.courier.app.settings.dto.NotificationSettingsDTO;

public interface NotificationSettingsService {
    NotificationSettingsDTO getNotificationSettings();
    NotificationSettingsDTO saveNotificationSettings(NotificationSettingsDTO dto);
    void sendTestEmail(String toEmail);
    void sendTestSms(String toPhone);
}