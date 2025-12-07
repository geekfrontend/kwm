"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const { token, user, isLoading, fetchProfile } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          router.push("/login");
          return;
        }

        if (!user && storedToken) {
          await fetchProfile();
        }

        setIsChecking(false);
      };

      checkAuth();
    }, [router, user, fetchProfile]);

    // Show loading state while checking auth or fetching profile
    if (isChecking || (isLoading && !user)) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    // If no user after checking, don't render component (will redirect)
    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
