"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/app/hook/useFetch";
import { AdminLoginContainer, AdminLoginWrapper } from "./style";
import { Constants } from "@/app/utils/Constants";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

type AdminLoginResponse = {
  token?: string;
  expiresIn?: number;
  error?: string;
};

const page = () => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    refetch: authenticate,
    data,
    error,
    loading,
  } = useFetch<AdminLoginResponse>("/api/v2/admin-login", {
    method: "POST",
    manual: true,
  });

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  useEffect(() => {
    if (data?.token) {
      localStorage.setItem(Constants.OPS_GLITCH_TOKEN, data.token);
      router.push("/ui/controller/protected/admin-pannel");
    }
  }, [data?.token, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const adminId = formData.get("adminId")?.toString().trim();
    const secretKey = formData.get("secretKey")?.toString().trim();

    if (!adminId || !secretKey) {
      setFormError("Both Admin ID and Secret Key are required");
      return;
    }

    await authenticate({
      body: {
        adminId,
        secretKey,
      },
    });
  };

  return (
    <AdminLoginContainer>
      <AdminLoginWrapper>
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-slate-950/90 shadow-lg shadow-black/40 backdrop-blur-xl">
          <div className="pointer-events-none absolute -inset-px bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-purple-500/20 opacity-25" />
          <div className="relative space-y-8 p-10">
            <div className="space-y-3 text-center">
              <h1
                className={`${orbitron.className} text-3xl font-bold uppercase tracking-[0.35em] text-emerald-400`}
              >
                Admin Login
              </h1>
              <p className="text-sm font-mono uppercase text-emerald-200/80">
                Secure Access Node · Authorized Personnel Only
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="adminId"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/80"
                >
                  Admin ID
                </label>
                <input
                  id="adminId"
                  name="adminId"
                  type="text"
                  placeholder="GLITCH-OPS-0001"
                  className="h-12 w-full rounded-md border border-emerald-400/30 bg-slate-950/80 px-4 font-mono text-emerald-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="secretKey"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/80"
                >
                  Secret Key
                </label>
                <input
                  id="secretKey"
                  name="secretKey"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-md border border-emerald-400/30 bg-slate-950/80 px-4 font-mono text-emerald-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-black shadow-sm shadow-black/20 transition-colors hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Authorizing..." : "Authenticate Access"}
              </Button>

              {formError ? (
                <p className="text-xs font-mono text-red-400 text-center uppercase tracking-[0.2em]">
                  {formError}
                </p>
              ) : null}
            </form>

            <div className="space-y-2 text-center">
              <p className="text-xs font-mono uppercase tracking-[0.23em] text-emerald-200/70">
                Multi-factor verification engaged
              </p>
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-emerald-200/40">
                Activity monitored · Unauthorized entry prosecuted
              </p>
            </div>
          </div>
        </div>
      </AdminLoginWrapper>
    </AdminLoginContainer>
  );
};

export default page;
