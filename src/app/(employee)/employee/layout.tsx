"use client";

import { withAuth } from "@/components/hoc/with-auth";
import { BottomNav } from "./components/bottom-nav";
import { useAuthStore } from "@/store/auth-store";
import { IconScan } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const pathname = usePathname();

  return (
    <div className="max-w-[480px] mx-auto md:shadow-md min-h-screen bg-slate-50 dark:bg-[#121212] pb-20 relative transition-colors duration-300">
      {children}

      {/* Security FAB Scanner */}
      {user?.role === "SECURITY" && pathname !== "/employee/scan" && (
        <div className="fixed bottom-24 left-0 right-0 md:max-w-[480px] md:mx-auto z-40 pointer-events-none px-6">
          <div className="flex justify-end">
            <Link href="/employee/scan" className="pointer-events-auto">
              <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg shadow-indigo-500/30 bg-indigo-600 hover:bg-indigo-700 text-white transition-transform hover:scale-105 active:scale-95"
              >
                <IconScan size={28} />
              </Button>
            </Link>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default withAuth(EmployeeLayout);
