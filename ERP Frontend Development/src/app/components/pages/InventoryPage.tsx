import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  PackageX,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Skeleton } from "../ui/Skeleton";
import { ProductModal } from "../modals/ProductModal";
import { productsApi } from "../../../lib/queries";
import {
  category,
  Category,
  CreateProductDto,
  Product,
} from "../../../lib/types";
import { formatCurrency } from "../../../lib/utils";
import { cn } from "../../../lib/utils";
import { CategoryModal } from "../modals/CategoryModal";
import {
  useCategory,
  useDeleteProduct,
  useLowStockProducts,
  useProducts,
  useUpdateCategory,
} from "../../hooks/useApi";

export function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCOpen, setIsModalCOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CreateProductDto | null>(
    null,
  );

  const [idProduct, setIdProduct] = useState<string>("");
  const [editCate, setEditingCate] = useState<category | null>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useProducts();
  const {
    data: lowProducts,
    isLoading: lowsLoad,
    error: lowsError,
  } = useLowStockProducts();
  const {
    data: categories,
    isLoading: cateLoad,
    error: cateError,
  } = useCategory();

  const { data: lowStockProducts } = useQuery({
    queryKey: ["lowStock"],
    queryFn: productsApi.getLowStock,
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["lowStock"] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIdProduct(product._id);
    setIsModalOpen(true);
  };
  const handleCEdit = (category: category) => {
    setEditingCate(category);
    setIsModalCOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      useDeleteProduct().mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };
  const handleModalCClose = () => {
    setIsModalCOpen(false);
    setEditingCate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl tracking-tight">Quản lý hàng tồn kho</h2>
          <p className="text-slate-500 mt-1">
            Quản lý danh mục sản phẩm của bạn
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsModalCOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm loại sản phẩm
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowProducts && lowProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">Thông báo hàng sắp hết:</span>{" "}
                  {lowProducts.length} hàng
                  {lowProducts.length !== 1 && "s"} cần bổ sung hàng
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lowProducts.map((product) => (
                    <span
                      key={product._id}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-orange-100 text-xs"
                    >
                      {product.name} (còn lại {product.stock} )
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <div className="flex flex-col gap-2">
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search products by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <div>
          <div className="flex gap-2 ">
            <>
              {!cateLoad &&
                !cateError &&
                categories?.map((e: category) => (
                  <Card
                    className="cursor-pointer"
                    onClick={() => handleCEdit(e)}
                    key={e._id}
                  >
                    <CardContent className="p-2">
                      <div className="">{e.name}</div>
                    </CardContent>
                  </Card>
                ))}
            </>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm text-slate-500">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-slate-500">
                      SKU
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-slate-500">
                      Category
                    </th>
                    <th className="text-right py-3 px-4 text-sm text-slate-500">
                      Price
                    </th>
                    <th className="text-right py-3 px-4 text-sm text-slate-500">
                      Stock
                    </th>
                    <th className="text-right py-3 px-4 text-sm text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product: any) => (
                    <tr
                      key={product._id}
                      className={`border-b  ${
                        product.stock == 0
                          ? "  border-red-500  bg-red-100"
                          : product.stock < product.lowStockThreshold
                            ? " border-orange-500  bg-orange-100"
                            : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm">{product.name}</p>
                          {product.stock && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {product.stock}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{product.sku}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* {isLowStock(product) && (
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                          )} */}
                          <span className="text-sm">{product.stock}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <PackageX className="h-12 w-12 text-slate-300 mb-3" />
              <p className="text-slate-500">
                {searchQuery ? "No products found" : "No products yet"}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first product
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ProductModal
        open={isModalOpen}
        onClose={handleModalClose}
        product={editingProduct}
        id={idProduct}
        categories={categories}
      />

      <CategoryModal
        open={isModalCOpen}
        onClose={handleModalCClose}
        category={editCate}
      />
    </div>
  );
}
