#  FoodFast Delivery - Hệ thống Giao Món Ăn Bằng Drone

[![Build Status](https://img.shields.io/badge/Build-Passing-success)](https://github.com/PhucHungNhanba/CNPM_SGU)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-green)](https://spring.io/projects/spring-boot)
[![Frontend](https://img.shields.io/badge/Frontend-ReactJS%20%7C%20React%20Native-blue)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248)](https://www.mongodb.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Microservices%20(REST)-orange)](https://restfulapi.net/)

> **Đồ án môn Công nghệ Phần mềm - Nhóm 14**
>
> Hệ thống đặt và giao món ăn trực tuyến (Cơm Tấm, Phở...) tích hợp công nghệ giao hàng bằng **Drone**, với kiến trúc Microservices linh hoạt và trải nghiệm người dùng đồng nhất.

---

##  Giới thiệu Dự án
**FoodFast Delivery** cung cấp giải pháp đặt món ăn nhanh chóng, giải quyết các vấn đề về quy trình giao vận phức tạp. Hệ thống tập trung vào tính ổn định và khả năng tích hợp chặt chẽ giữa các dịch vụ thông qua giao thức chuẩn RESTful API.

###  Mục tiêu chính
* **Trải nghiệm nhất quán:** Đồng bộ dữ liệu hoàn hảo giữa Web App (ReactJS) và Mobile App (React Native).
* **Vận hành tự động:** Quy trình kiểm tra tồn kho, gán chi nhánh và tạo đơn vận chuyển được xử lý tự động qua API.
* **Quản lý tập trung:** Sử dụng Shared Database để đảm bảo tính nhất quán dữ liệu cao nhất cho các nghiệp vụ cốt lõi.

---

##  Kiến trúc Hệ thống 

Hệ thống được xây dựng theo kiến trúc **Microservices RESTful**, trong đó các dịch vụ giao tiếp trực tiếp với nhau thông qua HTTP Request (Đồng bộ). Mọi yêu cầu từ phía người dùng đều được kiểm soát và điều hướng qua **API Gateway**.

### Sơ đồ Component
*(Mô phỏng lại dựa trên thiết kế thực tế của nhóm)*

```mermaid
graph TD
    subgraph Client_Layer
        Client[" Client App (Web & Mobile)"]
    end

    subgraph Access_Control
        Gateway(" API Gateway<br>")
    end

    subgraph Core_Services [Backend Microservices System]
        User[" User Service<br>(Auth & Profile)"]
        Product[" Product Service<br>(Menu & Stock)"]
        Order[" Order Service<br>(Core Logic)"]
        Branch[" Branch Service<br>(Store Management)"]
        Payment[" Payment Service<br>(VNPay Integration)"]
        Delivery[" Delivery Service<br>(Drone Dispatch)"]
    end

    subgraph Data_Layer
        DB[(" Shared MongoDB Cluster")]
    end

    %% Client requests
    Client -->|HTTPS / REST| Gateway
    
    %% Gateway Routing
    Gateway -->|Forward| User
    Gateway -->|Forward| Product
    Gateway -->|Forward| Order
    Gateway -->|Forward| Payment
    Gateway -->|Forward| Delivery
    Gateway -->|Forward| Branch

    %% Inter-service Communication (Synchronous REST)
    Order -->|REST: Check Stock| Product
    Order -->|REST: Assign Branch| Branch
    Delivery -->|REST: Update Status| Order
    
    %% Database Interaction
    User --> DB
    Product --> DB
    Order --> DB
    Branch --> DB
    Payment --> DB
    Delivery --> DB
