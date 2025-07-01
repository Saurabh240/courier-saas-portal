package com.courier.app.orders.service;


import com.courier.app.orders.model.Order;
import com.courier.app.orders.model.OrderRequest;
import com.courier.app.orders.model.OrderResponse;
import com.courier.app.orders.model.OrderStatus;
import com.courier.app.orders.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository repository;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    public OrderResponse createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerEmail(request.customerEmail());
        order.setSenderName(request.senderName());
        order.setReceiverName(request.receiverName());
        order.setPickupAddress(request.pickupAddress());
        order.setDeliveryAddress(request.deliveryAddress());
        order.setPackageType(request.packageType());
        order.setPackageWeightKg(request.packageWeightKg());
        order.setPackageLengthCm(request.packageLengthCm());
        order.setPackageHeightCm(request.packageHeightCm());
        order.setPackageWidthCm(request.packageWidthCm());
        order.setDeliveryPhone(request.deliveryPhone());
        order.setPickupPhone(request.pickupPhone());
        order.setPickupDate(request.pickupDate());
        order.setPickupTimeWindow(request.pickupTimeWindow());
        order.setSpecialInstructions(request.specialInstructions());
        order.setPaymentMode(request.paymentMode());
        order.setDeclaredValue(request.declaredValue());
        order.setIsFragile(request.isFragile());
        order.setDeliveryType(request.deliveryType());

        return toResponse(repository.save(order));
    }

    public List<OrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size); // Spring pages are 0-indexed
        Page<Order> pagedOrders = repository.findAll(pageable);
        return pagedOrders
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }



    public List<OrderResponse> getOrdersForCustomer(String email) {
        return repository.findByCustomerEmail(email).stream().map(this::toResponse).toList();
    }

    public List<OrderResponse> getOrdersForPartner(String email) {
        return repository.findByAssignedPartnerEmail(email).stream().map(this::toResponse).toList();
    }

    public OrderResponse assignPartner(Long orderId, String partnerEmail) {
        Order order = repository.findById(orderId).orElseThrow();
        order.setAssignedPartnerEmail(partnerEmail);
        return toResponse(repository.save(order));
    }

    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        Order order = repository.findById(orderId).orElseThrow();
        order.setStatus(status);
        return toResponse(repository.save(order));
    }

    public OrderResponse uploadProof(Long orderId, MultipartFile file) throws IOException {
        Order order = repository.findById(orderId).orElseThrow();
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        String uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/uploads/").path(fileName).toUriString();
        order.setDeliveryProofPath(uri);
        order.setStatus(OrderStatus.DELIVERED);
        return toResponse(repository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getCustomerEmail(),
                order.getSenderName(),
                order.getReceiverName(),
                order.getPickupAddress(),
                order.getDeliveryAddress(),
                order.getStatus(),
                order.getAssignedPartnerEmail(),
                order.getCreatedAt(),
                order.getPackageType(),
                order.getPackageWeightKg() != null ? order.getPackageWeightKg() : 0.0,
                order.getPackageHeightCm() != null ? order.getPackageHeightCm() : 0.0,
                order.getPackageLengthCm() != null ? order.getPackageLengthCm() : 0.0,
                order.getPackageWidthCm() != null ? order.getPackageWidthCm() : 0.0,
                order.getPickupPhone(),
                order.getDeliveryPhone(),
                order.getDeclaredValue() != null ? Double.parseDouble(String.format("%.1f", order.getDeclaredValue())) : 0.0,
                order.getIsFragile() != null ? order.getIsFragile() : false,
                order.getDeliveryProofPath()

        );
     }


    }
