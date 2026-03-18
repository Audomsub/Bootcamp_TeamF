package com.example.bootcamp.service;

import com.example.bootcamp.dto.Request.OrderRequest;
import com.example.bootcamp.dto.Response.ShopFrontResponse;
import com.example.bootcamp.dto.Response.ShopProductResponse;

import com.example.bootcamp.dto.Response.TrackOrderResponse;
import com.example.bootcamp.entity.*;
import com.example.bootcamp.repository.*;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
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

    public ShopFrontResponse getShopFront(String slug) {
        Optional<ShopsEntity> shopsEntity = shopRepository.findByShopSlug(slug);

        if (shopsEntity.isEmpty()) {
            return null;
        }

        ShopsEntity currentShop = shopsEntity.get();

        List<ShopProductsEntity> shopProductsEntities = shopProductRepository.findByShopId(currentShop.getId());

        List<ShopProductResponse> shopProductResponses = new ArrayList<>();
        for (ShopProductsEntity shopProductsEntity : shopProductsEntities) {
            ShopProductResponse shopProductResponse = new ShopProductResponse(
                    shopProductsEntity.getProduct().getId(),
                    shopProductsEntity.getProduct().getProductName(),
                    shopProductsEntity.getProduct().getImageUrl(),
                    shopProductsEntity.getSellingPrice(),
                    shopProductsEntity.getProduct().getStock());
            shopProductResponses.add(shopProductResponse);
        }
        return new ShopFrontResponse(currentShop.getShopName() , shopProductResponses);
    }

    @Transactional
    public String createOrder(String slug, OrderRequest orderRequest) {

        ShopsEntity shopsEntity = shopRepository.findByShopSlug(slug)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้านี้"));
        ShopProductsEntity shopProductsEntity = shopProductRepository
                .findByShopIdAndProductId(shopsEntity.getId(), orderRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("ไม่มีสินค้าชิ้นนี้ในร้าน"));
        ProductsEntity productsEntity = shopProductsEntity.getProduct();
        if (productsEntity.getStock() < orderRequest.getAmountProduct()) {
            return "สินค้าไม่พอ";
        }

        OrdersEntity ordersEntity = new OrdersEntity();
        ordersEntity.setOrderNumber("ORD-" + System.currentTimeMillis());
        ordersEntity.setShop(shopsEntity);
        ordersEntity.setCustomerName(orderRequest.getCustomerName());
        ordersEntity.setCustomerPhone(orderRequest.getCustomerPhone());
        ordersEntity.setShippingAddress(orderRequest.getCustomerAddress());
        ordersEntity.setStatus(OrdersEntity.Status.pending);

        BigDecimal quantityBD = new BigDecimal(orderRequest.getAmountProduct());
        BigDecimal totalAmount = shopProductsEntity.getSellingPrice().multiply(quantityBD);
        BigDecimal profit = (shopProductsEntity.getSellingPrice().subtract(productsEntity.getCostPrice()))
                .multiply(quantityBD);

        ordersEntity.setTotalAmount(totalAmount);
        ordersEntity.setResellerProfit(profit);
        OrdersEntity saveOrder = orderRepository.save(ordersEntity);

        OrderItemsEntity orderItemsEntity = new OrderItemsEntity();
        orderItemsEntity.setOrder(saveOrder);
        orderItemsEntity.setProduct(productsEntity);
        orderItemsEntity.setProductName(productsEntity.getProductName());
        orderItemsEntity.setCostPrice(productsEntity.getCostPrice());
        orderItemsEntity.setSellingPrice(shopProductsEntity.getSellingPrice());
        orderItemsEntity.setQuantity(orderRequest.getAmountProduct());
        orderItemRepository.save(orderItemsEntity);

        return "สั่งซื้อสำเร็จ เลขที่ออเดอร์: " + saveOrder.getOrderNumber() + " กรุณาชำระเงิน";
    }

    @Transactional
    public String simulatePayment(String slug, Integer orderId) {
        OrdersEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("ไม่พบออเดอร์นี้"));

        if (!order.getShop().getShopSlug().equals(slug)) {
            throw new RuntimeException("ออเดอร์นี้ไม่ได้อยู่ในร้านค้านี้");
        }

        if (order.getStatus() != OrdersEntity.Status.pending) {
            throw new RuntimeException("ออเดอร์นี้ชำระเงินแล้วหรือถูกยกเลิก");
        }

        for (OrderItemsEntity item : order.getOrderItems()) {
            ProductsEntity product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("สินค้า " + product.getProductName() + " มีไม่เพียงพอ");
            }
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrdersEntity.Status.pending);
        orderRepository.save(order);

        return "ขำระเงินจำลองสำเร็จ สถานะออเดอร์เปลี่ยนเป็น รอดำเนินการ";
    }

    public TrackOrderResponse trackOrder(String orderNumber) {
        OrdersEntity order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("ไม่พบออเดอร์นี้"));
                
        List<String> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItemsEntity item : order.getOrderItems()) {
                items.add(item.getProductName() + " (x" + item.getQuantity() + ")");
            }
        }

        return new TrackOrderResponse(
                order.getOrderNumber(),
                order.getStatus().toString(),
                items,
                order.getShippingAddress(),
                order.getTotalAmount(),
                order.getCreatedAt()
        );
    }
}
