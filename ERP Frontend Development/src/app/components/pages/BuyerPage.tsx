import { useEffect, useState } from "react";
import { useGetBuyers } from "../../hooks/useApi";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Edit, Plus } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";
import { Buyer } from "../../../lib/types";
import { BuyerModal } from "../modals/BuyerModal";
import { Pagination } from "../common/Pagination";
export function BuyerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [page, setPage] = useState(1);
  const {
    data: buyers,
    isLoading,
    error,
  } = useGetBuyers({ page, limit: 10, search: searchQuery });
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  const handleEdit = (buyer: Buyer) => {
    setEditingBuyer(buyer);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setEditingBuyer(null);
    setIsModalOpen(false);
  };
  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const filteredBuyers = buyers?.data;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-2xl">Quản lý người mua</h2>

        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm
        </Button>
      </div>
      {/* SEARCH */}
      <Input
        placeholder="Tìm người mua..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isLoading ? (
        <Skeleton className="w-full h-1/2"></Skeleton>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                Số người mua : ({filteredBuyers?.length || 0})
              </CardTitle>
            </CardHeader>

            <CardContent>
              {filteredBuyers && filteredBuyers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Họ và tên</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">SĐT</th>
                        <th className="text-right py-3 px-4">Ngày tạo</th>
                        <th className="text-right py-3 px-4">Tạo bởi</th>
                        <th className="text-right py-3 px-4">Số đơn</th>
                        <th className="text-right py-3 px-4">Chi tiêu</th>
                        <th className="text-right py-3 px-4">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredBuyers.map((buyer: Buyer) => (
                        <tr key={buyer._id} className="border-b">
                          <td className="py-3 px-4">{buyer.name}</td>

                          <td className="py-3 px-4">{buyer.email}</td>

                          <td className="py-3 px-4">{buyer.phone || "-"}</td>

                          <td className="py-3 px-4 text-right">
                            {new Date(buyer.createdAt).toLocaleString()}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {buyer.createdBy?.name || "-"}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {buyer.totalOrders}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {buyer.totalSpent.toLocaleString()} đ
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(buyer)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  No buyers found
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
