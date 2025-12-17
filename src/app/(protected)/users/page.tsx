"use client";

import * as React from "react";
import { UserDetailDialog } from "./detail-user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { UserDialog } from "./user-dialog";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SECURITY" | "EMPLOYEE";
  address: string;
  education: string;
  startWorkDate: string;
  position: string;
  nik: string;
  bpjsTk: string;
  bpjsKes: string;
  division?: {
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

const roleLabels = {
  ADMIN: "Admin",
  SECURITY: "Satpam",
  EMPLOYEE: "Karyawan",
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = React.useState<User[]>([]);
  const [meta, setMeta] = React.useState<Meta | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | undefined>(
    undefined
  );
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [detailUser, setDetailUser] = React.useState<User | null>(null);

  const handleDetail = (user: User) => {
    setDetailUser(user);
    setIsDetailOpen(true);
  };

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}&pageSize=${pageSize}`);
      setUsers(res.data.data.items);
      setMeta(res.data.meta);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat daftar user");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  React.useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      fetchUsers();
    }
  }, [fetchUsers, currentUser]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User berhasil dihapus");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus user");
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(undefined);
    setIsDialogOpen(true);
  };

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        Anda tidak memiliki akses ke halaman ini.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manajemen User</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Divisi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Tidak ada user ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{roleLabels[user.role]}</TableCell>
                  <TableCell>{user.division?.name || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        user.isActive
                          ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                          : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                      }`}
                    >
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleDetail(user)}>
                          Detail
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(user.id)}
                        >
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && ( 
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Halaman {meta.page} dari {meta.totalPages} ({meta.totalItems} item)
          </div>
          <div className="space-x-2 items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <UserDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        user={detailUser}
      />

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
