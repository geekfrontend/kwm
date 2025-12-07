"use client";

import { Hero } from "../components/hero";
import { AttendanceAction } from "../components/attendance-action";
import { AttendanceHistory } from "../components/attendance-history";

export default function EmployeeHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] transition-colors duration-300">
      <Hero />

      <div className="-mt-12 relative z-10 space-y-8 pb-8">
        <AttendanceAction />
        <AttendanceHistory />
      </div>
    </div>
  );
}
