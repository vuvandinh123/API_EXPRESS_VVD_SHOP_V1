[![Watch the video](https://img.youtube.com/vi/Un4umy_b1gU/0.jpg)](https://www.youtube.com/embed/Un4umy_b1gU?si=yqwH5-JMSQq-6aUp)

# ⚙️ API Backend – Website Thương mại điện tử

## 1. 📖 Giới thiệu tổng quan

Đây là hệ thống **API backend** được xây dựng bằng **Node.js + Express** phục vụ cho một **website thương mại điện tử** đa người dùng, đa vai trò. Ứng dụng hỗ trợ phân quyền, xác thực token JWT, xử lý hình ảnh (Cloudinary), tương tác với cơ sở dữ liệu quan hệ (MySQL) và phi quan hệ (MongoDB - cho một số module như chat hoặc thông báo).

Hệ thống hướng tới khả năng mở rộng, bảo mật, dễ kiểm thử và dễ bảo trì, phù hợp với môi trường sản phẩm thực tế.

---

## 2. 🧰 Công nghệ sử dụng

| Công nghệ                        | Mục đích                                   |
| -------------------------------- | ------------------------------------------ |
| **Node.js + Express**            | Xây dựng server RESTful API                |
| **JWT (jsonwebtoken)**           | Xác thực và phân quyền                     |
| **Knex + MySQL2**                | ORM và kết nối cơ sở dữ liệu quan hệ       |
| **Cloudinary + Multer**          | Upload và xử lý ảnh                        |
| **Firebase Admin SDK**           | Chat realtime giữa shop và khách hàng      |
| **Nodemailer**                   | Gửi email xác thực, quên mật khẩu          |
| **Helmet, Compression, CORS**    | Bảo mật và tối ưu hóa HTTP                 |
| **Jest, Mocha, Chai, Supertest** | Viết và chạy test cho API                  |
| **dotenv, slugify, lodash**      | Tiện ích, xử lý logic phụ                  |

---

## 3. 🗂️ Cấu trúc thư mục chính

```plaintext
src/
├── auth/               # Xác thực và phân quyền người dùng
├── configs/            # Cấu hình (env, db, cloudinary, firebase, ...)
├── controllers/        # Logic xử lý request của từng chức năng
├── core/error/         # Xử lý lỗi toàn cục (custom error handler)
├── data/               # Dữ liệu mẫu hoặc file tĩnh
├── database/           # Kết nối và seed database (MySQL & MongoDB)
├── middlewares/        # Middleware xử lý token, role, upload,...
├── models/             # Định nghĩa schema (MongoDB) và bảng (Knex)
│   └── repositories/   # Các truy vấn DB chuyên biệt
├── routes/             # Cấu trúc route chia theo vai trò
│   ├── admin/          # Quản trị viên
│   ├── common/         # API dùng chung
│   ├── shop/           # Shop bán hàng
│   └── site/           # Người dùng frontend
├── service/            # Service xử lý logic trung gian
├── test/               # Các test case (Jest, Supertest)
├── utils/              # Hàm tiện ích dùng lại nhiều lần
└── validations/        # Xác thực dữ liệu request (express-validator)
```

---

## 4. 🔐 Phân quyền hệ thống

* **Admin:** truy cập toàn bộ hệ thống, quản lý người dùng, shop, sản phẩm, đơn hàng, thống kê,...
* **Shop (người bán):** truy cập dashboard riêng, đăng sản phẩm, xem đơn hàng, báo cáo doanh thu,...
* **User (khách hàng):** đăng ký, mua hàng, xem đơn, cập nhật tài khoản, tương tác sản phẩm,...

---

## 5. 🧩 Các chức năng chính

### 👩‍💼 Quản trị viên (Admin)

* Quản lý người dùng, phân quyền
* Duyệt và quản lý shop
* Quản lý danh mục, thương hiệu, sản phẩm
* Quản lý slider/banner hiển thị
* Quản lý đơn hàng toàn hệ thống
* Quản lý nhập hàng, kho hàng
* Thống kê doanh thu theo ngày/tháng

### 🛍️ Shop (Người bán)

* Đăng ký shop và xác thực
* Tạo/sửa/xoá sản phẩm
* Xem đơn hàng và cập nhật trạng thái
* Xem báo cáo bán hàng
* Quản lý kho sản phẩm và tồn kho

### 👤 Người dùng

* Đăng ký, đăng nhập (bằng mật khẩu hoặc Google/Facebook)
* Gửi email xác thực, quên mật khẩu
* Tạo đơn hàng, theo dõi trạng thái
* Quản lý địa chỉ, tài khoản cá nhân
* Tính năng sản phẩm yêu thích
* Lịch sử đơn hàng và đánh giá

---

## 6. 🛠️ Hướng dẫn chạy dự án

### ✅ Cài đặt

```bash
npm install
```

### 🚀 Khởi chạy server

```bash
npm start
```

### 🧪 Chạy test

```bash
npm test
```

> ⚠️ **Lưu ý:**
>
> * Cần cấu hình `.env` với các biến môi trường như: `JWT_SECRET`, `DB_URL`, `CLOUDINARY_API_KEY`,...
> * Hệ thống hỗ trợ cả MongoDB và MySQL – có thể mở rộng sang PostgreSQL nếu cần.

---

## 7. 📬 Thông tin liên hệ

Mọi thắc mắc, góp ý hoặc yêu cầu hỗ trợ kỹ thuật về dự án xin vui lòng liên hệ:

* 👤 **Tên:** Vũ Văn Định
* 📧 **Email:** [vuvandinh.work@gmail.com](mailto:vuvandinh.work@gmail.com)
* 📱 **Số điện thoại (Zalo):** 0333583800 
* 🌐 **GitHub:** [https://github.com/vuvandinh123](https://github.com/vuvandinh123)
* 💼 **Website:** [https://vuvandinh.id.vn](https://vuvandinh.id.vn)

