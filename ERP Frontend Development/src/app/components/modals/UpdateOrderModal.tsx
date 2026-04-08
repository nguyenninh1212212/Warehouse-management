import { useState } from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import { useUpdateOrder } from "../../hooks/useApi";

interface UpdateOrderModalProps {
  orderId: string;
  currentStatus: string;
  onClose: () => void;
}

export const UpdateOrderModal = ({
  orderId,
  currentStatus,
  onClose,
}: UpdateOrderModalProps) => {
  const [status, setStatus] = useState(currentStatus);
  const updateMutation = useUpdateOrder();

  const handleSubmit = () => {
    updateMutation.mutate(
      { id: orderId, status: currentStatus },
      {
        onSuccess: () => {
          toast.success("Order status updated!");
          if (status === "COMPLETED") {
            onClose();
          }
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to Cập nhật trạng thái đơn hàng");
        },
      },
    );
  };

  return (
    <Dialog open={true}>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Cập nhật trạng thái đơn hàng</h3>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded p-2 w-full"
        >
          {["PENDING", "CANCELLED", "COMPLETED"].map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-2">
          <Button variant="default" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Cập nhật</Button>
        </div>
      </div>
    </Dialog>
  );
};
