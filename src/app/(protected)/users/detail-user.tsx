"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

export function UserDetailDialog({
  open,
  onOpenChange,
  user,
}: UserDetailDialogProps) {
  if (!user) return null;

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("id-ID") : "-";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail User</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <DetailItem label="Nama" value={user.name} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="NIK" value={user.nik} />
          <DetailItem label="Alamat" value={user.address} />
          <DetailItem label="Pendidikan" value={user.education} />
          <DetailItem label="Jabatan" value={user.position} />
          <DetailItem label="BPJS TK" value={user.bpjsTk} />
          <DetailItem label="BPJS Kesehatan" value={user.bpjsKes} />
          <DetailItem label="Divisi" value={user.division?.name || "-"} />
          <DetailItem
            label="Tanggal Mulai Kerja"
            value={formatDate(user.startWorkDate)}
          />

          {/* ROLE */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium">{user.role}</span>
          </div>

          {/* STATUS */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={user.isActive ? "default" : "destructive"}>
              {user.isActive ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>

          {/* KETERANGAN STATUS (HANYA JIKA NONAKTIF) */}
          {!user.isActive && (
            <DetailItem
              label="Keterangan Status"
              value={user.ketStatus || "-"}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}
