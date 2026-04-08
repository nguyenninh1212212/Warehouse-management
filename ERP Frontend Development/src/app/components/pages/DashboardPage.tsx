import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

import { TrendingUp, Package, AlertTriangle, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

import { formatCurrency } from "../../../lib/utils";
import {
  useAiStrategy,
  useRevenueReport,
  useStats,
  useTopProducts,
} from "../../hooks/useApi";
import { TopProduct } from "../../../lib/types";

export function DashboardPage() {
  const { data: revenueData, isLoading: revenueLoading } = useRevenueReport();

  const { data: topProducts, isLoading: productsLoading } = useTopProducts();
  const {
    data: aiStrategy,
    isLoading: aiLoading,
    error: aiError,
  } = useAiStrategy();

  const { data: orderStats, isLoading: statsLoading } = useStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl tracking-tight">Dashboard</h2>
        <p className="text-slate-500 mt-1">
          Tổng quan về hiệu quả hoạt động kinh doanh của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Tổng doanh thu </p>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl tracking-tight mt-2">
                  {formatCurrency(orderStats?.totalRevenue || 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {orderStats?.totalOrders || 0} tổng số đơn hàng
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Giá trị đơn hàng trung bình
                  </p>
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl tracking-tight mt-2">
                  {formatCurrency(
                    orderStats?.totalRevenue / orderStats?.totalOrders || 0,
                  )}
                </p>
                <p className="text-xs text-slate-500 mt-1">Mỗi giao dịch</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {aiLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Thông báo khi hàng được bổ sung
                  </p>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-2xl tracking-tight mt-2">
                  {aiStrategy?.restockAlerts.length || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Sản phẩm cần được chú ý
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu hàng tháng</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={revenueData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                <XAxis dataKey="month" stroke="#64748b" />

                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />

                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />

                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "Revenue")
                      return [formatCurrency(value), "Revenue"];
                    return [value, "Orders"];
                  }}
                />

                {/* Revenue */}
                <Bar
                  yAxisId="left"
                  dataKey="totalRevenue"
                  fill="#0f172a"
                  name="Revenue"
                  radius={[6, 6, 0, 0]}
                />

                {/* Order Count */}
                <Bar
                  yAxisId="right"
                  dataKey="orderCount"
                  fill="#94a3b8"
                  name="Orders"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm hàng đầu</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts?.map((product: TopProduct) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{product.name}</p>
                        <p className="text-xs text-slate-500">
                          {product.sales} Bán •{" "}
                          {formatCurrency(product.revenue)}
                        </p>
                      </div>
                      <span className="text-sm">{product.totalSold} chiếc</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-slate-900 h-2 rounded-full transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Intelligence */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <CardTitle>Trí tuệ nhân tạo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {aiLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : aiError ? (
              <div>
                <p>AI đang bận </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Insights */}
                <div>
                  <h4 className="text-sm mb-3">Những nội dung hính</h4>
                  <div className="space-y-2">
                    {aiStrategy?.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-2 text-sm text-slate-600"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-sm mb-3">Khuyến nghị</h4>
                  <div className="space-y-2">
                    {aiStrategy?.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-2 text-sm text-slate-600"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restock Alerts */}
                {aiStrategy?.restockAlerts &&
                  aiStrategy.restockAlerts.length > 0 && (
                    <div>
                      <h4 className="text-sm mb-3 flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span>Thông báo tự động bổ sung hàng</span>
                      </h4>
                      <div className="space-y-2">
                        {aiStrategy.restockAlerts.map((alert) => (
                          <div
                            key={alert.productId}
                            className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                          >
                            <p className="text-sm">{alert.productName}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              Hiện hành: {alert.currentStock} • Sắp xếp lại:{" "}
                              {alert.recommendedOrder} đơn vị
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
