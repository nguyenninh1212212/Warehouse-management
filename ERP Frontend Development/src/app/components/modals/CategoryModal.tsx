import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { category, Category } from "../../../lib/types";
import { useCreateCategory, useUpdateCategory } from "../../hooks/useApi";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: category | null;
}

export function CategoryModal({ open, onClose, category }: CategoryModalProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<category>({
    name: "",
    _id: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        _id: category._id,
      });
    } else {
      setFormData({
        name: "",
        _id: "",
      });
    }
  }, [category, open]);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    category
      ? updateMutation.mutate(formData)
      : createMutation.mutate({ name: formData.name });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "lowStockThreshold"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending
                ? "Saving..."
                : category
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
