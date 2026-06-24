package com.courier.app.orders.model;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Wraps a page of {@link OrderResponse} items with pagination metadata.
 * Used by the role-scoped order list endpoints (/staff, /partner, /customer).
 */
public record PagedOrderResponse(
        List<OrderResponse> orders,
        int page,
        int size,
        long totalCount,
        int totalPages
) {
    public static PagedOrderResponse from(Page<OrderResponse> page) {
        return new PagedOrderResponse(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}