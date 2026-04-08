import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, Product, CreateOrderDto } from "../../api/api";
import {
  AIStrategy,
  Buyer,
  category,
  Category,
  CreateProductDto,
  DashboardReport,
  Me,
  UpdateMe,
  UpdateStockDto,
} from "../../lib/types";
import { toast } from "sonner";

// --- HOOKS CHO SẢN PHẨM ---
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: apiService.getProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductDto) => apiService.createProduct(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

// --- HOOKS CHO ĐƠN HÀNG ---
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderDto) => apiService.createOrder(data),
    onSuccess: () => {
      // Sau khi tạo đơn, phải cập nhật lại danh sách đơn hàng và kho
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Create order success");
    },
    onError: () => {
      toast.error("Fail");
    },
  });
};

// --- HOOKS CHO ANALYTICS (AI) ---
export const useAiStrategy = () => {
  return useQuery<AIStrategy>({
    queryKey: ["ai-strategy"],
    queryFn: apiService.getAiStrategy,
    staleTime: 1000 * 60 * 20, // AI insight không cần cập nhật quá liên tục (5 phút)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => apiService.getStats(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useRevenueReport = () => {
  return useQuery({
    queryKey: ["revenue-report"],
    queryFn: apiService.getRevenue,
  });
};

// --- 1. AUTH HOOKS ---
export const useLogin = () => {
  // Khởi tạo hook điều hướng

  return useMutation({
    mutationFn: (data: any) => apiService.login(data),
    onSuccess: (data) => {
      // 1. Lưu token vào localStorage
      const token = data.data.token.accessToken;
      localStorage.setItem("access_token", token);

      // 2. Chuyển hướng người dùng về trang chủ hoặc dashboard
      window.location.replace("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: any) => apiService.register(data),
  });
};

export const useGetMe = () => {
  return useQuery<Me>({
    queryKey: ["auth-me"],
    queryFn: apiService.getMe,
    retry: false,
  });
};
export const useGetUser = () => {
  return useQuery<Me[]>({
    queryKey: ["users"],
    queryFn: apiService.getUsers,
    retry: false,
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: UpdateMe; id: string }) =>
      apiService.updateMe(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      toast.success("Update success");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem("access_token");
      toast.success("Đã đăng xuất thành công");
      window.location.replace("/login");
    },
    onError: () => {
      localStorage.clear();
      window.location.replace("/login");
    },
  });
};
// --- 2. DETAILED PRODUCT HOOKS ---
export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: apiService.getLowStock,
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      apiService.updateStock(id, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProductDto }) =>
      apiService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Update success");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// --- 3. ORDER HOOKS ---
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: apiService.getOrders,
  });
};

export const useStatsToday = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: apiService.getStatsToday,
  });
};
export const useStatsDays = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: apiService.getStatsDays,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      console.log("🚀 ~ useUpdateOrder ~ status:", status);
      return apiService.updateOrder(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] }); // reload danh sách orders
    },
  });
};

// --- 4. ANALYTICS & AI HOOKS (MIS) ---
export const useTopProducts = () => {
  return useQuery({
    queryKey: ["analytics", "top-products"],
    queryFn: apiService.getTopProducts,
  });
};

export const useAiAutoRestock = (productId: string) => {
  return useQuery({
    queryKey: ["analytics", "auto-restock", productId],
    queryFn: () => apiService.getAiAutoRestock(productId),
    enabled: !!productId, // Chỉ chạy khi có productId
  });
};

export const useAiDashboard = () => {
  return useQuery({
    queryKey: ["analytics", "ai-dashboard"],
    queryFn: apiService.getAiDashboard,
  });
};

//---5. Category----
export const useCategory = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: apiService.getCategories,
  });
};
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Category) => apiService.createCategory(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ _id, name }: category) =>
      apiService.updateCategory(_id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("update success");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useGetBuyers = () => {
  return useQuery<Buyer[]>({
    queryKey: ["buyers"],
    queryFn: apiService.getBuyerAll,
  });
};

export const useGetBuyer = (id: string) => {
  return useQuery<Buyer>({
    queryKey: ["buyer", id],
    queryFn: () => apiService.getBuyerById(id),
    enabled: !!id,
  });
};

export const useCreateBuyer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.createBuyer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyers"] });
    },
  });
};

export const useUpdateBuyer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiService.updateBuyer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyers"] });
    },
  });
};

export const useDeleteBuyer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.deleteBuyer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyers"] });
    },
  });
};
