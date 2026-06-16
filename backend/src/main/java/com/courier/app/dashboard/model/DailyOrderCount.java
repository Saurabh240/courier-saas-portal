package com.courier.app.dashboard.model;

import java.time.LocalDate;

public record DailyOrderCount(LocalDate date, long count) {}
