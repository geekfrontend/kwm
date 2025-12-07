"use client";

import { IconHome, IconHistory, IconUser } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    {
      label: "Home",
      icon: IconHome,
      href: "/employee/home",
    },
    {
      label: "Riwayat",
      icon: IconHistory,
      href: "/employee/history",
    },
    {
      label: "Profil",
      icon: IconUser,
      href: "/employee/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1b1e] border-t border-slate-100 dark:border-white/10 px-6 py-3 md:max-w-[480px] md:mx-auto z-50 transition-colors duration-300">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
              )}
            >
              <item.icon size={24} stroke={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
