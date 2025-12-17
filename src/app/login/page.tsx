import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-muted text-primary-foreground flex size-10 items-center justify-center rounded-md">
            <Image
              src="/img/LogoApk.png"
              alt="Logo"
              width={24}
              height={24}
              className="w-10"
            />
          </div>
          PT. KERISMAS WITIKCO MAKMUR
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
