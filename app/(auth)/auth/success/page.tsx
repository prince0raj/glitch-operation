"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const accentRing = "absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl";

const SuccessPage = () => {
  useEffect(() => {
    const validateGate = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (user) {
        redirect("/ui/dashboard/home");
      } else if (userError) {
        redirect("/login");
      }
    };

    validateGate();
  }, []);
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-12 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-10 top-24 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-10">
        <header className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className={cn(accentRing, "-z-10 opacity-60")} />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full md:hidden" />
        </header>

        <main className="grid flex-1 gap-10 md:grid-cols-[1.4fr,1fr]">
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-10 shadow-lg shadow-emerald-500/10 backdrop-blur">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-emerald-500/20" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-emerald-400/10" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200">
                <Loader2 className="size-4 animate-spin" />
                Syncing your session
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-300">
                  <CheckCircle2 className="size-6" />
                  <span className="font-semibold uppercase tracking-wide">
                    please wait checking login status...
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  asChild
                  className="bg-emerald-500 text-zinc-950 transition-colors hover:bg-emerald-400"
                >
                  {/* <Link href="/ui/dashboard/home">Enter dashboard</Link> */}
                </Button>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Loader2 className="size-4 animate-spin text-emerald-400" />
                  <span>Checking environment hardening</span>
                </div>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Session integrity
                  </p>
                  <Skeleton className="mt-3 h-3 w-[70%]" />
                  <Skeleton className="mt-2 h-3 w-[55%]" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">
                    Personalized feed
                  </p>
                  <Skeleton className="mt-3 h-3 w-[65%]" />
                  <Skeleton className="mt-2 h-3 w-[45%]" />
                </div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col justify-between gap-6">
            <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-900/70 p-6 backdrop-blur">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="w-full space-y-3">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </aside>
        </main>

        <footer className="grid gap-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur md:grid-cols-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </footer>
      </div>
    </div>
  );
};

export default SuccessPage;
