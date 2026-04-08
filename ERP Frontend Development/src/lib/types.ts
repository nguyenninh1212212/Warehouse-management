// Auth Types

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  about?: string;
  birthday?: string;
  height?: number;
  weight?: number;
  interests?: string[];
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
}

export interface category {
  _id: string;
  name: string;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
}

export interface UpdateStockDto {
  quantity: number;
  operation: "add" | "subtract" | "set";
}
export interface UpdateProductDto {
  quantity: number;
}

// Order Types
export interface OrderItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  customerId?: string;
  notes?: string;
}

// Analytics Types
export interface RevenueData {
  month: string;
  revenue: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  totalSold: number;
}

export interface AIStrategy {
  insights: string[];
  recommendations: string[];
  restockAlerts: RestockAlert[];
}

export interface RestockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  recommendedOrder: number;
  priority: "high" | "medium" | "low";
}

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface Category {
  name: string;
}

export enum OrderStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}

export interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  buyerId: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    _id: string;
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DashboardReport {
  reportDate: string;
  dataSummary: DataSummary;
  aiStrategy: string;
}

export interface DataSummary {
  revenue: RevenueItem[];
  topProducts: TopProduct[];
}

export interface RevenueItem {
  _id: number; // tháng (1–12)
  totalRevenue: number;
  orderCount: number;
  month: string; // "March", "April"
}

export interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface Me extends UpdateMe {
  _id: string;
  email: string;
  role: string;
  createdAt: string; // hoặc Date nếu bạn parse
  updatedAt: string;
}

export interface UpdateMe {
  name: string;
  username: string;
}

export interface CreateBuyerDto {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateBuyerDto {
  name?: string;
  email?: string;
  phone?: string;
}

export interface Buyer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdBy: {
    name: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface PaginatorQuery {
  page: number;
  limit: number;
  search?: string;
}
