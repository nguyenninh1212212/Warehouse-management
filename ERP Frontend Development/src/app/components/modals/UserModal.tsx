import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { useUpdateMe, useCreateUser } from "../../hooks/useApi";
import { Me } from "../../../lib/types";

interface FormData {
  name: string;
  email: string;
  username: string;
  password?: string;
}

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  user?: Me | null;
}

export function UserModal({ open, onClose, user }: UserModalProps) {
  const isEdit = !!user;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const updateMutation = useUpdateMe();
  const createMutation = useCreateUser();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
        password: "", // không set password
      });
    } else {
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    if (isEdit && user) {
      updateMutation.mutate({
        id: user._id,
        data: {
          name: formData.name,
          username: formData.username,
        },
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    }

    onClose();
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (!formData.username || formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!isEdit) {
      if (!formData.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Invalid email format";
      }

      if (!formData.password || formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
    }

    return errors;
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

          {/* Username */}
          <div className="space-y-2">
            <Label>Tên người dùng</Label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password chỉ hiện khi CREATE */}
          {!isEdit && (
            <>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Mật khẩu</Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={
                isEdit ? updateMutation.isPending : createMutation.isPending
              }
            >
              {isEdit
                ? updateMutation.isPending
                  ? "Đang sửa..."
                  : "Sửa"
                : createMutation.isPending
                  ? "Đang tạo..."
                  : "Tạo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
