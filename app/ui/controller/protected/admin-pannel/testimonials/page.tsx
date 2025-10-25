"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";
import {
  CirclePlus,
  CalendarClock,
  Pencil,
  RefreshCcw,
  Search,
  Trash2,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/app/hook/useFetch";
import { Constants } from "@/app/utils/Constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AdminContentDescription,
  AdminContentHeader,
  AdminContentTitle,
  AdminQuickActions,
} from "../style";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  level: string | null;
  social_id: string | null;
  text: string;
  rating: number | null;
  created_at: string | null;
};

interface TestimonialsResponse {
  testimonials: Testimonial[];
}

const TestimonialsPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    const storedToken = localStorage.getItem(Constants.OPS_GLITCH_TOKEN);
    setToken(storedToken);
  }, []);

  const requestUrl = token ? "/api/v2/testimonials" : null;

  const fetchOptions = useMemo(
    () =>
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : { manual: true },
    [token]
  );

  const { data, error, loading, refetch } = useFetch<TestimonialsResponse>(
    requestUrl,
    fetchOptions
  );

  const testimonials = data?.testimonials ?? [];

  const filteredTestimonials = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return testimonials;

    return testimonials.filter((testimonial) => {
      const haystack = [
        testimonial.name,
        testimonial.role ?? "",
        testimonial.level ?? "",
        testimonial.text,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [testimonials, query]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTestimonials.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedTestimonials = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTestimonials.slice(start, start + pageSize);
  }, [filteredTestimonials, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const handlePageChange = (next: number) => {
    const clamped = Math.max(1, Math.min(totalPages, next));
    setPage(clamped);
  };

  const handleDeleteClick = (testimonial: Testimonial) => {
    setDeleteTarget(testimonial);
    setDeleteError(null);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !token) {
      setDeleteError("Missing testimonial or admin token");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(
        `/api/v2/testimonials?id=${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let message = "Failed to delete testimonial";
        try {
          const body = await response.json();
          if (body && typeof body.error === "string") {
            message = body.error;
          }
        } catch {
          // ignore json parse issues
        }
        throw new Error(message);
      }

      await refetch();
      setDeleteTarget(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected delete failure";
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCreatedAt = (value: string | null) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  return (
    <>
      <AdminContentHeader>
        <AdminContentTitle
          className={`${orbitron.className} uppercase tracking-[0.25em]`}
        >
          Testimonial Command Deck
        </AdminContentTitle>
        <AdminContentDescription>
          Review social proof from hunters and partners. Elevate trusted voices
          or prune outdated transmissions to keep OPS GLITCH credible.
        </AdminContentDescription>
      </AdminContentHeader>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm tracking-[0.2em] text-emerald-200 uppercase">
          Total testimonials: {testimonials.length}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 cursor-pointer text-emerald-200 hover:text-emerald-100"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCcw className="size-4" />
            Refresh
          </Button>
          <Button
            asChild
            className="gap-2 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-400/30"
          >
            <Link href="/ui/controller/protected/admin-pannel/testimonials/manage">
              <CirclePlus className="size-4" />
              Create Testimonial
            </Link>
          </Button>
        </div>
      </div>

      <AdminQuickActions>
        <div className="flex flex-col gap-5 rounded-xl border border-emerald-500/20 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.55)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-emerald-300" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search testimonials"
                className="h-11 w-full border-emerald-500/30 bg-slate-950/70 pl-10 text-slate-100"
              />
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Showing {paginatedTestimonials.length} of{" "}
              {filteredTestimonials.length} filtered testimonials
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full table-fixed border-collapse text-left text-sm text-slate-200">
              <thead className="bg-emerald-500/10 text-xs uppercase tracking-[0.18em] text-emerald-200">
                <tr>
                  <th className="rounded-l-lg px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Excerpt</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="rounded-r-lg px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="border border-emerald-500/20">
                {paginatedTestimonials.length > 0 ? (
                  paginatedTestimonials.map((testimonial) => {
                    const { id, name, role, level, rating, text, created_at } =
                      testimonial;
                    const excerpt =
                      text.length > 80 ? `${text.slice(0, 77)}...` : text;

                    return (
                      <tr
                        key={id}
                        className="group border-b border-emerald-500/20 bg-slate-950/80 transition hover:bg-emerald-500/10"
                      >
                        <td className="rounded-l-lg px-4 py-3 font-medium text-slate-100">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-2">
                                <UserCircle2 className="size-5 text-emerald-300" />
                                <span
                                  className="block max-w-[8rem] truncate"
                                  title={name}
                                >
                                  {name}
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {name}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {role ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="block max-w-[8rem] truncate"
                                  title={role}
                                >
                                  {role}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {role}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {level || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {rating ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="block max-w-[16rem] truncate"
                                title={text}
                              >
                                {excerpt}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="max-w-sm break-words"
                            >
                              {text}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="inline-flex items-center gap-2"
                                title={formatCreatedAt(created_at)}
                              >
                                <CalendarClock className="size-4 text-emerald-300" />
                                <span className="block max-w-[6rem] truncate">
                                  {formatCreatedAt(created_at)}
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {formatCreatedAt(created_at)}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="rounded-r-lg px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-emerald-200 hover:text-emerald-100 cursor-pointer bg-emerald-500/10 border border-emerald-500/20"
                              onClick={() =>
                                router.push(
                                  `/ui/controller/protected/admin-pannel/testimonials/manage?id=${encodeURIComponent(
                                    id
                                  )}`
                                )
                              }
                            >
                              <Pencil className="size-4" />
                              <span className="sr-only">Edit testimonial</span>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-red-300 hover:text-red-200 cursor-pointer bg-red-500/10 border border-red-500/20"
                              onClick={() => handleDeleteClick(testimonial)}
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">
                                Delete testimonial
                              </span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border-b border-emerald-500/20 bg-slate-950/80">
                    <td
                      className="px-4 py-6 text-center text-slate-400"
                      colSpan={7}
                    >
                      {loading
                        ? "Loading testimonials..."
                        : error || "No testimonials available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-emerald-500/20 pt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
            <span>
              {filteredTestimonials.length > 0 ? (
                <>
                  Showing testimonials{" "}
                  {Math.min(
                    (currentPage - 1) * pageSize + 1,
                    filteredTestimonials.length
                  )}
                  -
                  {Math.min(
                    currentPage * pageSize,
                    filteredTestimonials.length
                  )}
                </>
              ) : (
                "No testimonials to display"
              )}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-emerald-200 hover:text-emerald-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-emerald-200 hover:text-emerald-100"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </AdminQuickActions>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-emerald-500/30 bg-slate-950/90 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.7)]">
            <h2
              className={`${orbitron.className} mb-4 text-xl uppercase tracking-[0.2em] text-emerald-100`}
            >
              Confirm Delete
            </h2>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete the testimonial from
              <span className="text-emerald-200"> {deleteTarget.name}</span>?
              This action cannot be undone.
            </p>
            {deleteError ? (
              <p className="mt-3 text-sm text-red-400">{deleteError}</p>
            ) : null}
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                className="text-emerald-200 hover:text-emerald-100"
                onClick={closeDeleteDialog}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="gap-2 bg-red-500/20 text-red-200 hover:bg-red-500/30"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TestimonialsPage;
