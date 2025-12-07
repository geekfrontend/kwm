import { cn } from "@/lib/utils";
import { IconArrowDownLeft, IconArrowUpRight } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import moment from "moment";
import "moment/locale/id";

moment.locale("id");

interface AttendanceItem {
  id: string;
  userId: string;
  attendanceDate: string;
  checkInAt: string;
  checkOutAt: string | null;
  status?: string; // derived
}

export function AttendanceHistory() {
  const [history, setHistory] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/api/attendance/me", {
          params: { page: 1, pageSize: 3 },
        });
        setHistory(response.data.data.items);
      } catch (error) {
        console.error("Failed to fetch history", error);
        // Silent error for widget, or maybe just log
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Helper to determine status (mock logic for now as API doesn't return status)
  // Assuming 08:00 is the start time
  const getStatus = (checkInAt: string) => {
    const checkInTime = moment(checkInAt);
    const limitTime = moment(checkInAt).set({ hour: 8, minute: 0, second: 0 });
    return checkInTime.isAfter(limitTime) ? "late" : "ontime";
  };

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">
          Riwayat Absensi
        </h3>
        <Link href="/employee/history" passHref>
          <Button
            variant="link"
            className="text-indigo-600 dark:text-indigo-400 text-xs font-medium h-auto p-0 hover:no-underline"
          >
            Lihat Semua
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4 text-slate-400 text-sm">
            Memuat riwayat...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-4 text-slate-400 text-sm">
            Belum ada riwayat absensi.
          </div>
        ) : (
          history.map((item) => {
            const status = getStatus(item.checkInAt);
            return (
              <Card
                key={item.id}
                className="border-slate-100 dark:border-none shadow-sm rounded-2xl bg-white dark:bg-[#1a1b1e] text-slate-900 dark:text-white transition-colors duration-300"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">
                      {moment(item.attendanceDate).format("dddd, D MMM")}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center">
                          <IconArrowDownLeft size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {moment(item.checkInAt).format("HH:mm")}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 flex items-center justify-center">
                          <IconArrowUpRight size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {item.checkOutAt
                            ? moment(item.checkOutAt).format("HH:mm")
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border-none",
                      status === "ontime"
                        ? "bg-emerald-100 dark:bg-emerald-500 text-emerald-700 dark:text-emerald-950 hover:bg-emerald-200 dark:hover:bg-emerald-400"
                        : status === "late"
                          ? "bg-rose-100 dark:bg-rose-500 text-rose-700 dark:text-rose-950 hover:bg-rose-200 dark:hover:bg-rose-400"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600",
                    )}
                  >
                    {status === "ontime" ? "Tepat Waktu" : "Terlambat"}
                  </Badge>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
