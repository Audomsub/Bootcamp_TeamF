# 🚀 Bootcamp Team F — ระบบ Reseller E-Commerce

> ระบบสำหรับการจัดการสินค้าแบบ Reseller พร้อมด้วยระบบ Admin, Reseller และหน้าร้านสำหรับลูกค้า

---

## 📋 สารบัญ

- [ภาพรวมโปรเจกต์](#-ภาพรวมโปรเจกต์)
- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)
- [สิ่งที่ต้องติดตั้งก่อน (Prerequisites)](#-สิ่งที่ต้องติดตั้งก่อน-prerequisites)
- [การติดตั้งและรันโปรเจกต์](#-การติดตั้งและรันโปรเจกต์)
  - [1. Clone โปรเจกต์](#1-clone-โปรเจกต์)
  - [2. ตั้งค่าฐานข้อมูล (Database)](#2-ตั้งค่าฐานข้อมูล-database)
  - [3. ติดตั้งและรัน Backend](#3-ติดตั้งและรัน-backend)
  - [4. ติดตั้งและรัน Frontend](#4-ติดตั้งและรัน-frontend)
- [โครงสร้างโปรเจกต์](#-โครงสร้างโปรเจกต์)
- [คู่มือการใช้งานระบบ](#-คู่มือการใช้งานระบบ)
  - [ระบบ Admin](#-ระบบ-admin)
  - [ระบบ Reseller](#-ระบบ-reseller)
  - [หน้าร้าน (Shop) สำหรับลูกค้า](#-หน้าร้าน-shop-สำหรับลูกค้า)
- [API Endpoints](#-api-endpoints)
- [การแก้ไขปัญหาที่พบบ่อย](#-การแก้ไขปัญหาที่พบบ่อย)

---

## 🎯 ภาพรวมโปรเจกต์

ระบบนี้เป็น **แพลตฟอร์ม E-Commerce สำหรับ Reseller** ที่มีผู้ใช้ 3 บทบาท:

| บทบาท | คำอธิบาย |
|--------|----------|
| **Admin** | จัดการสินค้า, อนุมัติ Reseller, ดูรายงาน Dashboard, จัดการออเดอร์ |
| **Reseller** | สมัครเป็นตัวแทน, เลือกสินค้ามาขาย, ตั้งราคาเอง, มีหน้าร้านส่วนตัว, จัดการกระเป๋าเงิน (Wallet) |
| **ลูกค้า (Customer)** | เข้าชมหน้าร้านของ Reseller, สั่งซื้อสินค้า, ชำระเงิน, ติดตามออเดอร์ |

---

## 🛠 เทคโนโลยีที่ใช้

### Frontend
| เทคโนโลยี | เวอร์ชัน | คำอธิบาย |
|-----------|---------|----------|
| React | 19.x | ไลบรารี UI |
| TypeScript | 5.x | ภาษาที่ใช้พัฒนา |
| Vite | 8.x | Build tool & Dev server |
| TailwindCSS | 4.x | CSS Framework |
| React Router DOM | 7.x | จัดการ Routing |
| Axios | 1.x | เรียก API |
| React Hook Form | 7.x | จัดการ Form |
| Zod | 4.x | Validation |
| Recharts | 3.x | แสดงกราฟ & Chart |
| Lucide React | - | ชุด Icon |

### Backend
| เทคโนโลยี | เวอร์ชัน | คำอธิบาย |
|-----------|---------|----------|
| Java | 17 | ภาษาหลัก |
| Spring Boot | 3.4.3 | Framework หลัก |
| Spring Security | - | ระบบ Authentication & Authorization |
| Spring Data JPA | - | จัดการ ORM & Database |
| PostgreSQL | latest | ฐานข้อมูลหลัก |
| JWT (jjwt) | 0.11.5 | Token-based Authentication |
| Lombok | 1.18.44 | ลดโค้ด Boilerplate |
| Maven | - | Build tool |

### Infrastructure
| เทคโนโลยี | คำอธิบาย |
|-----------|----------|
| Docker & Docker Compose | รัน PostgreSQL ผ่าน Container |

---

## ✅ สิ่งที่ต้องติดตั้งก่อน (Prerequisites)

ก่อนเริ่มใช้งาน ให้ตรวจสอบว่าติดตั้งซอฟต์แวร์ต่อไปนี้แล้ว:

| ซอฟต์แวร์ | เวอร์ชันขั้นต่ำ | ตรวจสอบด้วยคำสั่ง |
|----------|--------------|-----------------|
| **Node.js** | 18+ | `node -v` |
| **npm** | 9+ | `npm -v` |
| **Java JDK** | 17 | `java -version` |
| **Maven** | 3.8+ | `mvn -v` (หรือใช้ `mvnw` ที่มาพร้อมโปรเจกต์) |
| **Docker** | 20+ | `docker -v` |
| **Docker Compose** | 2+ | `docker compose version` |
| **Git** | 2+ | `git -v` |

### วิธีติดตั้งซอฟต์แวร์ที่จำเป็น

<details>
<summary>📦 ติดตั้ง Node.js</summary>

1. ดาวน์โหลดจาก [https://nodejs.org/](https://nodejs.org/) (เลือก LTS version)
2. ติดตั้งตามคำแนะนำ
3. ตรวจสอบ: `node -v` และ `npm -v`
</details>

<details>
<summary>☕ ติดตั้ง Java JDK 17</summary>

1. ดาวน์โหลดจาก [https://adoptium.net/](https://adoptium.net/) (เลือก JDK 17)
2. ติดตั้งและตั้งค่า `JAVA_HOME` environment variable
3. ตรวจสอบ: `java -version`
</details>

<details>
<summary>🐳 ติดตั้ง Docker</summary>

1. ดาวน์โหลด Docker Desktop จาก [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. ติดตั้งและเปิด Docker Desktop
3. ตรวจสอบ: `docker -v`
</details>

---

## 📥 การติดตั้งและรันโปรเจกต์

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/Audomsub/Bootcamp_TeamF.git
cd Bootcamp_TeamF
```

---

### 2. ตั้งค่าฐานข้อมูล (Database)

ระบบใช้ **PostgreSQL** ที่รันผ่าน **Docker Compose**

#### 2.1 เริ่มต้น PostgreSQL Container

```bash
cd backend/backend/backend
docker compose up -d
```

คำสั่งนี้จะ:
- ดึง Image `postgres:latest`
- สร้าง Container ชื่อ `postgresql`
- สร้างฐานข้อมูล `bootcamp_db`
- ใช้ user `dev_dew` / password `password`
- เปิดพอร์ต `5432`

#### 2.2 ตรวจสอบว่า Container รันสำเร็จ

```bash
docker ps
```

คุณจะเห็น Container ชื่อ postgresql ที่มีสถานะ `Up`

#### 2.3 ข้อมูลการเชื่อมต่อฐานข้อมูล

| รายการ | ค่า |
|--------|-----|
| Host | `localhost` (หรือ IP ของเครื่อง) |
| Port | `5432` |
| Database | `bootcamp_db` |
| Username | `dev_dew` |
| Password | `password` |

> **💡 หมายเหตุ:** หากต้องการใช้ tool จัดการ DB เช่น pgAdmin หรือ DBeaver สามารถเชื่อมต่อด้วยข้อมูลด้านบน

---

### 3. ติดตั้งและรัน Backend

Backend เป็น Spring Boot Application ที่อยู่ในโฟลเดอร์ `backend/backend/backend`

#### 3.1 เข้าสู่โฟลเดอร์ Backend

```bash
cd backend/backend/backend
```

#### 3.2 ตั้งค่า application.yaml

ไฟล์ตั้งค่าอยู่ที่ `src/main/resources/application.yaml`

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bootcamp_db    # ← แก้ IP ให้ตรงกับเครื่องที่รัน DB
    username: dev_dew
    password: password
```

> ⚠️ **สำคัญ:** หากรัน Database บนเครื่องเดียวกัน ให้ใช้ `localhost`
> หากรัน Database บนเครื่องอื่น ให้เปลี่ยน IP ในฟิลด์ `url` ให้ตรงกับ IP ของเครื่องที่รัน Database

#### 3.3 Build โปรเจกต์

**Windows:**
```bash
.\mvnw.cmd clean install -DskipTests
```

**macOS / Linux:**
```bash
./mvnw clean install -DskipTests
```

#### 3.4 รัน Backend Server

**Windows:**
```bash
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```bash
./mvnw spring-boot:run
```

เมื่อรันสำเร็จจะเห็นข้อความในเทอร์มินัล:
```
Started BootcampApplication in X.XX seconds
```

Backend จะเปิดที่: **http://localhost:8080**

---

### 4. ติดตั้งและรัน Frontend

Frontend เป็น React + Vite Application ที่อยู่ในโฟลเดอร์ `frontend/frontend/Fontend/my-bootcamp--`

#### 4.1 เข้าสู่โฟลเดอร์ Frontend

```bash
cd frontend/frontend/Fontend/my-bootcamp--
```

#### 4.2 ติดตั้ง Dependencies

```bash
npm install
```

คำสั่งนี้จะติดตั้ง packages ทั้งหมดที่ระบุใน `package.json`

#### 4.3 ตั้งค่า Environment Variable

แก้ไขไฟล์ `.env` ในโฟลเดอร์ Frontend:

```env
VITE_API_URL=http://localhost:8080
```

> ⚠️ **สำคัญ:** เปลี่ยน URL ให้ตรงกับที่อยู่ของ Backend Server
> - ถ้ารันทุกอย่างบนเครื่องเดียวกัน → ใช้ `http://localhost:8080`
> - ถ้า Backend อยู่บนเครื่องอื่น → ใช้ `http://<IP_ของ_Backend>:8080`

#### 4.4 รัน Frontend Dev Server

```bash
npm run dev
```

เมื่อรันสำเร็จจะเห็นข้อความ:
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://127.0.0.1:3000/
```

Frontend จะเปิดที่: **http://127.0.0.1:3000**

#### 4.5 Build สำหรับ Production (ไม่จำเป็นสำหรับการพัฒนา)

```bash
npm run build
npm run preview
```

---

## 📁 โครงสร้างโปรเจกต์

```
Bootcamp_TeamF/
├── README.md                          # ← ไฟล์นี้
├── frontend/                          # โปรเจกต์ Frontend
│   └── frontend/
│       └── Fontend/
│           └── my-bootcamp--/
│               ├── .env               # ตั้งค่า API URL
│               ├── package.json       # Dependencies & Scripts
│               ├── vite.config.ts     # Vite Configuration
│               ├── index.html         # HTML Entry Point
│               └── src/
│                   ├── App.tsx        # Route Configuration
│                   ├── main.tsx       # Entry Point
│                   ├── index.css      # Global Styles
│                   ├── components/    # Shared Components
│                   │   ├── layouts/   # Layout Components (Admin, Reseller, Shop)
│                   │   └── ...
│                   ├── pages/         # หน้าต่างๆ ของระบบ
│                   │   ├── admin/     # หน้า Admin
│                   │   ├── auth/      # หน้า Login / Register
│                   │   ├── reseller/  # หน้า Reseller
│                   │   └── shop/      # หน้าร้านค้า
│                   ├── services/      # API Service Functions
│                   ├── contexts/      # React Context (Auth, Cart)
│                   ├── types/         # TypeScript Type Definitions
│                   └── lib/           # Utility Functions
│
└── backend/                           # โปรเจกต์ Backend
    └── backend/
        └── backend/
            ├── docker-compose.yml     # PostgreSQL Container
            ├── pom.xml                # Maven Dependencies
            ├── mvnw / mvnw.cmd        # Maven Wrapper
            └── src/
                └── main/
                    ├── resources/
                    │   └── application.yaml  # App Configuration
                    └── java/com/example/bootcamp/
                        ├── config/        # Security & App Config
                        ├── controller/    # REST API Controllers
                        ├── dto/           # Data Transfer Objects
                        ├── entity/        # JPA Entities (Database Models)
                        ├── repository/    # JPA Repositories
                        ├── security/      # JWT & Security Filters
                        ├── service/       # Business Logic
                        └── utill/         # Utility Classes
```

---

## 📖 คู่มือการใช้งานระบบ

### 🔐 ระบบ Authentication (การเข้าสู่ระบบ)

#### เข้าสู่ระบบ (Login)
1. เปิดเว็บเบราว์เซอร์ไปที่ `http://127.0.0.1:3000/login`
2. กรอก **Username** และ **Password**
3. กดปุ่ม **Login**
4. ระบบจะนำทางไปยังหน้าแรกตามบทบาท:
   - **Admin** → `/admin/dashboard`
   - **Reseller** → `/reseller/dashboard`

#### สมัครสมาชิก Reseller (Register)
1. ไปที่หน้า `http://127.0.0.1:3000/register`
2. กรอกข้อมูลที่จำเป็น
3. กดปุ่ม **Register**
4. รอ Admin อนุมัติก่อนเข้าใช้งาน

> **💡 หมายเหตุ:** Admin Login สามารถเข้าผ่าน `/admin/login` ได้เช่นกัน

---

### 👨‍💼 ระบบ Admin

เข้าถึงได้หลังจาก Login ด้วยบัญชี Admin — เส้นทางทั้งหมดอยู่ภายใต้ `/admin/*`

#### 📊 Dashboard (`/admin/dashboard`)
- ดูภาพรวมของระบบทั้งหมด
- แสดงสถิติยอดขาย, จำนวนออเดอร์, จำนวน Reseller
- กราฟแสดงข้อมูลต่างๆ (ใช้ Recharts)

#### 📦 จัดการสินค้า (`/admin/products`)
- **ดูรายการสินค้า** — แสดงสินค้าทั้งหมดในระบบพร้อมรูปภาพ, ราคา, จำนวนคงเหลือ
- **เพิ่มสินค้า** — กดปุ่ม "เพิ่มสินค้า" → ไปที่ `/admin/products/add`
  - กรอกชื่อสินค้า, คำอธิบาย, ราคา, จำนวน, อัปโหลดรูปภาพ
  - กดปุ่ม "บันทึก"
- **แก้ไขสินค้า** — กดปุ่มแก้ไขที่สินค้า → ไปที่ `/admin/products/edit/:id`
  - แก้ไขข้อมูลสินค้าแล้วกด "บันทึก"

#### 👥 จัดการ Reseller (`/admin/resellers`)
- ดูรายชื่อ Reseller ทั้งหมด
- **อนุมัติ / ปฏิเสธ** คำขอสมัคร Reseller ใหม่
- ดูรายละเอียดของ Reseller แต่ละราย

#### 📋 จัดการออเดอร์ (`/admin/orders`)
- ดูรายการออเดอร์ทั้งหมดในระบบ
- ดูรายละเอียดออเดอร์
- อัปเดตสถานะออเดอร์

---

### 🏪 ระบบ Reseller

เข้าถึงได้หลังจาก Login ด้วยบัญชี Reseller ที่ได้รับการอนุมัติแล้ว — เส้นทางทั้งหมดอยู่ภายใต้ `/reseller/*`

#### 📊 Dashboard (`/reseller/dashboard`)
- ดูภาพรวมยอดขาย
- สรุปรายได้, จำนวนออเดอร์
- กราฟแสดงผลประกอบการ

#### 🛍 แค็ตตาล็อกสินค้า (`/reseller/catalog`)
- ดูสินค้าทั้งหมดที่ Admin เพิ่มไว้ในระบบ
- **เลือกสินค้ามาขาย** — กดปุ่มเพิ่มสินค้าเข้าร้านของตัวเอง
- ตั้งราคาขายเอง (กำไรส่วนต่าง)

#### 📦 สินค้าของฉัน (`/reseller/my-products`)
- ดูรายการสินค้าที่เลือกมาขาย
- แก้ไขราคา / เปิด-ปิดการแสดงสินค้า
- ลบสินค้าออกจากร้าน

#### 📋 ออเดอร์ (`/reseller/orders`)
- ดูรายการออเดอร์ที่ลูกค้าสั่งซื้อจากร้านของตัวเอง
- อัปเดตสถานะออเดอร์

#### 💰 กระเป๋าเงิน (`/reseller/wallet`)
- ดูยอดเงินคงเหลือ
- ดูประวัติรายการเงินเข้า-ออก
- ถอนเงิน

---

### 🛒 หน้าร้าน (Shop) สำหรับลูกค้า

หน้าร้านเป็น **Public Routes** — ลูกค้าสามารถเข้าชมได้โดยไม่ต้อง Login

#### 🏬 หน้าร้าน (`/shop/:slug`)
- แต่ละ Reseller มี URL ร้านเป็นของตัวเอง (เช่น `/shop/somchai-store`)
- แสดงสินค้าทั้งหมดที่ Reseller นั้นจำหน่าย
- ดูรายละเอียดสินค้า, รูปภาพ, ราคา
- **เพิ่มสินค้าลงตะกร้า** — กดปุ่ม "Add to Cart"
- เปิด **Cart Drawer** เพื่อดูสินค้าในตะกร้า

#### 🧾 Checkout (`/shop/:slug/checkout`)
- ตรวจสอบรายการสินค้าที่จะสั่งซื้อ
- กรอกข้อมูลจัดส่ง (ชื่อ, ที่อยู่, เบอร์โทร)
- ยืนยันการสั่งซื้อ

#### 💳 ชำระเงิน (`/shop/:slug/payment`)
- แสดงข้อมูลการชำระเงิน
- อัปโหลดหลักฐานการชำระเงิน

#### 📍 ติดตามออเดอร์ (`/track-order`)
- กรอกหมายเลขออเดอร์เพื่อติดตามสถานะ
- แสดงสถานะออเดอร์ปัจจุบัน

---

## 🔌 API Endpoints

Backend Server รันที่ `http://localhost:8080` — นี่คือ API หลักที่ Frontend เรียกใช้

### Authentication
| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| POST | `/auth/login` | เข้าสู่ระบบ (Admin & Reseller) |
| POST | `/auth/register` | สมัคร Reseller ใหม่ |

### Admin — สินค้า
| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | `/admin/products` | ดูสินค้าทั้งหมด |
| POST | `/admin/products` | เพิ่มสินค้าใหม่ |
| PUT | `/admin/products/:id` | แก้ไขสินค้า |
| DELETE | `/admin/products/:id` | ลบสินค้า |

### Admin — Reseller
| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | `/admin/resellers` | ดูรายชื่อ Reseller ทั้งหมด |
| PUT | `/admin/resellers/:id/approve` | อนุมัติ Reseller |

### Reseller
| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | `/reseller/catalog` | ดูแค็ตตาล็อกสินค้า |
| POST | `/reseller/products` | เพิ่มสินค้าเข้าร้าน |
| GET | `/reseller/my-products` | ดูสินค้าในร้านของฉัน |
| GET | `/reseller/orders` | ดูออเดอร์ของฉัน |
| GET | `/reseller/wallet` | ดูข้อมูลกระเป๋าเงิน |
| GET | `/reseller/dashboard` | ดูข้อมูล Dashboard |

### Customer (Public)
| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | `/shop/:slug` | ดูหน้าร้านของ Reseller |
| POST | `/shop/checkout` | สั่งซื้อสินค้า |
| GET | `/track-order/:orderId` | ติดตามออเดอร์ |

---


## 👨‍💻 สมาชิกในทีม

**Team F — Bootcamp**

---

## 📄 License

โปรเจกต์นี้เป็นส่วนหนึ่งของ Bootcamp Training Program