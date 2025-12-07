"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import api from "@/lib/api";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Email tidak valid"),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "SECURITY", "EMPLOYEE"]),
  divisionId: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onSuccess: () => void;
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [divisions, setDivisions] = React.useState<any[]>([]);
  const isEditing = !!user;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
      divisionId: undefined,
      isActive: true,
    },
  });

  const fetchDivisions = React.useCallback(async () => {
    try {
      // Fetch active divisions only, assuming endpoint supports filtering or we filter client-side
      // For now, just fetching all and we can filter if needed, or backend handles it.
      // Using pageSize=100 to get all divisions likely.
      const res = await api.get("/api/divisions?page=1&pageSize=100");
      setDivisions(res.data.data.items);
    } catch (error) {
      console.error("Failed to fetch divisions", error);
      toast.error("Gagal memuat daftar divisi");
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      fetchDivisions();
      if (user) {
        form.reset({
          name: user.name,
          email: user.email,
          role: user.role,
          divisionId: user.divisionId || undefined, // Handle if user has divisionId
          isActive: user.isActive,
          password: "",
        });
      } else {
        form.reset({
          name: "",
          email: "",
          password: "",
          role: "EMPLOYEE",
          divisionId: undefined,
          isActive: true,
        });
      }
    }
  }, [user, open, form, fetchDivisions]);

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);
    try {
      if (isEditing) {
        const updateData: any = { ...data };
        if (!updateData.password) delete updateData.password;
        await api.put(`/users/${user.id}`, updateData);
        toast.success("User berhasil diperbarui");
      } else {
        if (!data.password) {
          form.setError("password", { message: "Kata Sandi wajib diisi" });
          setLoading(false);
          return;
        }
        await api.post("/users", data);
        toast.success("User berhasil dibuat");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Submit Error:", error);

      const message = error.response?.data?.message || "Terjadi kesalahan";
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        // Handle detailed validation errors from backend
        Object.keys(validationErrors).forEach((key) => {
          form.setError(key as any, {
            message: validationErrors[key],
          });
        });
        toast.error("Validasi gagal, periksa kembali input Anda.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Tambah User"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama User" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SECURITY">Satpam</SelectItem>
                        <SelectItem value="EMPLOYEE">Karyawan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="divisionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Divisi</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={divisions.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Divisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {divisions.map((div) => (
                          <SelectItem key={div.id} value={div.id}>
                            {div.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEditing && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={field.value ? "true" : "false"}
                      value={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Aktif</SelectItem>
                        <SelectItem value="false">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? "Kata Sandi (Opsional)" : "Kata Sandi"}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
