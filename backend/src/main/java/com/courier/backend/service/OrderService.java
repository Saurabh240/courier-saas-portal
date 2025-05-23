package com.courier.backend.service;

import com.courier.backend.model.Order;
import com.courier.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    public List<Order> getAllOrders() {
        return repo.findAll();
    }

    public Optional<Order> getOrder(Long id) {
        return repo.findById(id);
    }

    public Order saveOrder(Order order) {
        return repo.save(order);
    }

    public void deleteOrder(Long id) {
        repo.deleteById(id);
    }
}
