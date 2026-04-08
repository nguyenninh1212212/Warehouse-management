import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Plus, CheckCircle2, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { CreateOrderModal } from "../modals/CreateOrderModal";
import { formatCurrency } from "../../../lib/utils";
import { useOrders, useStatsToday } from "../../hooks/useApi";
import { Order } from "../../../lib/types";
import { UpdateOrderModal } from "../modals/UpdateOrderModal";
import { Pagination } from "../common/Pagination";

export function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data, isLoading: loadOrder, error } = useOrders({ page, limit: 10 });
  const { data: orderStats, isLoading } = useStatsToday();
  const revuene = orderStats?.revenue;
  const orders = orderStats?.orders;
  const avgOrder = revuene / orders;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl tracking-tight">Quản lý đơn hàng</h2>
          <p className="text-slate-500 mt-1">
            Quản lý đơn đặt hàng và doanh số bán hàng của khách hàng
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo đơn hàng
        </Button>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Tổng doanh thu</p>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl tracking-tight mt-2">
                  {formatCurrency(revuene || 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">{orderStats.date}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Tổng số đơn hàng</p>
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl tracking-tight mt-2">{orders || 0}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Giao dịch hoàn tất
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Giá trị đơn hàng trung bình
                  </p>
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-2xl tracking-tight mt-2">
                  {formatCurrency(avgOrder || 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Giao dịch</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Creation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn mua hàng hóa ({data?.total}) </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <>
              {loadOrder ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                data?.data.map((order: Order) => (
                  <div
                    className="border rounded-lg p-4 mb-4 shadow-md"
                    id={order?._id}
                  >
                    {/* Thông tin user */}
                    <div className="mb-2">
                      <strong>Người tạo:</strong> {order.userId.name} (
                      {order.userId.email})
                    </div>
                    <div className="mb-2">
                      {order.buyerId && (
                        <>
                          <strong>Khách mua hàng:</strong> {order.buyerId.name}{" "}
                          ({order.buyerId.email})
                        </>
                      )}
                    </div>

                    {/* Danh sách items */}
                    <div className="mb-2">
                      <strong>Mặt hàng:</strong>
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="border rounded p-2 mt-1 flex justify-between"
                        >
                          <span>{item.name}</span>
                          <span>
                            {item.quantity} x ${item.price}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tổng tiền và trạng thái */}
                    <div className="mt-2 flex justify-between items-center">
                      <span>
                        <strong>Tổng cộng:</strong> ${order.totalAmount}
                      </span>
                      <span className="flex items-center space-x-2">
                        <strong>Trạng thái:</strong>
                        <Button onClick={() => setSelectedOrder(order)}>
                          {order.status}
                        </Button>
                        {selectedOrder?._id === order._id && (
                          <UpdateOrderModal
                            orderId={selectedOrder._id}
                            currentStatus={selectedOrder.status}
                            onClose={() => setSelectedOrder(null)}
                          />
                        )}
                      </span>
                    </div>

                    {/* Thời gian */}
                    <div className="text-sm text-gray-500 mt-1">
                      Thời gian tạo:{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </>
          </div>
        </CardContent>
      </Card>

      <Pagination
        page={page}
        totalPages={orders?.totalPages || 1}
        onPageChange={(newA) => setPage(newA)}
      />

      <CreateOrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
