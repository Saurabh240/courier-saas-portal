package com.courier.app.orders.service;
import com.courier.app.orders.events.OrderCreatedEvent;
import com.courier.app.orders.events.OrderStatusUpdatedEvent;
import com.courier.app.orders.model.*;
import com.courier.app.orders.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import java.util.Optional;
import java.util.stream.Collectors;
import com.courier.app.orders.model.OrderRequest;

@Service
public class OrderService {
    @Autowired
    private OrderRepository repository;
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    public OrderDetailsResponse createOrder(OrderRequest request) {
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
        order.setFragile(request.isFragile());
        order.setDeliveryType(request.deliveryType());
        Order savedOrder = repository.save(order);
        eventPublisher.publishEvent(new OrderCreatedEvent(savedOrder));

        return toDetailsResponse(savedOrder);
    }

    public OrderDetailsResponse updateOrder(Long id, OrderUpdateRequest request) {
        return repository.findById(id)
                .map(order -> {
                    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

                    boolean isCustomer = auth.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"));

                    if (isCustomer) {
                        // If not PENDING, deny access
                        if (order.getStatus() != OrderStatus.PENDING) {
                            throw new AccessDeniedException("Customers can only update orders in PENDING status.");
                        }
                    }

                    Optional.ofNullable(request.senderName()).ifPresent(order::setSenderName);
                    Optional.ofNullable(request.receiverName()).ifPresent(order::setReceiverName);
                    Optional.ofNullable(request.pickupAddress()).ifPresent(order::setPickupAddress);
                    Optional.ofNullable(request.deliveryAddress()).ifPresent(order::setDeliveryAddress);
                    Optional.ofNullable(request.packageWeightKg()).ifPresent(order::setPackageWeightKg);
                    Optional.ofNullable(request.packageLengthCm()).ifPresent(order::setPackageLengthCm);
                    Optional.ofNullable(request.packageWidthCm()).ifPresent(order::setPackageWidthCm);
                    Optional.ofNullable(request.packageHeightCm()).ifPresent(order::setPackageHeightCm);
                    Optional.ofNullable(request.pickupPhone()).ifPresent(order::setPickupPhone);
                    Optional.ofNullable(request.deliveryPhone()).ifPresent(order::setDeliveryPhone);
                    Optional.ofNullable(request.pickupTimeWindow()).ifPresent(order::setPickupTimeWindow);
                    Optional.ofNullable(request.specialInstructions()).ifPresent(order::setSpecialInstructions);
                    Optional.ofNullable(request.isFragile()).ifPresent(order::setFragile);
                    Optional.ofNullable(request.deliveryType()).ifPresent(order::setDeliveryType);

                    return repository.save(order);
                })
                .map(this::toDetailsResponse)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<OrderResponse> getAllOrders(int page, int size, OrderStatus status) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Order> pagedOrders;
        if (status != null) {
            pagedOrders = repository.findByStatus(status, pageable);
        } else {
            pagedOrders = repository.findAll(pageable);
        }
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

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(status);
        eventPublisher.publishEvent(new OrderStatusUpdatedEvent(order, oldStatus));
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
  
    private double roundTo(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
  
    private OrderDetailsResponse toDetailsResponse(Order order) {
        return new OrderDetailsResponse(
                order.getId(),
                order.getCustomerEmail(),
                order.getSenderName(),
                order.getReceiverName(),
                order.getPickupAddress(),
                order.getDeliveryAddress(),
                order.getPackageType(),
                roundTo(order.getPackageWeightKg()),
                roundTo(order.getPackageLengthCm()),
                roundTo(order.getPackageWidthCm()),
                roundTo(order.getPackageHeightCm()),
                order.getPickupPhone(),
                order.getDeliveryPhone(),
                order.getPickupDate(),
                order.getPickupTimeWindow(),
                order.getSpecialInstructions(),
                order.getPaymentMode(),
                roundTo(order.getDeclaredValue()),
                order.isFragile(),
                order.getStatus(),
                order.getDeliveryType(),
                order.getInvoiceStatus(),
                order.getAssignedPartnerEmail(),
                order.getCreatedAt(),
                order.getDeliveryProofPath()
        );
    }


    private OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getSenderName(),
                order.getReceiverName(),
                order.getPickupAddress(),
                order.getDeliveryAddress(),
                order.getPaymentMode(),
                order.getDeclaredValue(),
                order.getDeliveryType(),
                order.getStatus(),
                order.getInvoiceStatus()
        );
    }

    public OrderDetailsResponse getOrderById(Long id) {
        Order order = repository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return new OrderDetailsResponse(
                order.getId(),
                order.getCustomerEmail(),
                order.getSenderName(),
                order.getReceiverName(),
                order.getPickupAddress(),
                order.getDeliveryAddress(),
                order.getPackageType(),
                order.getPackageWeightKg(),
                order.getPackageLengthCm(),
                order.getPackageHeightCm(),
                order.getPackageWidthCm(),
                order.getDeliveryPhone(),
                order.getPickupPhone(),
                order.getPickupDate(),
                order.getPickupTimeWindow(),
                order.getSpecialInstructions(),
                order.getPaymentMode(),
                order.getDeclaredValue(),
                order.isFragile(),
                order.getStatus(),
                order.getDeliveryType(),
                order.getInvoiceStatus(),
                order.getAssignedPartnerEmail(),
                order.getCreatedAt(),
                order.getDeliveryProofPath()
        );
    }
}
