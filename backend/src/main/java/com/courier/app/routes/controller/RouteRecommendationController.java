package com.courier.app.routes.controller;

import com.courier.app.routes.model.DeliveryOrder;
import com.courier.app.routes.repository.DeliveryOrderRepository;
import com.courier.app.routes.service.RouteRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
public class RouteRecommendationController {

    @Autowired
    private DeliveryOrderRepository orderRepo;

    @Autowired
    private RouteRecommendationService routeService;

    @GetMapping("/recommend")
    public ResponseEntity<Map<Integer, List<DeliveryOrder>>> recommendRoutes(@RequestParam(defaultValue = "3") int k) {
        List<DeliveryOrder> pendingOrders = orderRepo.findByStatus("PENDING");
        Map<Integer, List<DeliveryOrder>> clusters = routeService.groupDeliveries(pendingOrders, k);
        return ResponseEntity.ok(clusters);
    }
}