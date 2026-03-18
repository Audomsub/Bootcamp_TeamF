package com.example.bootcamp.service;

import com.example.bootcamp.dto.Request.ProductRequest;
import com.example.bootcamp.entity.OrdersEntity;
import com.example.bootcamp.entity.ProductsEntity;
import com.example.bootcamp.repository.OrderItemRepository;
import com.example.bootcamp.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.dao.DataIntegrityViolationException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @PersistenceContext
    private EntityManager entityManager;

    private final String UPLOAD_DIR = "uploads/products/";

    @Transactional
    public void fixSequence() {
        try {
            entityManager.createNativeQuery("SELECT setval(pg_get_serial_sequence('products', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM products").getSingleResult();
        } catch (Exception e) {
            // Fallback if sequence name differs
            try {
                entityManager.createNativeQuery("SELECT setval('products_id_seq', COALESCE(MAX(id), 0) + 1, false) FROM products").getSingleResult();
            } catch (Exception e2) {
                System.err.println("Could not reset sequence: " + e2.getMessage());
            }
        }
    }

    @Transactional
    public String addProduct(ProductRequest request) {
        if (request.getMin_price().compareTo(request.getCost_price()) < 0) {
            return "ราคาขายขั้นต่ำต้อง >= ราคาทุน";
        }
        
        ProductsEntity productsEntity = new ProductsEntity();
        mapRequestToEntity(request, productsEntity);

        try {
            productRepository.save(productsEntity);
        } catch (DataIntegrityViolationException e) {
            // Sequence out of sync! Fix and retry once.
            fixSequence();
            productRepository.save(productsEntity);
        }
        
        return "เพิ่มสินค้าสำเร็จแล้ว";
    }

    private void mapRequestToEntity(ProductRequest request, ProductsEntity entity) {
        entity.setProductName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setCostPrice(request.getCost_price());
        entity.setMinSellPrice(request.getMin_price());
        entity.setStock(request.getStock());

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = saveImage(request.getImage());
            entity.setImageUrl(imageUrl);
        }
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            return "/" + UPLOAD_DIR + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage());
        }
    }

    public List<ProductsEntity> getAllProducts() {
        return productRepository.findAll();
    }

    public Page<ProductsEntity> getAllProductsPaginated(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Transactional
    public String editProduct(Integer id, ProductRequest request) {
        Optional<ProductsEntity> optionalProductsEntity = productRepository.findById(id);
        if (optionalProductsEntity.isEmpty()) {
            return "ไม่พบสินค้านี้ในระบบ";
        }

        if (request.getMin_price().compareTo(request.getCost_price()) < 0) {
            return "ราคาขายต้องไม่น้อยกว่าราคาทุน";
        }

        ProductsEntity productsEntity = optionalProductsEntity.get();
        mapRequestToEntity(request, productsEntity);

        productRepository.save(productsEntity);
        return "แก้ไขสำเร็จ";
    }

    @Transactional
    public String deleteProduct(Integer id) {
        ProductsEntity productsEntity = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบสินค้านนี้ในระบบ"));
        boolean linkToPendingOrder = orderItemRepository.existsByProductIdAndOrderStatusIn(id,
                List.of(OrdersEntity.Status.pending, OrdersEntity.Status.shipped));
        if (linkToPendingOrder) {
            return "ไม่สามารถลบได้เนื่องจาก มีสินค้าคงเหลือในออเดอร์";
        }
        productRepository.delete(productsEntity);
        return "ลบสินค้าสำเร็จ";
    }
}
