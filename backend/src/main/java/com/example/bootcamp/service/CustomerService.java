package com.example.bootcamp.service;

import com.example.bootcamp.dto.Request.OrderItemRequest;
import com.example.bootcamp.dto.Request.OrderRequest;
import com.example.bootcamp.dto.Response.ShopFrontResponse;
import com.example.bootcamp.dto.Response.ShopProductResponse;
import com.example.bootcamp.dto.Response.OrderDetailResponse;
import com.example.bootcamp.dto.Response.TrackOrderResponse;
import com.example.bootcamp.entity.*;
import com.example.bootcamp.repository.*;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ShopProductRepository shopProductRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    public ShopFrontResponse getShopFront(String slug, Pageable pageable) {
        Optional<ShopsEntity> shopsEntity = shopRepository.findByShopSlug(slug);

        if (shopsEntity.isEmpty()) {
            return null;
        }

        ShopsEntity currentShop = shopsEntity.get();
        Page<ShopProductsEntity> shopProductsPage = shopProductRepository.findByShopId(currentShop.getId(), pageable);

        List<ShopProductResponse> shopProductResponses = new ArrayList<>();
        for (ShopProductsEntity shopProductsEntity : shopProductsPage.getContent()) {
            ShopProductResponse shopProductResponse = new ShopProductResponse(
                    shopProductsEntity.getProduct().getId(),
                    shopProductsEntity.getProduct().getProductName(),
                    shopProductsEntity.getProduct().getImageUrl(),
                    shopProductsEntity.getSellingPrice(),
                    shopProductsEntity.getProduct().getStock(),
                    shopProductsEntity.getProduct().getDescription());
            shopProductResponses.add(shopProductResponse);
        }
        return new ShopFrontResponse(
                currentShop.getShopName(),
                shopProductResponses,
                shopProductsPage.getTotalPages(),
                shopProductsPage.getTotalElements(),
                shopProductsPage.getNumber());
    }

    @Transactional
    public OrdersEntity createOrder(String slug, OrderRequest orderRequest) {
        ShopsEntity shopsEntity = shopRepository.findByShopSlug(slug)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้านี้"));

        OrdersEntity ordersEntity = new OrdersEntity();
        ordersEntity.setOrderNumber("ORD-" + System.currentTimeMillis());
        ordersEntity.setShop(shopsEntity);
        ordersEntity.setCustomerName(orderRequest.getCustomerName());
        ordersEntity.setCustomerPhone(orderRequest.getCustomerPhone());
        ordersEntity.setShippingAddress(orderRequest.getCustomerAddress());
        ordersEntity.setStatus(OrdersEntity.Status.pending);

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;
        List<OrderItemsEntity> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : orderRequest.getItems()) {
            ShopProductsEntity shopProduct = shopProductRepository
                    .findByShopIdAndProductId(shopsEntity.getId(), itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("ไม่มีสินค้า ID " + itemReq.getProductId() + " ในร้าน"));

            ProductsEntity product = shopProduct.getProduct();
            if (product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("สินค้า " + product.getProductName() + " มีไม่เพียงพอ");
            }

            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal quantityBD = new BigDecimal(itemReq.getQuantity());
            BigDecimal itemTotal = shopProduct.getSellingPrice().multiply(quantityBD);
            BigDecimal itemProfit = (shopProduct.getSellingPrice().subtract(product.getCostPrice()))
                    .multiply(quantityBD);

            totalAmount = totalAmount.add(itemTotal);
            totalProfit = totalProfit.add(itemProfit);

            OrderItemsEntity orderItem = new OrderItemsEntity();
            orderItem.setOrder(ordersEntity);
            orderItem.setProduct(product);
            orderItem.setProductName(product.getProductName());
            orderItem.setCostPrice(product.getCostPrice());
            orderItem.setSellingPrice(shopProduct.getSellingPrice());
            orderItem.setQuantity(itemReq.getQuantity());
            orderItems.add(orderItem);
        }

        if (orderRequest.getTotalAmount() != null) {
            ordersEntity.setTotalAmount(orderRequest.getTotalAmount());
        } else {
            ordersEntity.setTotalAmount(totalAmount);
        }

        ordersEntity.setResellerProfit(totalProfit);
        ordersEntity.setOrderItems(orderItems);

        OrdersEntity savedOrder = orderRepository.save(ordersEntity);
        orderItemRepository.saveAll(orderItems);

        // --- ส่ง Email แจ้งเตือนไปยังตัวแทนจำหน่าย ---
        try {
            String resellerEmail = shopsEntity.getUser().getEmail();
            emailService.sendNewOrderNotification(
                    resellerEmail,
                    savedOrder.getOrderNumber(),
                    savedOrder.getCustomerName(),
                    savedOrder.getTotalAmount(),
                    shopsEntity.getUser().getUrlPath()
            );
        } catch (Exception e) {
            System.err.println("⚠️ Email notification failed, but order was created: " + e.getMessage());
        }

        return savedOrder;
    }

    @Transactional
    public String simulatePayment(String slug, Integer orderId) {
        OrdersEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("ไม่พบออเดอร์นี้"));

        if (!order.getShop().getShopSlug().equals(slug)) {
            throw new RuntimeException("ออเดอร์นี้ไม่ได้อยู่ในร้านค้านี้");
        }

        if (order.getStatus() == OrdersEntity.Status.completed) {
            throw new RuntimeException("ออเดอร์นี้ชำระเงินแล้วหรือถูกยกเลิก");
        }

        order.setStatus(OrdersEntity.Status.pending);
        orderRepository.save(order);

        return "ขำระเงินจำลองสำเร็จ สถานะออเดอร์เปลี่ยนเป็น รอดำเนินการ";
    }

    @Transactional
    public TrackOrderResponse trackOrder(String orderNumber) {
        System.out.println("🔍 Backend: Tracking order: " + orderNumber);
        OrdersEntity order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("ไม่พบออเดอร์นี้"));

        List<TrackOrderResponse.TrackOrderItemResponse> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItemsEntity item : order.getOrderItems()) {
                items.add(new TrackOrderResponse.TrackOrderItemResponse(
                        item.getProductName(),
                        item.getQuantity(),
                        item.getSellingPrice()));
            }
        }

        return new TrackOrderResponse(
                order.getOrderNumber(),
                order.getStatus().toString(),
                items,
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getShippingAddress(),
                order.getTotalAmount(),
                order.getCreatedAt());
    }

    @Transactional
    public OrderDetailResponse getOrderDetails(Integer orderId) {
        OrdersEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("ไม่พบออเดอร์นี้"));

        List<String> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItemsEntity item : order.getOrderItems()) {
                items.add(item.getProductName() + " (x" + item.getQuantity() + ")");
            }
        }

        return new OrderDetailResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getShop().getShopName(),
                order.getCustomerName(),
                items,
                order.getTotalAmount(),
                order.getStatus().toString(),
                order.getCreatedAt());
    }

    public Page<ProductsEntity> getAllCatalog(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public List<java.util.Map<String, Object>> getAllShops() {
        List<ShopsEntity> shops = shopRepository.findAll();
        List<java.util.Map<String, Object>> result = new ArrayList<>();
        for (ShopsEntity shop : shops) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", shop.getId());
            map.put("shopName", shop.getShopName());
            map.put("shopSlug", shop.getShopSlug());
            // Add more info if needed, like logo or product count
            result.add(map);
        }
        return result;
    }
}
