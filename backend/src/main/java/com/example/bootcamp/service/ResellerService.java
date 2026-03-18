package com.example.bootcamp.service;

import com.example.bootcamp.dto.Request.ResellerCatalogRequest;
import com.example.bootcamp.dto.Response.ResellerCatalogResponse;
import com.example.bootcamp.dto.Response.ResellerOrderResponse;
import com.example.bootcamp.dto.Response.ResellerWalletResponse;
import com.example.bootcamp.dto.Response.WalletLogResponse;
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
public class ResellerService {
    @Autowired private UserRepository userRepository;
    @Autowired private ShopRepository shopRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private ShopProductRepository shopProductRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private WalletRepository walletRepository;

    @Transactional
    public List<ResellerCatalogResponse> getCentralCatalogByUsername(String email) {
        System.out.println("กำลังค้นหาผู้ใช้ด้วยชื่อ: " + email);
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน: " + email));
        ShopsEntity shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        List<ProductsEntity> allProducts = productRepository.findAll();

        List<ResellerCatalogResponse> responseList = new ArrayList<>();

        for (ProductsEntity product : allProducts) {

            Optional<ShopProductsEntity> shopProductOpt = shopProductRepository
                    .findByShopIdAndProductId(shop.getId(), product.getId());

            boolean isAdded = false;
            BigDecimal currentPrice = null;
            if (shopProductOpt.isPresent()) {
                isAdded = true;
                currentPrice = shopProductOpt.get().getSellingPrice();
            }
            ResellerCatalogResponse resellerCatalogResponse = new ResellerCatalogResponse(
                    product.getId(),
                    product.getProductName(),
                    product.getImageUrl(),
                    product.getCostPrice(),
                    product.getMinSellPrice(),
                    product.getStock(),
                    isAdded,
                    currentPrice
            );
            responseList.add(resellerCatalogResponse);
        }

        return responseList;
    }

    @Transactional
    public String selectProductToShop(String email, ResellerCatalogRequest request) {

        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน: " + email));
        ShopsEntity shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        ProductsEntity product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้าในระบบ"));

        if (product.getStock() <= 0) {
            return "สินค้าหมด ไม่สามารถเพิ่มเข้าร้านได้";
        }

        if (request.getSellingPrice().compareTo(product.getMinSellPrice()) < 0) {
            return "ราคาขายต้องไม่ต่ำกว่า " + product.getMinSellPrice() + " บาท";
        }

        Optional<ShopProductsEntity> existing = shopProductRepository
                .findByShopIdAndProductId(shop.getId(), product.getId());

        if (existing.isPresent()) {
            ShopProductsEntity shopProduct = existing.get();
            shopProduct.setSellingPrice(request.getSellingPrice());
            shopProductRepository.save(shopProduct);
            return "แก้ไขราคาขายสำเร็จ";
        } else {
            ShopProductsEntity newShopProduct = new ShopProductsEntity();
            newShopProduct.setShop(shop);
            newShopProduct.setProduct(product);
            newShopProduct.setSellingPrice(request.getSellingPrice());
            shopProductRepository.save(newShopProduct);
            return "เพิ่มสินค้าเข้าร้านสำเร็จ";
        }
    }

    @Transactional()
    public List<ResellerOrderResponse> getMyOrder(String email) {
        // 1. หา User และ Shop
        UsersEntity usersEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));
        ShopsEntity shopsEntity = shopRepository.findByUserId(usersEntity.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        List<OrdersEntity> ordersEntityList = orderRepository.findByShopIdOrderByCreatedAtDesc(shopsEntity.getId());
        List<ResellerOrderResponse> resellerOrderResponses = new ArrayList<>();

        for (OrdersEntity ordersEntity : ordersEntityList) {
            BigDecimal orderTotalSelling = BigDecimal.ZERO;
            BigDecimal orderTotalProfit = BigDecimal.ZERO;
            StringBuilder productName = new StringBuilder();

            for (OrderItemsEntity orderItemsEntity : ordersEntity.getOrderItems()) {
                BigDecimal qty = new BigDecimal(orderItemsEntity.getQuantity());
                BigDecimal itemSelling = orderItemsEntity.getSellingPrice().multiply(qty);
                orderTotalSelling = orderTotalSelling.add(itemSelling);

                BigDecimal itemProfit = orderItemsEntity.getSellingPrice()
                        .subtract(orderItemsEntity.getCostPrice())
                        .multiply(qty);
                orderTotalProfit = orderTotalProfit.add(itemProfit);
                if (productName.length() > 0) {
                    productName.append(" , ");
                }
                productName.append(orderItemsEntity.getProductName())
                        .append(" (").append(orderItemsEntity.getQuantity()).append(")");
            }

            resellerOrderResponses.add(new ResellerOrderResponse(
                    ordersEntity.getId(),
                    ordersEntity.getCustomerName(),
                    productName.toString(),
                    orderTotalSelling,
                    orderTotalProfit,
                    ordersEntity.getStatus() != null ? ordersEntity.getStatus().name() : "pending"
            ));
        }
        return resellerOrderResponses;
    }

    @Transactional
    public ResellerWalletResponse getWalletDetails(String email) {
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));
        WalletsEntity wallet = walletRepository.findByUserId(user.getId()).orElse(null);
        BigDecimal balance = wallet != null ? wallet.getBalance() : BigDecimal.ZERO;

        ShopsEntity shop = shopRepository.findByUserId(user.getId()).orElse(null);
        List<WalletLogResponse> history = new ArrayList<>();
        if (shop != null) {
            List<OrdersEntity> orders = orderRepository.findByShopIdOrderByCreatedAtDesc(shop.getId());
            for (OrdersEntity o : orders) {
                if (o.getStatus() == OrdersEntity.Status.shipped || o.getStatus() == OrdersEntity.Status.completed) {
                    history.add(new WalletLogResponse(o.getOrderNumber(), o.getResellerProfit(), o.getCreatedAt()));
                }
            }
        }
        return new ResellerWalletResponse(balance, history);
    }

    @Transactional
    public com.example.bootcamp.dto.Response.ResellerDashboardResponse getDashboardData(String email) {
        UsersEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ไม่พบผู้ใช้งาน"));
        ShopsEntity shop = shopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านค้าของคุณ"));

        WalletsEntity wallet = walletRepository.findByUserId(user.getId()).orElse(null);
        BigDecimal balance = wallet != null ? wallet.getBalance() : BigDecimal.ZERO;
        
        List<OrdersEntity> orders = orderRepository.findByShopIdOrderByCreatedAtDesc(shop.getId());
        long orderCount = orders.size();

        return com.example.bootcamp.dto.Response.ResellerDashboardResponse.builder()
                .shopName(shop.getShopName())
                .shopSlug(shop.getShopSlug())
                .totalProfit(balance)
                .orderCount(orderCount)
                .build();
    }
}