# 1. Chọn một image Node.js gốc (phiên bản Alpine rất nhẹ)
FROM node:18-alpine

# 2. Tạo một thư mục bên trong container để chứa code
WORKDIR /app

# 3. Sao chép package.json và package-lock.json (hoặc pnpm-lock.yaml, v.v.)
COPY package*.json ./

# 4. Cài đặt các thư viện
# Nếu dùng npm:
RUN npm install
# Nếu dùng pnpm:
# RUN npm install -g pnpm
# RUN pnpm install

# 5. Sao chép toàn bộ code của service này vào container
COPY . .

# 6. Mở cổng mà service này đang chạy
# !!! QUAN TRỌNG: Sửa lại cho từng service !!!
# (ví dụ: 3000 cho api-gateway, 3001 cho user-service, v.v.)
EXPOSE 3004

# 7. Lệnh để khởi động service (giả sử server.js dùng ES Modules)
CMD [ "node", "server.js" ]