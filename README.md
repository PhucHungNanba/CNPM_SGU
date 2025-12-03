# 🍚 FoodFast Delivery - Hệ thống Giao Các Món Việt bằng Drone

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-success)](https://github.com/PhucHungNhanba/CNPM_SGU.git)
[![Kubernetes](https://img.shields.io/badge/Deployment-Kubernetes-326ce5)](https://kubernetes.io/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green)](https://spring.io/projects/spring-boot)
 
Hệ thống backend cho ứng dụng giao đồ ăn **"FoodFast Delivery"** (tiền thân là DRONE - FAST FOOD DELIVERY), chuyên phục vụ các món ăn đặc trưng Việt Nam (Cơm Tấm, Phở, Bún chả...).

Dự án được xây dựng theo kiến trúc **Microservices hướng sự kiện (Event-Driven)**, ứng dụng công nghệ Drone để giao hàng. Mục tiêu là giải quyết các vấn đề về trải nghiệm người dùng không đồng nhất, quy trình đặt hàng phức tạp và thiếu công cụ theo dõi đơn hàng minh bạch trong các hệ thống hiện tại.

---

## 🎯 Mục tiêu dự án (Project Goals)

* ✅ **Trải nghiệm nhất quán:** Cung cấp trải nghiệm đặt hàng nhanh chóng, tiện lợi và đồng bộ trên cả nền tảng Web (React.js) và Mobile (React Native).
* ✅ **Hệ thống tích hợp:** Tích hợp liền mạch các chức năng từ duyệt menu, giỏ hàng, thanh toán (VNPay) đến theo dõi đơn hàng trong một hệ thống duy nhất.
* ✅ **Khả năng mở rộng:** Xây dựng hệ thống linh hoạt, dễ dàng mở rộng để tích hợp thêm các đối tác nhà hàng và dịch vụ vận chuyển mới.
* ✅ **Độ ổn định và Giám sát:** Đảm bảo hệ thống hoạt động ổn định, có khả năng phục hồi cao và được giám sát theo thời gian thực.

---

## 🏗️ Kiến trúc hệ thống (System Architecture)

Hệ thống được thiết kế theo kiến trúc **Microservices hướng sự kiện**, sử dụng **Message Broker (Kafka)** để giao tiếp bất đồng bộ giữa các dịch vụ.

* **Client (Web/Mobile):** Giao diện người dùng được xây dựng bằng React.js và React Native.
* **API Gateway:** Là điểm vào duy nhất cho tất cả các yêu cầu từ Client, điều hướng đến các microservice phù hợp.
* **Core Microservices:** Gồm 5 dịch vụ chính (User, Product, Order, Payment, Delivery), mỗi dịch vụ có logic nghiệp vụ và cơ sở dữ liệu riêng.
* **Messaging & Real-time:** Kafka xử lý các sự kiện. **Notification Service** lắng nghe các sự kiện này để gửi thông báo real-time tới người dùng qua WebSocket/SignalR.

```mermaid
graph TD
    subgraph Frontend
        A["📱 Client <br> React.js / React Native"]
    end

    subgraph Backend Infrastructure
        B("🌐 API Gateway")
        F["📨 Message Broker <br> (Kafka)"]
        G["🔔 Notification Service"]
    end

    subgraph Core Microservices
        C["👤 User Service"]
        D["🍱 Product Service <br> (Quản lý Cơm Tấm, Phở...)"]
        E["📝 Order Service"]
        H["💳 Payment Service"]
        I["🚁 Delivery Service <br> (Logic Drone & Shipper)"]
    end

    A -- REST API --> B
    B --> C & D & E & H & I

    E -- "Publish: OrderCreated" --> F
    H -- "Publish: PaymentProcessed" --> F
    I -- "Publish: DeliveryUpdated" --> F

    F -- "Consume Event" --> E
    F -- "Consume Event" --> I
    F -- "Consume Event" --> G
    F -- "Consume Event" --> D

    G -- WebSocket/SignalR --> A
````

-----

## 💻 Công nghệ sử dụng (Tech Stack)

| Hạng mục | Công nghệ | Biểu tượng | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Backend** | Spring Boot (Java) | 🍃 | Framework chính cho Microservices. |
| **Frontend** | React.js (Web), React Native (Mobile) | ⚛️ | Đảm bảo trải nghiệm đa nền tảng. |
| **Database** | PostgreSQL | 🐘 | Cơ sở dữ liệu quan hệ. |
| **Kiến trúc** | Microservices, Event-Driven | 🧩 | Chia nhỏ hệ thống thành 5 service chính. |
| **Message Broker** | Apache Kafka | 📨 | Xử lý giao tiếp bất đồng bộ. |
| **CI/CD & Deployment**| Docker, Kubernetes (K8s) | 🐳 ☸️ | Tự động hóa triển khai và mở rộng. |
| **Monitoring** | Prometheus, Grafana | 📈 📊 | Giám sát hiệu năng real-time. |
| **Authentication** | JWT (JSON Web Token) | 🔑 | Xác thực bảo mật cho API. |
| **Payment Gateway** | VNPay | 💳 | Tích hợp thanh toán trực tuyến. |

-----

## 🔄 Luồng nghiệp vụ chính (Key Business Flows)

Hệ thống xử lý các nghiệp vụ phức tạp bằng cơ chế sự kiện bất đồng bộ:

### 1\. Luồng Kiểm tra Tồn kho (Inventory Check)

  * **Mục tiêu:** Đảm bảo tính toàn vẹn dữ liệu tồn kho.
  * **Luồng:**
    1.  User nhấn "Đặt hàng".
    2.  `Order Service` gọi `Product Service` để kiểm tra tồn kho.
    3.  Nếu **Còn hàng**: `Product Service` cập nhật số lượng (giữ hàng) -\> `Order Service` tạo đơn `Pending` -\> Chuyển sang thanh toán.
    4.  Nếu **Hết hàng**: Báo lỗi ngay lập tức cho người dùng.

### 2\. Luồng Phục hồi Tồn kho (Compensation / Rollback)

  * **Mục tiêu:** Đảm bảo tính nhất quán cuối cùng (Eventual Consistency) khi giao dịch thất bại.
  * **Luồng:**
    1.  User thanh toán VNPay **thất bại** (do hủy, hết tiền...).
    2.  `Payment Service` xử lý callback và publish sự kiện `PaymentProcessed` (Failed) lên Kafka.
    3.  `Product Service` lắng nghe sự kiện này -\> Tự động **hoàn trả lại số lượng tồn kho** (Release Stock).
    4.  `Order Service` lắng nghe sự kiện -\> Cập nhật trạng thái đơn hàng thành `Cancelled`.

### 3\. Luồng Theo dõi Drone (Real-time Tracking)

  * **Mục tiêu:** Cung cấp dữ liệu vị trí Drone thời gian thực mà không cần dùng GPS trực tiếp từ Drone (giả lập qua Event).
  * **Luồng:**
    1.  Delivery Service cập nhật trạng thái/vị trí (VD: Đang giao, Đã đến).
    2.  `Delivery Service` publish sự kiện `DeliveryUpdated` lên Kafka.
    3.  `Notification Service` lắng nghe sự kiện này.
    4.  `Notification Service` đẩy dữ liệu xuống Client App qua **WebSocket/SignalR**.
    5.  Giao diện người dùng tự động cập nhật vị trí Drone 🚁 trên bản đồ.

-----

## ⚙️ Tính năng chính (Theo từng Service)

#### 👤 User Service

  * Tạo tài khoản và đăng nhập bằng email/mật khẩu.
  * Quản lý thông tin hồ sơ và địa chỉ giao hàng.
  * Tạo và xác thực token **JWT** cho các phiên làm việc an toàn.

#### 🍱 Product Service (Quản lý Thực đơn)

  * Cung cấp API lấy danh sách món ăn (Cơm Tấm, Phở...).
  * Admin quản lý sản phẩm (CRUD: thêm, sửa, xóa, cập nhật ảnh).
  * Quản lý số lượng tồn kho và cập nhật khi có đơn hàng.

#### 📝 Order Service (Quản lý Đơn hàng)

  * Xử lý logic giỏ hàng (thêm, xóa, cập nhật).
  * Tạo đơn hàng mới với trạng thái "Pending".
  * Xem lịch sử và trạng thái đơn hàng.
  * Cập nhật trạng thái dựa trên sự kiện từ Payment và Delivery Service.

#### 💳 Payment Service

  * Tích hợp cổng thanh toán **VNPay**.
  * Xử lý callback/webhook để xác nhận giao dịch thành công/thất bại.
  * Publish sự kiện `PaymentProcessed` lên Kafka.

#### 🚁 Delivery Service (Điều phối Giao vận)

  * Tiếp nhận đơn hàng đã thanh toán thành công.
  * Quản lý trạng thái giao hàng (`Finding Driver`, `Delivering`, `Delivered`).
  * Cung cấp dữ liệu tracking real-time cho người dùng.

#### 🔔 Notification Service

  * Lắng nghe sự kiện thay đổi trạng thái đơn hàng từ Kafka.
  * Gửi Push Notification hoặc cập nhật qua WebSocket tới Client.

#### 🛠️ Admin Portal (Trang Quản trị)

  * **Dashboard:** Thống kê doanh thu, tổng đơn hàng, số Drone hoạt động.
  * **Heatmap:** Bản đồ nhiệt hiển thị vị trí Drone thực tế.
  * **Quản lý sự cố:** Cảnh báo lỗi thanh toán hoặc Drone gặp trục trặc.

-----

## 📊 Yêu cầu phi chức năng (Non-Functional Requirements)

  * **Bảo mật:** API xác thực bằng JWT, giao tiếp qua HTTPS.
  * **Hiệu năng:** Thời gian phản hồi API chính ≤ 500ms.
  * **Tính sẵn sàng:** Hệ thống chịu lỗi tốt, Uptime cao, database có cơ chế backup.
  * **Khả năng mở rộng:** Các service scale độc lập bằng Kubernetes.
  * **Giám sát:** Theo dõi real-time qua Prometheus/Grafana, dashboard riêng cho từng service.
  * **Triển khai:** Tự động hóa hoàn toàn qua CI/CD pipeline.

-----

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu

  - Java Development Kit (JDK)
  - Docker và Docker Compose
  - Git
  - Maven hoặc Gradle

### Các bước cài đặt

1.  **Clone repository:**

    ```bash
    git clone [https://github.com/PhucHungNhanba/CNPM_SGU.git](https://github.com/PhucHungNhanba/CNPM_SGU.git)
    cd CNPM_SGU
    ```

2.  **Cấu hình biến môi trường:**
    Trong thư mục của mỗi microservice, sao chép file `application.yml.example` thành `application.yml` và điền các thông tin cần thiết (Database URL, Kafka Broker, JWT Secret...).

3.  **Chạy bằng Docker Compose (Khuyến khích):**
    *Khởi chạy hạ tầng (Kafka, Zookeeper, PostgreSQL, Grafana...)*

    ```bash
    docker-compose up -d
    ```

4.  **Chạy các Microservices (Local):**
    Mở Terminal cho từng service và chạy:

    ```bash
    ./mvnw spring-boot:run
    ```

5.  **Dừng hệ thống:**

    ```bash
    docker-compose down
    ```

-----
