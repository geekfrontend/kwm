"use client";

import React from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import moment from "moment";
import "moment/locale/id";
import { IconPdf } from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Attendance {
  id: string;
  attendanceDate: string;
  checkInAt: string | null;
  checkOutAt: string | null;
  status: string;
  mealAllowance?: {
    isEligible: boolean;
    isPaid: boolean;
  };
}

export default function AttendanceDetailPage() {
  const { id } = useParams();

  const [attendance, setAttendance] = React.useState<Attendance[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedAttendance, setSelectedAttendance] =
    React.useState<Attendance | null>(null);

  const printRef = React.useRef<HTMLDivElement>(null);
  console.log(attendance);

  const fetchAttendance = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/attendance/user/${id}`);
      setAttendance(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat riwayat presensi");
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    if (id) fetchAttendance();
  }, [id, fetchAttendance]);

  const toggleCheck = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  console.log(attendance);

  const isAllChecked =
    attendance.length > 0 &&
    attendance.every((a) => selectedIds.includes(a.id));

  const toggleCheckAll = () => {
    if (isAllChecked) {
      setSelectedIds([]);
    } else {
      setSelectedIds(attendance.map((a) => a.id));
    }
  };
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Riwayat Presensi",
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Riwayat Presensi User</h1>
        <Button onClick={handlePrint} disabled={selectedIds.length === 0}>
          <IconPdf className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={isAllChecked}
                  onCheckedChange={toggleCheckAll}
                />
              </TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status Kehadiran</TableHead>
              <TableHead>Status Pembayaran</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : attendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Tidak ada data presensi
                </TableCell>
              </TableRow>
            ) : (
              attendance.map((att) => (
                <TableRow key={att.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(att.id)}
                      onCheckedChange={() => toggleCheck(att.id)}
                    />
                  </TableCell>

                  <TableCell>
                    {moment(att.attendanceDate).format("dddd, D MMM YYYY")}
                  </TableCell>

                  <TableCell>
                    {att.checkInAt
                      ? moment(att.checkInAt).format("HH:mm")
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {att.checkOutAt
                      ? moment(att.checkOutAt).format("HH:mm")
                      : "-"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        att.status === "ONTIME"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }
                    >
                      {att.status === "ONTIME" ? "Tepat Waktu" : "Terlambat"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {!att.mealAllowance ||
                    att.mealAllowance.isEligible === false ? (
                      <span className="text-slate-400">-</span>
                    ) : att.mealAllowance.isPaid ? (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        Dibayar
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-100 text-rose-700">
                        Belum Dibayar
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={
                            !att.mealAllowance ||
                            !att.mealAllowance.isEligible ||
                            att.mealAllowance.isPaid ||
                            !att.checkOutAt ||
                            moment(att.checkOutAt).hour() < 18
                          }
                          onClick={async () => {
                            try {
                              await api.put(
                                `/api/attendance/allowances/${att.id}/pay`
                              );
                              toast.success("Tunjangan berhasil dibayar");
                              fetchAttendance();
                            } catch (err) {
                              toast.error("Gagal membayar tunjangan");
                            }
                          }}
                        >
                          Bayar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAttendance(att);
                            setOpenDetail(true);
                          }}
                        >
                          Detail
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

      <div className="hidden">
        <div
          ref={printRef}
          className="px-6 py-8 font-sans text-sm text-slate-800"
        >
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold tracking-wide">
              LAPORAN RIWAYAT PRESENSI
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Nama Pegawai:{" "}
              <span className="font-semibold text-slate-700">
                {attendance[0]?.user?.name || "-"}
              </span>
            </p>

            <p className="text-xs text-slate-500">
              Dicetak pada: {moment().format("DD MMMM YYYY")}
            </p>
          </div>

          <table className="w-full border border-slate-300 border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-2 py-2 text-center w-10">
                  No
                </th>
                <th className="border border-slate-300 px-3 py-2 text-left">
                  Tanggal
                </th>
                <th className="border border-slate-300 px-3 py-2 text-center">
                  Jam Masuk
                </th>
                <th className="border border-slate-300 px-3 py-2 text-center">
                  Jam Keluar
                </th>
                <th className="border border-slate-300 px-3 py-2 text-center">
                  Status Kehadiran
                </th>
                <th className="border border-slate-300 px-3 py-2 text-center">
                  Status Pembayaran
                </th>
              </tr>
            </thead>

            <tbody>
              {attendance
                .filter((a) => selectedIds.includes(a.id))
                .map((a, i) => (
                  <tr key={a.id} className="even:bg-slate-50">
                    <td className="border border-slate-300 px-2 py-2 text-center">
                      {i + 1}
                    </td>

                    <td className="border border-slate-300 px-3 py-2">
                      {moment(a.attendanceDate).format("DD MMM YYYY")}
                    </td>

                    <td className="border border-slate-300 px-3 py-2 text-center">
                      {a.checkInAt ? moment(a.checkInAt).format("HH:mm") : "-"}
                    </td>

                    <td className="border border-slate-300 px-3 py-2 text-center">
                      {a.checkOutAt
                        ? moment(a.checkOutAt).format("HH:mm")
                        : "-"}
                    </td>

                    <td
                      className={`border border-slate-300 px-3 py-2 text-center font-semibold ${
                        a.status === "ONTIME"
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}
                    >
                      {a.status === "ONTIME" ? "Tepat Waktu" : "Terlambat"}
                    </td>

                    <td className="border border-slate-300 px-3 py-2 text-center">
                      {!a.mealAllowance ||
                      a.mealAllowance.isEligible === false ? (
                        <span className="text-slate-400">-</span>
                      ) : a.mealAllowance.isPaid ? (
                        <div className="  text-emerald-700">Dibayar</div>
                      ) : (
                        <div className="  text-rose-700">Belum Dibayar</div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Dialog open={openDetail} onOpenChange={setOpenDetail}>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Detail Presensi</DialogTitle>
              </DialogHeader>

              {selectedAttendance && (
                <div className="space-y-3 text-sm">
                  <DetailRow
                    label="Nama"
                    value={selectedAttendance.user?.name}
                  />
                  <DetailRow
                    label="Email"
                    value={selectedAttendance.user?.email}
                  />
                  <DetailRow
                    label="Tanggal"
                    value={moment(selectedAttendance.attendanceDate).format(
                      "dddd, DD MMMM YYYY"
                    )}
                  />
                  <DetailRow
                    label="Jam Masuk"
                    value={
                      selectedAttendance.checkInAt
                        ? moment(selectedAttendance.checkInAt).format("HH:mm")
                        : "-"
                    }
                  />
                  <DetailRow
                    label="Jam Keluar"
                    value={
                      selectedAttendance.checkOutAt
                        ? moment(selectedAttendance.checkOutAt).format("HH:mm")
                        : "-"
                    }
                  />
                  <DetailRow
                    label="Status Kehadiran"
                    value={
                      selectedAttendance.status === "ONTIME"
                        ? "Tepat Waktu"
                        : "Terlambat"
                    }
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Status Tunjangan
                    </span>
                    {!selectedAttendance.mealAllowance ||
                    selectedAttendance.mealAllowance.isEligible === false ? (
                      <span className="text-slate-400">Tidak Berlaku</span>
                    ) : selectedAttendance.mealAllowance.isPaid ? (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        Dibayar
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-100 text-rose-700">
                        Belum Dibayar
                      </Badge>
                    )}
                  </div>

                  {selectedAttendance.mealAllowance?.amount !== undefined && (
                    <DetailRow
                      label="Nominal Tunjangan"
                      value={`Rp ${selectedAttendance.mealAllowance.amount.toLocaleString(
                        "id-ID"
                      )}`}
                    />
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
  function DetailRow({ label, value }: { label: string; value?: string }) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value || "-"}</span>
      </div>
    );
  }
}
