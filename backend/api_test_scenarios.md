# รวมรายการ API สำหรับนำไปทดสอบใน Postman (API Test Scenarios)

เพื่อให้ทีม Frontend และ Backend สามารถเทสการเชื่อมต่อระบบ **Reseller Management System** ได้อย่างถูกต้อง กรุณาอ้างอิงข้อมูลด้านล่างนี้ประกอบการยิง Postman ครับ

---

## 1. Authentication (การยืนยันตัวตน)

### 1.1 Login (ระบบศูนย์กลาง - ล็อกอินได้ทั้ง Admin และ Reseller)
- **URL**: `POST http://localhost:8080/login`
- **Body** (JSON):
  ```json
  {
      "email": "admin@system.com",
      "password": "password123"
  }
  ```
- **Response**: ระบบจะเช็ก Role แล้วแนบกลับมาให้ พร้อมยิง JWT Token (ให้เอา Role ไปแยกหน้าเอาเองที่ฝั่ง Front)

### 1.2 Reseller Register (ตัวแทนสมัคร)
- **URL**: `POST http://localhost:8080/register`
- **Body** (JSON):
  ```json
  {
      "name": "Somchai Jaidee",
      "email": "somchai@mail.com",
      "password": "password123",
      "confirmPassword": "password123",
      "phone": "0812345678",
      "shopName": "Best Shop",
      "address": "123 BKK"
  }
  ```

---

## 2. Admin APIs (ใส่ Header: `Authorization: Bearer <Admin_Token>`)

### 2.1 ดู Dashboard ส่วนของ Admin
- **URL**: `GET http://localhost:8080/admin/dashboard`

### 2.2 จัดการสินค้า (Products)
- **ดูสินค้าทั้งหมด**: `GET http://localhost:8080/admin/products`
- **เพิ่มสินค้า**: `POST http://localhost:8080/admin/products/add`
  ```json
  {
      "productName": "เสื้อคอกลมสีดำ",
      "imageUrl": "https://example.com/shirt.jpg",
      "description": "เสื้อใส่สบาย",
      "costPrice": 100,
      "minSellPrice": 150,
      "stock": 50
  }
  ```
- **แก้ไขสินค้า**: `PUT http://localhost:8080/admin/products/edit/1` (ส่ง Body แบบเดียวกับข้างบน)
- **ลบสินค้า**: `DELETE http://localhost:8080/admin/products/delete/1`

### 2.3 จัดการออเดอร์ (Orders)
- **ดูออเดอร์ทั้งหมดของร้านทุกร้าน**: `GET http://localhost:8080/admin/orders`
- **ปรับสถานะออเดอร์เป็นจัดส่งแล้ว**: `POST http://localhost:8080/admin/orders/status?status=shipped`
  ```json
  {
      "orderId": 1
  }
  ```

### 2.4 จัดการตัวแทน (Resellers)
- **ดูรายชื่อตัวแทน**: `GET http://localhost:8080/admin/resellers`
- **เปลี่ยนสถานะตัวแทน**: `POST http://localhost:8080/admin/reseller/1/status?status=approved` (หรือ rejected)

---

## 3. Reseller APIs (ใส่ Header: `Authorization: Bearer <Reseller_Token>`)

### 3.1 ดู Dashboard ขอข้อมูลร้าน
- **URL**: `GET http://localhost:8080/reseller/dashboard`

### 3.2 แค็ตตาล็อกสินค้าและการเลือกเข้าหน้าร้าน
- **ดูแค็ตตาล็อกสินค้ากลาง**: `GET http://localhost:8080/reseller/catalog`
- **เพิ่มสินค้าเข้าร้าน/เปลี่ยนราคา**: `POST http://localhost:8080/reseller/catalog/select`
  ```json
  {
      "productId": 1,
      "sellingPrice": 220
  }
  ```
- **ถอดสินค้าออกจากหน้าร้าน**: `DELETE http://localhost:8080/reseller/catalog/remove/1`

### 3.3 ดูออเดอร์ในร้านตัวเอง
- **URL**: `GET http://localhost:8080/reseller/orders`

### 3.4 ดูยอดเงิน Wallet 
- **URL**: `GET http://localhost:8080/reseller/wallet`

---

## 4. Customer APIs (ลูกค้าฝั่งหน้าร้านตัวแทน) ไม่ต้องใช้ Token

*(หมายเหตุ: สมมติว่า URL ของร้านคือ best-shop ให้แทนค่า `slug` ด้วย `best-shop`)*

### 4.1 เข้าชมหน้าร้าน
- **URL**: `GET http://localhost:8080/shop/best-shop`

### 4.2 สร้างออเดอร์สั่งซื้อ (Checkout)
- **URL**: `POST http://localhost:8080/shop/best-shop/checkout`
- **Body** (JSON):
  ```json
  {
      "customerName": "นายใจดี มีสุข",
      "customerPhone": "0998887777",
      "customerAddress": "1/1 ซอย 1 กรุงเทพฯ",
      "productId": 1,
      "amountProduct": 2
  }
  ```

### 4.3 กดชำระเงินจำลอง
- **URL**: `POST http://localhost:8080/shop/best-shop/payment/1`
  *(หมายเลข `1` ท้ายสุดคือเลข Order ID ประจำ Database ไม่ใช่ orderNumber ของลูกค้า)*

### 4.4 ค้นหาสถานะออเดอร์
- **URL**: `GET http://localhost:8080/track-order?orderNumber=ORD-XXXXXXXX`
  *(เลข `ORD-XXX` เป็นเลขที่สุ่มตอน Customer Checkout สำเร็จ ให้นำมาใช้ที่นี่)*
