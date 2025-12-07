"use client";

import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  IconLogout,
  IconMail,
  IconId,
  IconBuildingSkyscraper,
  IconBriefcase,
  IconChevronRight,
  IconSettings,
  IconBell,
  IconShieldLock,
  IconHelpCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] transition-colors duration-300 pb-24">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-[#1a1b1e] px-6 py-4 border-b border-slate-100 dark:border-white/10 sticky top-0 z-20 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">
            Profil Saya
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl" />
            <Avatar className="h-24 w-24 border-4 border-white dark:border-[#1a1b1e] shadow-xl relative z-10">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=128`}
              />
              <AvatarFallback className="bg-indigo-600 text-white text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {user.role}
            </p>
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm border border-slate-100 dark:border-none overflow-hidden transition-colors duration-300">
          <div className="px-5 py-3 border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Informasi Pribadi
            </h3>
          </div>
          <div className="p-2">
            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <IconMail size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Email
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <IconId size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  NIP
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  KWM-{user.id.substring(0, 6).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <IconBuildingSkyscraper size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Departemen
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Information Technology
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <IconBriefcase size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Jabatan
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Software Engineer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-rose-500/20"
          onClick={handleLogout}
        >
          <IconLogout size={20} className="mr-2" />
          Keluar Aplikasi
        </Button>

        <p className="text-center text-xs text-slate-400 font-medium pt-4">
          PT. KERISMAS WITIKCO MAKMUR
        </p>
      </div>
    </div>
  );
}
