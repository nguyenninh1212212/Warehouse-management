import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
  LogOut,
  UserCog,
  UserSquare,
} from "lucide-react";
import { cn } from "../ui/utils";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Hàng tồn kho", icon: Package },
    { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
    { id: "buyers", label: "Người mua", icon: User },
    { id: "staff", label: "Quản lý nhân sự", icon: UserSquare },
    { id: "profile", label: "Thông tin tài khoản", icon: UserCog },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl tracking-tight text-center">V-Integ ERP</h1>
        <p className="text-sm text-slate-400 mt-1 text-center">
          Lập kế hoạch kho hàng doanh nghiệp
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
