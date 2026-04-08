import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { useCreateBuyer, useUpdateBuyer } from "../../hooks/useApi";
import { Buyer } from "../../../lib/types";

interface FormData {
  name: string;
  email: string;
  phone?: string;
}

interface BuyerModalProps {
  open: boolean;
  onClose: () => void;
  buyer?: Buyer | null;
}

export const BuyerModal = ({ open, onClose, buyer }: BuyerModalProps) => {
  const isEdit = !!buyer;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateBuyer();
  const updateMutation = useUpdateBuyer();

  useEffect(() => {
    if (buyer) {
      setFormData({
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    }
  }, [buyer, open]);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (formData.phone && formData.phone.length < 9) {
      errors.phone = "Phone number is invalid";
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    if (isEdit && buyer) {
      updateMutation.mutate({
        id: buyer._id,
        data: formData,
      });
      toast.success("Updated successfully");
    } else {
      createMutation.mutate(formData);
      toast.success("Created successfully");
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa" : "Tạo"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Họ tên</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isEdit} // 👈 thường không cho sửa email
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Số điện thoại</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Optional"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isEdit ? updateMutation.isPending : createMutation.isPending
              }
            >
              {isEdit
                ? updateMutation.isPending
                  ? "Updating..."
                  : "Update"
                : createMutation.isPending
                  ? "Creating..."
                  : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
