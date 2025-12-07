"use client";

import * as React from "react";
import {
  IconFingerprint,
  IconMapPin,
  IconRefresh,
  IconAlertCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import api from "@/lib/api";
import { toast } from "sonner";

export function AttendanceAction() {
  const [isCheckedIn, setIsCheckedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // QR Code State
  const [showQR, setShowQR] = React.useState(false);
  const [qrData, setQrData] = React.useState<string>("");
  const [fetchError, setFetchError] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [isRefetching, setIsRefetching] = React.useState(false);
  const [cooldownTime, setCooldownTime] = React.useState(0);

  // Initial fetch for attendance status
  React.useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await api.get("api/attendance/today");
        const data = response.data.data;
        // If data exists and checkInAt is present but checkOutAt is null, user is checked in
        setIsCheckedIn(!!(data?.checkInAt && !data?.checkOutAt));
      } catch (error: any) {
        console.error("Failed to fetch attendance status", error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Gagal memuat status absensi");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const fetchQRCode = React.useCallback(async () => {
    if (cooldownTime > 0) {
      toast.warning(`Mohon tunggu ${cooldownTime} detik sebelum mencoba lagi.`);
      return;
    }

    try {
      setIsRefetching(true);
      setFetchError(false);

      const response = await api.get("api/attendance/my-qr");
      const { qr, expiresInMs } = response.data.data;

      setQrData(qr);
      setTimeLeft(Math.floor(expiresInMs / 1000));
    } catch (error: any) {
      console.error("Failed to fetch QR code:", error);
      setFetchError(true);
      setQrData("");

      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403) {
          setShowQR(false);
          toast.error("Sesi anda telah berakhir. Silakan login kembali.");
        } else if (status === 429) {
          const retryAfter = parseInt(
            error.response.headers["retry-after"] || "3",
            10,
          );
          setCooldownTime(retryAfter);
          toast.warning(`Terlalu banyak permintaan. Mohon tunggu sebentar.`);
        } else {
          toast.error("Gagal memuat QR Code. Silakan coba lagi.");
        }
      } else {
        toast.error("Terjadi kesalahan jaringan.");
      }
    } finally {
      setIsRefetching(false);
    }
  }, [cooldownTime]);

  const handleAttendance = () => {
    // Just open dialog, fetching happens in useEffect based on open state
    setShowQR(true);
  };

  // Initial fetch when dialog opens
  React.useEffect(() => {
    if (showQR) {
      fetchQRCode();
    } else {
      setQrData(""); // Clear QR when closed
      setTimeLeft(0);
      setFetchError(false);
    }
  }, [showQR, fetchQRCode]);

  // Cooldown timer
  React.useEffect(() => {
    if (cooldownTime <= 0) return;

    const timer = setInterval(() => {
      setCooldownTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownTime]);

  // QR Expiry Timer
  React.useEffect(() => {
    if (!showQR || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time is up, try to refetch once
          fetchQRCode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showQR, timeLeft, fetchQRCode]);

  return (
    <>
      <Card className="mx-6 relative z-10 shadow-xl shadow-slate-200 dark:shadow-black/20 border-none rounded-3xl bg-white dark:bg-[#1a1b1e] text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
        <CardContent className="p-6">
          {/* Shift Info */}
          <div className="flex justify-between items-center mb-6 text-sm">
            <div className="flex flex-col">
              <span className="text-slate-400 font-medium text-xs">
                Jam Masuk
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                08:00
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-400 font-medium text-xs">
                Jam Pulang
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                17:00
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mb-6 relative">
            {/* Glow Effect - Only in dark mode or when active */}
            <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            <Button
              type="button"
              onClick={handleAttendance}
              disabled={loading}
              variant="ghost"
              className={cn(
                "w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 transition-all shadow-2xl ring-4 ring-offset-4 dark:ring-offset-[#1a1b1e] ring-offset-white relative z-10",
                isCheckedIn
                  ? "bg-linear-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 ring-rose-100 dark:ring-rose-500/30 text-white shadow-rose-200 dark:shadow-rose-900/50"
                  : "bg-linear-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 ring-indigo-100 dark:ring-indigo-500/30 text-white shadow-indigo-200 dark:shadow-indigo-900/50",
                loading && "opacity-80 scale-95 cursor-wait",
              )}
            >
              <IconFingerprint
                size={44}
                className={cn(
                  "transition-transform drop-shadow-md",
                  loading && "animate-pulse",
                )}
              />
              <span className="font-bold text-sm drop-shadow-sm">
                {loading ? "Memuat..." : isCheckedIn ? "Check Out" : "Check In"}
              </span>
            </Button>
          </div>

          {/* Location */}
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="py-1.5 px-4 rounded-full gap-2 bg-slate-50 dark:bg-white text-slate-500 dark:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-100 font-medium shadow-sm border-0"
            >
              <IconMapPin
                size={16}
                className="text-indigo-500 dark:text-indigo-600"
              />
              Kantor Pusat, Manado
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1a1b1e] border-none shadow-2xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {isCheckedIn ? "Scan untuk Check Out" : "Scan untuk Check In"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Tunjukkan QR Code ini ke Satpam
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            <div className="relative p-4 bg-white rounded-3xl shadow-inner border border-slate-100 dark:border-none">
              {isRefetching && !qrData ? (
                // Lightweight loading skeleton
                <div className="w-[200px] h-[200px] bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse flex items-center justify-center">
                  <IconRefresh
                    className="animate-spin text-slate-300"
                    size={32}
                  />
                </div>
              ) : qrData ? (
                <QRCode
                  value={qrData}
                  size={200}
                  className="h-auto max-w-full rounded-lg"
                  viewBox={`0 0 256 256`}
                />
              ) : (
                // Error state
                <div className="w-[200px] h-[200px] bg-slate-50 dark:bg-slate-800/50 rounded-lg flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <IconAlertCircle className="text-red-500" size={32} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gagal memuat QR Code
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchQRCode}
                    className="h-8 text-xs"
                  >
                    Coba Lagi
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 w-full">
              {qrData && (
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <span>Auto refresh dalam</span>
                  <span
                    className={cn(
                      "font-bold tabular-nums",
                      timeLeft < 10
                        ? "text-red-500"
                        : "text-indigo-600 dark:text-indigo-400",
                    )}
                  >
                    {timeLeft}s
                  </span>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={fetchQRCode}
                disabled={isRefetching || cooldownTime > 0}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <IconRefresh
                  size={14}
                  className={cn("mr-1", isRefetching && "animate-spin")}
                />
                {cooldownTime > 0
                  ? `Tunggu ${cooldownTime}s`
                  : "Refresh Manual"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
