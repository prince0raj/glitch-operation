"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Constants } from "@/app/utils/Constants";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(Constants.OPS_GLITCH_TOKEN)
          : null;

      if (!token) {
        router.replace("/ui/controller/admin-login");
        return;
      }

      try {
        const response = await fetch("/api/v2/protected/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        console.log(response);

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        if (isMounted) {
          setStatus("allowed");
        }
      } catch {
        localStorage.removeItem(Constants.OPS_GLITCH_TOKEN);
        router.replace("/ui/controller/admin-login");
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (status !== "allowed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-emerald-200 font-mono text-xs uppercase tracking-[0.35em]">
        Authenticating Access...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedLayout;
