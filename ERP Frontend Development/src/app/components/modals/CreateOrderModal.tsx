import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  DollarSign,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Skeleton } from "../ui/Skeleton";
import { productsApi, ordersApi } from "../../../lib/queries";
import { Pagination } from "../common/Pagination";
import { Buyer, OrderItemDto } from "../../../lib/types";
import { formatCurrency } from "../../../lib/utils";
import {
  useCreateOrder,
  useGetBuyers,
  useOrders,
  useProducts,
} from "../../hooks/useApi";
import { Card, CardContent } from "../ui/Card";

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
}

interface OrderItem extends OrderItemDto {
  productName: string;
}

export function CreateOrderModal({ open, onClose }: CreateOrderModalProps) {
  const queryClient = useQueryClient();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState("");
  const [pageP, setpageP] = useState(1);
  const [pageB, setpageB] = useState(1);
  const limit = 10;
  const { data: products, isLoading } = useProducts({
    page: pageP,
    limit,
  });
  const { data: buyers, isLoading: buyerLoad } = useGetBuyers({
    page: pageB,
    limit,
  });

  const createOrderMutation = useCreateOrder();
  const [buyerId, setBuyerId] = useState<string>("");
  const handleAddProduct = (productId: string) => {
    const product = products?.data.find((p) => p._id === productId);
    if (!product) return;

    const existingItem = orderItems.find(
      (item) => item.productId === productId,
    );
    if (existingItem) {
      setOrderItems((items) =>
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setOrderItems((items) => [
        ...items,
        {
          productId: product._id,
          productName: product.name,
          quantity: 1,
          price: product.price,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    setOrderItems((items) =>
      items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setOrderItems((items) =>
      items.filter((item) => item.productId !== productId),
    );
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }
    if (!buyerId) {
      toast.error("Please select a buyer");
      return;
    }

    createOrderMutation.mutate({
      items: orderItems.map(({ productId, quantity, price }) => ({
        productId,
        quantity,
        price,
      })),
      buyerId: buyerId,
    });
  };

  const handleClose = () => {
    setOrderItems([]);
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Tạo đơn</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div className="space-y-3">
            <Label>Chọn hàng</Label>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                {products?.data.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm">{product.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(product.price)} • {product.stock} còn
                        hàng
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddProduct(product._id)}
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Pagination
              page={pageP}
              totalPages={products?.totalPages || 1}
              onPageChange={(a) => setpageP(a)}
            />
          </div>
          {/* Select buyer */}
          <div className="space-y-3">
            <Label className="flex justify-between items-center">
              <span>Chọn người mua</span>
              {buyerId && (
                <span className="text-xs text-blue-600 font-medium">
                  Selected: {buyers?.data.find((b) => b._id === buyerId)?.name}
                </span>
              )}
            </Label>

            {buyerLoad ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg p-4 max-h-72 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {buyers?.data.map((buyer) => {
                    const isSelected = buyerId === buyer._id;
                    return (
                      <div
                        key={buyer._id}
                        onClick={() => setBuyerId(buyer._id)}
                        className="cursor-pointer group"
                      >
                        <Card
                          className={`rounded-xl transition-all duration-200 ${
                            isSelected
                              ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/30"
                              : "hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <CardContent className="p-4 space-y-2">
                            {/* Name */}
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-1.5 rounded-md ${isSelected ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600"}`}
                              >
                                <User className="h-4 w-4" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate">
                                  {buyer.name}
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                                  Khách hàng
                                </p>
                              </div>
                            </div>

                            {/* Contact Info (Compact) */}
                            <div className="grid grid-cols-1 gap-1 pl-1">
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{buyer.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span>{buyer.phone || "N/A"}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <Pagination
            page={pageB}
            totalPages={buyers?.totalPages || 1}
            onPageChange={(a) => setpageP(a)}
          />
          {/* Order Items */}
          {orderItems.length > 0 && (
            <div className="space-y-3">
              <Label>Đơn mua</Label>
              <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm">{item.productName}</p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(item.price)} chiếc
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-24 text-right text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveProduct(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tổng tiền</span>
                    <span className="text-lg">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={
                createOrderMutation.isPending || orderItems.length === 0
              }
            >
              {createOrderMutation.isPending ? "Đang tạo..." : "Tạo đơn"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
