import { useEffect, useState } from "react";
import { User, Calendar, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { useGetMe, useUpdateMe } from "../../hooks/useApi";
import { Me } from "../../../lib/types";

export function ProfilePage() {
  const { data, isLoading } = useGetMe();

  const formatDate = (date: string) =>
    new Date(date).toISOString().split("T")[0];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl tracking-tight">Profile Settings</h2>
        <p className="text-slate-500 mt-1">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle>{data?.name}</CardTitle>
              <p className="text-sm text-slate-500 mt-1">{data?.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Name + Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" value={data?.name} disabled={true} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={data?.email} disabled />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="date"
                value={data?.createdAt && formatDate(data.createdAt)}
                disabled
              />

              <Input
                value={
                  data?.updatedAt && new Date(data?.updatedAt).toLocaleString()
                }
                disabled
              />

              <Input value={data?.role} disabled />
            </div>

            {/* Submit */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
