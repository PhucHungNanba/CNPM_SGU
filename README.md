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
        Gateway(" API Gateway<br>(Authentication & Routing)")
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
    User & Product & Order & Branch & Payment & Delivery -->|Read/Write| DB
    Các Microservices Chính
Hệ thống bao gồm 6 dịch vụ nghiệp vụ cốt lõi:

User Service: Quản lý đăng ký, đăng nhập (cấp phát JWT) và hồ sơ cá nhân.

Product Service: Quản lý danh mục món ăn (CRUD) và cung cấp API kiểm tra tồn kho cho Order Service.

Order Service (Trung tâm):

Tiếp nhận yêu cầu đặt hàng.

Gọi API sang Product Service để giữ hàng.

Gọi API sang Branch Service để tìm cửa hàng phù hợp.

Cập nhật trạng thái đơn hàng từ các dịch vụ khác.

Branch Service: Quản lý danh sách chi nhánh và khu vực phục vụ.

Payment Service: Xử lý giao dịch với VNPay và ghi nhận lịch sử thanh toán.

Delivery Service: Quản lý quy trình giao vận, trạng thái Drone và cập nhật tiến độ giao hàng về Order Service.

🔄 Luồng Nghiệp vụ (Key Flows)
1. Quy trình Đặt hàng (Synchronous Flow)
Quy trình được thực hiện tuần tự để đảm bảo tính chính xác:

Client gửi đơn hàng -> API Gateway -> Order Service.

Order Service gọi API checkStock sang Product Service.

Nếu còn hàng: Khóa tồn kho tạm thời.

Nếu hết hàng: Trả về lỗi ngay lập tức.

Order Service gọi API sang Branch Service để gán đơn cho chi nhánh gần nhất.

Sau khi tạo đơn thành công, Client được chuyển hướng sang Payment Service để thanh toán.

2. Quy trình Cập nhật Giao vận
Delivery Service chịu trách nhiệm điều phối Drone.

Khi trạng thái giao hàng thay đổi (VD: Delivered), Delivery Service sẽ gọi ngược lại API updateStatus của Order Service để đồng bộ trạng thái cuối cùng cho người dùng.

🚧 Roadmap & Future Features
[x] Triển khai kiến trúc Microservices cơ bản (REST).

[x] Tích hợp Shared Database MongoDB.

[ ] Phase 2: Phát triển Notification Service (Thông báo đẩy).

[ ] Phase 2: Tích hợp Message Broker để xử lý các tác vụ nền.

Thực hiện bởi Nhóm 14 - CNPM SGU


### 💡 Những thay đổi quan trọng mình đã thực hiện:

  **Loại bỏ hoàn toàn Kafka:** Không còn hình ảnh Message Broker trong sơ đồ và Tech Stack.
  **Cập nhật Sơ đồ Mermaid:**
    * Vẽ lại các đường kết nối theo đúng hình `Component.drawio (1).png` bạn gửi.
    * Thể hiện rõ **Delivery Service** gọi ngược lại **Order Service** bằng REST để cập nhật trạng thái (thay vì bắn event qua Kafka).
    * Notification Service đã được xóa khỏi sơ đồ chính (hoặc đưa vào phần Future Features).
  **Điều chỉnh mô tả luồng:** Chuyển từ "Event-Driven" sang "Synchronous REST" (Giao tiếp đồng bộ), đúng với bả
