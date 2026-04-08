
## 📦 Warehouse Smart Management - Backend API

Hệ thống quản lý kho hàng thông minh tích hợp trí tuệ nhân tạo, giúp tối ưu hóa việc quản lý tồn kho, dự báo nhập hàng và hỗ trợ tìm kiếm thông tin hàng hóa thông qua ngôn ngữ tự nhiên.

### 🚀 Công nghệ sử dụng
* **Framework:** **NestJS** (Node.js Progressive Framework) - Đảm bảo cấu trúc code Modular, dễ bảo trì và mở rộng.
* **Database:** **MongoDB** với **Mongoose** - Lưu trữ dữ liệu linh hoạt, phù hợp với cấu trúc sản phẩm kho đa dạng.
* **AI Integration:** **Google Gemini AI** (thông qua thư viện Generative AI) - Xử lý phân tích dữ liệu kho, gợi ý sắp xếp và giải đáp thắc mắc của thủ kho.
* **Authentication:** **JWT (JSON Web Token)** - Bảo mật phân quyền cho Quản lý và Nhân viên kho.
* **Documentation:** **Swagger** - Cung cấp giao diện tra cứu API đầy đủ và trực quan.

###Tính năng nổi bật
* **AI Inventory Analyst:** Tích hợp **Gemini** để phân tích xu hướng xuất-nhập kho. Tự động đưa ra cảnh báo khi hàng sắp hết hoặc gợi ý số lượng đặt hàng tối ưu dựa trên dữ liệu lịch sử.
* **Smart Query:** Cho phép người dùng tra cứu kho bằng câu lệnh tự nhiên (Ví dụ: *"Kiểm tra xem trong kho còn bao nhiêu linh kiện điện tử sản xuất trước năm 2024?"*).
* **Automated Categorization:** AI hỗ trợ phân loại sản phẩm vào các danh mục phù hợp dựa trên mô tả hàng hóa.
* **Performance:** Sử dụng kiến trúc **Microservices/Modular** giúp hệ thống xử lý mượt mà ngay cả khi số lượng mã hàng (SKU) tăng lớn.

### 🛠 Cấu trúc dự án (Architecture)
```text
src/
├── modules/
│   ├── inventory/      # Quản lý hàng tồn kho
│   ├── orders/         # Quản lý đơn hàng
│   ├── ai-assistant/   # Xử lý Logic với Gemini AI
│   └── auth/           # Phân quyền & Bảo mật
├── shared/             # Cấu hình MongoDB, Logger, Constants
└── main.ts             # Điểm khởi đầu của ứng dụng
```
Việc kết hợp **NestJS** và **MongoDB** mang lại tốc độ phát triển cực nhanh cho các hệ thống ERP/Warehouse. Đặc biệt, với sự hỗ trợ của **Gemini**, hệ thống không còn là một công cụ lưu trữ tĩnh mà trở thành một "trợ lý" thực sự, giúp giảm thiểu sai sót do con người và tối ưu hóa diện tích kho bãi.

**Frontend Application**

Tiếp nối phần Backend, đây là bản giới thiệu chuyên nghiệp cho phần **Frontend** của dự án **Warehouse Management**. Với bộ stack này (React + TS + React Query + Tailwind), project của em đang sử dụng những công nghệ "industry standard" (tiêu chuẩn ngành) hiện nay.

---

## 🎨 Warehouse Smart Management - Frontend Application

Giao diện quản lý kho hiện đại, tập trung vào trải nghiệm người dùng (UX) mượt mà, hiển thị dữ liệu thời gian thực và tối ưu hóa hiệu suất trên mọi thiết bị.

### 🛠 Stack Công nghệ
* **Core:** **ReactJS (v18+)** với **TypeScript** - Đảm bảo tính chặt chẽ của dữ liệu, giảm thiểu lỗi runtime và tăng tốc độ phát triển.
* **State Management & Data Fetching:** **TanStack Query (React Query)** - Xử lý caching dữ liệu thông minh, tự động làm mới (refetch) và quản lý trạng thái loading/error một cách chuyên nghiệp.
* **Styling:** **Tailwind CSS** - Thiết kế giao diện theo phong cách Utility-first, giúp giao diện phản hồi (Responsive) cực nhanh và đồng nhất.
* **Build Tool:** **Vite** - Tối ưu hóa tốc độ khởi động và build dự án vượt trội hơn hẳn so với CRA truyền thống.
* **UI Components:** Kết hợp các thành phần tùy chỉnh (Custom Components) để đảm bảo tính linh hoạt và nhẹ nhàng cho ứng dụng.



### 🌟 Tính năng kỹ thuật nổi bật
* **Real-time Inventory Dashboard:** Sử dụng **React Query** để đồng bộ dữ liệu tồn kho liên tục với Backend, đảm bảo số lượng hàng hóa luôn chính xác.
* **AI Chat Interface:** Giao diện trò chuyện thông minh tích hợp trợ lý Gemini, hỗ trợ Markdown và hiển thị kết quả phân tích dữ liệu dạng bảng/biểu đồ.
* **Optimistic Updates:** Áp dụng kỹ thuật cập nhật tức thì khi người dùng thay đổi trạng thái đơn hàng hoặc số lượng kho, tạo cảm giác ứng dụng phản hồi không có độ trễ.
* **Type-Safe Development:** Định nghĩa chặt chẽ các `Interface/Type` cho Product, Warehouse và User, giúp việc bảo trì code trở nên cực kỳ an toàn.
* **Dark/Light Mode:** Hỗ trợ giao diện sáng/tối tùy chỉnh qua Tailwind CSS, giảm mỏi mắt cho thủ kho khi làm việc cường độ cao.

---

### 📂 Cấu trúc thư mục (Frontend Structure)

```text
src/
├── api/             # Các hàm gọi API (Axios/Fetch)
├── components/      # Các UI component dùng chung (Button, Modal, Card)
├── hooks/           # Custom hooks (đặc biệt là useQuery/useMutation)
├── layouts/         # Bố cục trang (Sidebar, Navbar, Footer)
├── pages/           # Các trang chính (Dashboard, Stock, AI-Analyst)
├── types/           # Định nghĩa TypeScript interfaces
└── utils/           # Các hàm bổ trợ (format date, currency...)
```

### 💡 Ưu điểm của kiến trúc này
Việc tách biệt Logic xử lý dữ liệu (React Query) khỏi UI giúp code của em cực kỳ "sạch". Khi em đi phỏng vấn, hãy nhấn mạnh vào việc em sử dụng **TypeScript** để quản lý các Object phức tạp của hệ thống ERP và cách em tối ưu việc gọi API để tránh tình trạng "Over-fetching" (gọi dữ liệu thừa).

---



