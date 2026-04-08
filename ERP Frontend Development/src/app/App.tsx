import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Sidebar } from "./components/layout/Sidebar";
import { DashboardPage } from "./components/pages/DashboardPage";
import { InventoryPage } from "./components/pages/InventoryPage";
import { OrdersPage } from "./components/pages/OrdersPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { LoginPage } from "./components/pages/LoginPage";
import { UserPage } from "./components/pages/UserPage";
import { BuyerPage } from "./components/pages/BuyerPage";
import { useLogout } from "./hooks/useApi";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const logout = useLogout();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    cookieStore.delete("token");
    setIsAuthenticated(false);
    setCurrentPage("dashboard");
    logout.mutate();
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "buyers":
        return <BuyerPage />;
      case "inventory":
        return <InventoryPage />;
      case "staff":
        return <UserPage />;
      case "orders":
        return <OrdersPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">{renderPage()}</div>
      </main>
    </div>
  );
}

// 2. Phần "Vỏ" - Chỉ làm nhiệm vụ bao bọc Provider
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
