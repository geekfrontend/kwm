"use client";

import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconCalendar,
  IconLoader2,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import moment from "moment";
import "moment/locale/id";
import { toast } from "sonner";

moment.locale("id");

interface AttendanceItem {
  id: string;
  userId: string;
  attendanceDate: string;
  checkInAt: string;
  checkOutAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export default function HistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("MMMM YYYY"),
  );
  const [history, setHistory] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const fetchHistory = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await api.get("/api/attendance/me", {
        params: { page, pageSize: 10 },
      });

      const { data, meta } = response.data;

      if (append) {
        setHistory((prev) => [...prev, ...data.items]);
      } else {
        setHistory(data.items);
      }

      setMeta(meta);
    } catch (error: any) {
      console.error("Failed to fetch history", error);
      toast.error("Gagal memuat riwayat absensi");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const handleLoadMore = () => {
    if (meta && meta.page < meta.totalPages) {
      fetchHistory(meta.page + 1, true);
    }
  };

  const getStatus = (checkInAt: string) => {
    const checkInTime = moment(checkInAt);
    const limitTime = moment(checkInAt).set({ hour: 8, minute: 0, second: 0 });
    return checkInTime.isAfter(limitTime) ? "late" : "ontime";
  };

  const getWorkHours = (checkInAt: string, checkOutAt: string | null) => {
    if (!checkOutAt) return "-";
    const start = moment(checkInAt);
    const end = moment(checkOutAt);
    const duration = moment.duration(end.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours}j ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] transition-colors duration-300 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1b1e] border-b border-slate-100 dark:border-white/10 sticky top-0 z-20 transition-colors duration-300">
        <div className="px-6 py-4 flex items-center gap-4">
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">
            Riwayat Absensi
          </h1>
        </div>

        {/* Month Filter */}
        <div className="px-6 pb-4">
          <Button
            variant="outline"
            className="w-full justify-between bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <IconCalendar
                size={18}
                className="text-slate-500 dark:text-slate-400"
              />
              <span>{selectedMonth}</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-0"
            >
              Total: {meta?.totalItems || 0} Hari
            </Badge>
          </Button>
        </div>
      </div>

      {/* History List */}
      <div className="px-6 py-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <IconLoader2 className="animate-spin text-slate-400" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Belum ada riwayat absensi
          </div>
        ) : (
          <>
            {history.map((item) => {
              const status = getStatus(item.checkInAt);
              return (
                <Card
                  key={item.id}
                  className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white dark:bg-[#1a1b1e] overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Date Header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {moment(item.attendanceDate).format("dddd, D MMM YYYY")}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border-none",
                          status === "ontime"
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : status === "late"
                              ? "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400"
                              : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400",
                        )}
                      >
                        {status === "ontime" ? "Tepat Waktu" : "Terlambat"}
                      </Badge>
                    </div>

                    {/* Time Details */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-400 font-medium">
                          Masuk
                        </span>
                        <div className="flex items-center gap-1.5">
                          <IconArrowDownLeft
                            size={16}
                            className="text-emerald-500"
                          />
                          <span className="text-base font-bold text-slate-800 dark:text-white">
                            {moment(item.checkInAt).format("HH:mm")}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-1 bg-slate-100 dark:bg-white/10 rounded-full relative">
                          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/20 rounded-full" />
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">
                          {getWorkHours(item.checkInAt, item.checkOutAt)}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-slate-400 font-medium">
                          Pulang
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-bold text-slate-800 dark:text-white">
                            {item.checkOutAt
                              ? moment(item.checkOutAt).format("HH:mm")
                              : "-"}
                          </span>
                          <IconArrowUpRight
                            size={16}
                            className="text-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {meta && meta.page < meta.totalPages && (
              <Button
                variant="ghost"
                className="w-full text-slate-500"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <IconLoader2 className="animate-spin mr-2" size={16} />
                ) : null}
                {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
