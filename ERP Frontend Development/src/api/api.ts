import axios from "axios";
import {
  category,
  Category,
  CreateBuyerDto,
  CreateProductDto,
  PaginatorQuery,
  UpdateBuyerDto,
  UpdateMe,
  UpdateProductDto,
} from "../lib/types";

// --- 1. AXIOS INSTANCE CONFIG ---
const api = axios.create({
  baseURL: "http://localhost:3000", // Đổi port theo backend của em
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động gắn Token vào mỗi request nếu có trong localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// --- 2. TYPES (Dựa theo OpenAPI JSON của em) ---
export interface UpdateUserDto {
  about: string;
  birthday: string;
  height: number;
  weight: number;
  interests: string[];
}

export interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    _id: string;
  }>;
  totalAmount: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED"; // có thể mở rộng enum nếu cần
  createdAt: string; // hoặc Date nếu parse từ backend
  updatedAt: string; // hoặc Date
  __v: number;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: category;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItem[];
  buyerId: string;
}

// --- 3. API CALL FUNCTIONS ---
export const apiService = {
  // Auth
  login: (data: any) => api.post("/auth/login", data).then((res) => res.data),
  logout: () => api.post("/auth/logout"),
  register: (data: any) => api.post("/users/add", data).then((res) => res.data),
  getMe: () => api.get("/auth/me").then((res) => res.data),
  getUsers: ({ page, limit, search }: PaginatorQuery) =>
    api
      .get("/users", { params: { page, limit, search } })
      .then((res) => res.data),
  updateMe: (data: UpdateMe, id: string) =>
    api.patch(`/users/profile/${id}`, data).then((res) => res.data),
  // Products
  getProducts: async ({ page, limit, search }: PaginatorQuery) => {
    const res = await api.get("/products", {
      params: {
        page,
        limit,
        search,
      },
    });
    return res.data;
  },

  getLowStock: () =>
    api.get<Product[]>("/products/low-stock").then((res) => res.data),
  createProduct: (data: CreateProductDto) =>
    api.post("/products", data).then((res) => res.data),
  updateStock: (id: string, qty: number) =>
    api.patch(`/products/${id}/stock`, { qty }).then((res) => res.data),
  updateProduct: (id: string, data: CreateProductDto) =>
    api.patch(`/products/${id}`, data).then((res) => res.data),
  updateOrder: (id: string, status: string) =>
    api.patch(`/orders/${id}/status?status=${status}`),
  deleteProduct: (id: string) =>
    api.delete(`/products/${id}`).then((res) => res.data),
  //categories
  getCategories: () =>
    api.get<category[]>("/categories").then((res) => res.data),
  createCategory: (data: Category) =>
    api.post("/categories", data).then((res) => res.data),
  updateCategory: (id: string, name: string) =>
    api.patch(`/categories/${id}`, { name }).then((res) => res.data),
  deleteCategory: (id: string) =>
    api.delete(`/categories/${id}`).then((res) => res.data),
  // Orders
  getOrders: async ({ page, limit }: PaginatorQuery) => {
    const res = await api.get("/orders", {
      params: {
        page,
        limit,
      },
    });
    return res?.data;
  },

  createOrder: (data: CreateOrderDto) =>
    api.post("/orders", data).then((res) => res.data),

  // Analytics (MIS & AI)
  getRevenue: () => api.get("/analytics/revenue").then((res) => res.data),
  getTopProducts: () =>
    api.get("/analytics/top-products").then((res) => res.data),
  getAiStrategy: () =>
    api.get("/analytics/ai-strategy").then((res) => res.data),
  getAiAutoRestock: (productId: string) =>
    api.get(`/analytics/auto-restock/${productId}`).then((res) => res.data),
  getAiDashboard: () =>
    api.get(`/analytics/ai-dashboard`).then((res) => res.data),
  getStats: () => api.get(`/analytics/stats`).then((res) => res.data),
  getStatsToday: () =>
    api.get(`/analytics/stats/today`).then((res) => res.data),
  getStatsDays: () => api.get(`/analytics/stats/days`).then((res) => res.data),

  //buyer
  getBuyerAll: async ({ page, limit, search }: PaginatorQuery) => {
    const res = await api.get("/buyer", {
      params: {
        page,
        limit,
        search,
      },
    });
    return res.data;
  },

  getBuyerById: async (id: string) => {
    const res = await api.get(`/buyer/${id}`);
    return res.data;
  },

  createBuyer: async (data: CreateBuyerDto) => {
    const res = await api.post("/buyer", data);
    return res.data;
  },

  updateBuyer: async (id: string, data: UpdateBuyerDto) => {
    const res = await api.patch(`/buyer/${id}`, data);
    return res.data;
  },

  deleteBuyer: async (id: string) => {
    const res = await api.delete(`/buyer/${id}`);
    return res.data;
  },
};
