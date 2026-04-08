import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Me, UpdateMe } from "../../../lib/types";
import { cn } from "../../../lib/utils";
import { useGetUser } from "../../hooks/useApi";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Edit, Trash2, PackageX, Plus } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";
import { UserModal } from "../modals/UserModal";
import { Pagination } from "../common/Pagination";

export function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Me | null>(null);
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useGetUser({ page, limit: 10, search: searchQuery });

  const handleEdit = (user: Me) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const filteredUsers = users?.data;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-2xl">Quản lý nhân sự</h2>

        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm
        </Button>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search user..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isLoading ? (
        <Skeleton className="w-full h1/2"></Skeleton>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Nhân sự ({filteredUsers?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers && filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Họ và tên</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Username</th>
                        <th className="text-right py-3 px-4">Ngày tạo</th>
                        <th className="text-right py-3 px-4">Cập nhật</th>
                        <th className="text-right py-3 px-4">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user: Me) => (
                        <tr key={user._id} className="border-b">
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.username}</td>
                          <td className="py-3 px-4 text-right">
                            {new Date(user.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {new Date(user.updatedAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(user)}
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
                  No users found
                </div>
              )}
            </CardContent>
          </Card>

          <Pagination
            page={page}
            totalPages={users?.totalPages || 1}
            onPageChange={(newA) => setPage(newA)}
          />

          {/* MODAL */}
          <UserModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={editingUser}
          />
        </>
      )}
    </div>
  );
}
