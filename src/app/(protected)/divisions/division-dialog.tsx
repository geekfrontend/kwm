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
import api from "@/lib/api";
import { toast } from "sonner";

const divisionSchema = z.object({
  name: z.string().min(2, "Nama divisi minimal 2 karakter"),
  isActive: z.boolean(),
});

type DivisionFormValues = z.infer<typeof divisionSchema>;

interface DivisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  division?: any;
  onSuccess: () => void;
}

export function DivisionDialog({
  open,
  onOpenChange,
  division,
  onSuccess,
}: DivisionDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const isEditing = !!division;

  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionSchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      if (division) {
        form.reset({
          name: division.name,
          isActive: division.isActive,
        });
      } else {
        form.reset({
          name: "",
          isActive: true,
        });
      }
    }
  }, [division, open, form]);

  const onSubmit = async (data: DivisionFormValues) => {
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/api/divisions/${division.id}`, data);
        toast.success("Divisi berhasil diperbarui");
      } else {
        await api.post("/api/divisions", data);
        toast.success("Divisi berhasil dibuat");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Submit Error:", error);

      const message = error.response?.data?.message || "Terjadi kesalahan";
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
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
          <DialogTitle>
            {isEditing ? "Edit Divisi" : "Tambah Divisi"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Divisi</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Teknik, Marketing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"}
                    value={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      <SelectItem value="true">Aktif</SelectItem>
                      <SelectItem value="false">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Simpan Perubahan" : "Buat Divisi"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
