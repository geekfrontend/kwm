"use client";

import * as React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function Hero() {
  const { user } = useAuthStore();
  const { setTheme, theme } = useTheme();
  const [time, setTime] = React.useState(new Date());
  const [greeting, setGreeting] = React.useState("Selamat Pagi");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const updateTimeAndGreeting = () => {
      const now = new Date();
      setTime(now);

      const hour = now.getHours();
      if (hour < 11) {
        setGreeting("Selamat Pagi");
      } else if (hour < 15) {
        setGreeting("Selamat Siang");
      } else if (hour < 18) {
        setGreeting("Selamat Sore");
      } else {
        setGreeting("Selamat Malam");
      }
    };

    updateTimeAndGreeting(); // Initial call
    const timer = setInterval(updateTimeAndGreeting, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 text-white px-6 pt-8 pb-16 rounded-b-[2.5rem] relative overflow-hidden shadow-lg shadow-orange-200">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      {/* Header User Info */}
      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white/30 shadow-sm">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`}
            />
            <AvatarFallback className="bg-amber-600 text-white">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-orange-50 text-xs font-medium drop-shadow-sm">
              {greeting},
            </p>
            <h2 className="text-lg font-bold leading-tight drop-shadow-sm">
              {user?.name || "Karyawan"}
            </h2>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          className="rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md relative border border-white/10 transition-all"
        >
          {mounted && theme === "dark" ? (
            <IconMoon size={20} />
          ) : (
            <IconSun size={20} />
          )}
        </Button>
      </div>

      {/* Time & Date */}
      <div className="relative text-center space-y-1 mb-4">
        <h1 className="text-4xl font-bold tracking-tight drop-shadow-md">
          {time
            .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
            .replace(".", ":")}
        </h1>
        <p className="text-orange-50 text-sm font-medium drop-shadow-sm">
          {time.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
