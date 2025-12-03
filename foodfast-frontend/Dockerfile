# Giai đoạn 1: Build ứng dụng React
FROM node:18-alpine AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy file package.json và cài đặt thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Chạy lệnh build để tạo ra thư mục 'dist'
RUN npm run build

# Giai đoạn 2: Serve ứng dụng bằng Nginx
FROM nginx:alpine

# Copy thư mục 'dist' đã build ở Giai đoạn 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx (quan trọng cho React Router)
# Chúng ta sẽ tạo file này ở bước 2
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80 (cổng mặc định của Nginx)
EXPOSE 80