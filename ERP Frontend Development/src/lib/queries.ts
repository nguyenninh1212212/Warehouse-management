import { api } from './api';
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  Product,
  CreateProductDto,
  UpdateStockDto,
  CreateOrderDto,
  Order,
  RevenueData,
  TopProduct,
  AIStrategy,
  OrderStats,
  User,
} from './types';

// Mock data for development
const mockRevenueData: RevenueData[] = [
  { month: 'January', revenue: 45000 },
  { month: 'February', revenue: 52000 },
  { month: 'March', revenue: 48000 },
  { month: 'April', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'June', revenue: 67000 },
];

const mockTopProducts: TopProduct[] = [
  { id: '1', name: 'Laptop Pro 15"', sales: 245, revenue: 294000, popularity: 92 },
  { id: '2', name: 'Wireless Mouse', sales: 523, revenue: 26150, popularity: 85 },
  { id: '3', name: 'USB-C Hub', sales: 412, revenue: 20600, popularity: 78 },
  { id: '4', name: 'Mechanical Keyboard', sales: 189, revenue: 26460, popularity: 71 },
  { id: '5', name: 'Monitor 27"', sales: 156, revenue: 62400, popularity: 65 },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro 15"',
    sku: 'LP-15-001',
    category: 'Electronics',
    price: 1200,
    stock: 45,
    lowStockThreshold: 10,
    description: 'High-performance laptop',
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'WM-002',
    category: 'Accessories',
    price: 50,
    stock: 150,
    lowStockThreshold: 20,
    description: 'Ergonomic wireless mouse',
  },
  {
    id: '3',
    name: 'USB-C Hub',
    sku: 'UH-003',
    category: 'Accessories',
    price: 50,
    stock: 8,
    lowStockThreshold: 15,
    description: '7-in-1 USB-C Hub',
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    sku: 'MK-004',
    category: 'Accessories',
    price: 140,
    stock: 62,
    lowStockThreshold: 10,
    description: 'RGB mechanical keyboard',
  },
  {
    id: '5',
    name: 'Monitor 27"',
    sku: 'MN-27-005',
    category: 'Electronics',
    price: 400,
    stock: 5,
    lowStockThreshold: 8,
    description: '4K UHD monitor',
  },
];

const mockAIStrategy: AIStrategy = {
  insights: [
    'Electronics category showing 23% growth this quarter',
    'Peak order times: 10 AM - 2 PM weekdays',
    'Customer retention rate increased to 78%',
  ],
  recommendations: [
    'Increase inventory for Wireless Mouse by 30%',
    'Launch bundle promotion: Laptop + Accessories',
    'Focus marketing on Electronics category',
  ],
  restockAlerts: [
    {
      productId: '3',
      productName: 'USB-C Hub',
      currentStock: 8,
      recommendedOrder: 50,
      priority: 'high',
    },
    {
      productId: '5',
      productName: 'Monitor 27"',
      currentStock: 5,
      recommendedOrder: 30,
      priority: 'high',
    },
  ],
};

// Auth API
export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            email: data.email,
            name: 'John Doe',
            about: 'ERP System Administrator',
            interests: ['Technology', 'Management'],
          },
        });
      }, 500);
    });
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            email: data.email,
            name: data.name,
          },
        });
      }, 500);
    });
  },
};

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProducts), 300);
    });
  },

  getLowStock: async (): Promise<Product[]> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowStock = mockProducts.filter(p => p.stock < p.lowStockThreshold);
        resolve(lowStock);
      }, 300);
    });
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          id: String(Date.now()),
          ...data,
        };
        resolve(newProduct);
      }, 500);
    });
  },

  delete: async (id: string): Promise<void> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  updateStock: async (id: string, data: UpdateStockDto): Promise<Product> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === id);
        if (product) {
          resolve({ ...product, stock: product.stock + data.quantity });
        }
      }, 300);
    });
  },
};

// Orders API
export const ordersApi = {
  create: async (data: CreateOrderDto): Promise<Order> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        resolve({
          id: String(Date.now()),
          items: data.items,
          total,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
  },

  getStats: async (): Promise<OrderStats> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalRevenue: 487610,
          totalOrders: 1525,
          averageOrderValue: 319.75,
        });
      }, 300);
    });
  },
};

// Analytics API
export const analyticsApi = {
  getRevenue: async (): Promise<RevenueData[]> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRevenueData), 300);
    });
  },

  getTopProducts: async (): Promise<TopProduct[]> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTopProducts), 300);
    });
  },

  getAIStrategy: async (): Promise<AIStrategy> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAIStrategy), 300);
    });
  },
};

// User API
export const userApi = {
  updateProfile: async (data: Partial<User>): Promise<User> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
          ...data,
        });
      }, 500);
    });
  },
};
