# 1. Chọn ảnh (image) Node.js làm nền
# Dùng "alpine" để giữ cho image có dung lượng nhẹ nhất
FROM node:18-alpine

# 2. Tạo thư mục làm việc bên trong container
WORKDIR /app

# 3. Sao chép file package.json và package-lock.json
# Dấu * để copy cả hai file
COPY package*.json ./

# 4. Cài đặt các thư viện (dependencies)
# Tách bước này để tận dụng cache của Docker
RUN npm install

# 5. Sao chép toàn bộ mã nguồn còn lại vào /app
COPY . .

# 6. Mở cổng (port) mà service sẽ chạy bên trong container
EXPOSE 3006

# 7. Lệnh (command) để khởi chạy ứng dụng khi container bắt đầu
CMD ["node", "server.js"]