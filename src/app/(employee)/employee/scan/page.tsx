"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconScan, IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { Scanner } from "@yudiel/react-qr-scanner";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [pauseScan, setPauseScan] = useState(false);

  const handleScan = useCallback(
    async (detectedCodes: any[]) => {
      if (loading || pauseScan || detectedCodes.length === 0) return;

      const rawValue = detectedCodes[0].rawValue;
      if (!rawValue) return;

      setPauseScan(true);
      setLoading(true);
      const toastId = toast.loading("Memproses QR Code...");

      try {
        const response = await api.post("/api/security/scan-attendance", {
          qr: rawValue,
        });

        const { data } = response.data;
        const mode = data?.mode === "CHECK_IN" ? "Check In" : "Check Out";
        const userName = data?.attendance?.user?.name || "Karyawan";

        toast.dismiss(toastId);
        toast.success(`${mode} Berhasil`, {
          description: `${userName} berhasil ${mode}`,
          duration: 3000,
        });
      } catch (error: any) {
        toast.dismiss(toastId);
        const errorMsg =
          error.response?.data?.message || "Gagal memproses QR Code";
        toast.error("Gagal", {
          description: errorMsg,
        });
      } finally {
        setLoading(false);
        // Resume scanning after a delay to prevent double scans
        setTimeout(() => {
          setPauseScan(false);
        }, 2500);
      }
    },
    [loading, pauseScan],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] transition-colors duration-300 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1b1e] px-6 py-4 border-b border-slate-100 dark:border-white/10 sticky top-0 z-20 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Link href="/employee/home">
            <Button variant="ghost" size="icon" className="-ml-2">
              <IconChevronLeft size={24} />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">
            Scanner
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center p-6 space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Area Scanner
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">
            Arahkan kamera ke QR Code karyawan untuk melakukan presensi.
          </p>
        </div>

        {/* Scanner Viewport */}
        <div className="w-full max-w-sm aspect-square relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#1a1b1e]">
          <Scanner
            onScan={handleScan}
            allowMultiple={true}
            scanDelay={2000}
            components={{
              onOff: false,
              torch: true,
              zoom: true,
              finder: true,
            }}
            styles={{
              container: {
                width: "100%",
                height: "100%",
              },
            }}
          />

          {/* Overlay Loading State */}
          {loading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
              <IconLoader2 size={48} className="animate-spin mb-2" />
              <p className="font-bold">Memproses...</p>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium animate-pulse">
          <IconScan size={18} />
          <span>Kamera Aktif</span>
        </div>
      </div>
    </div>
  );
}
