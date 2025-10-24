"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { useRouter } from "next/navigation";
import { Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/app/hook/useFetch";
import { Constants } from "@/app/utils/Constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AdminContentDescription,
  AdminContentHeader,
  AdminContentTitle,
  AdminQuickActions,
} from "./style";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

type Contest = {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  reward: number;
  participants: number;
  deadline: string | null;
  status: string;
  short_desc: string | null;
  description: string | null;
  requirements: string[] | null;
  target_url: string | null;
  created_at: string;
  updated_at: string;
};

type ContestsResponse = {
  contests: Contest[];
};

const Page = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [token, setToken] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contest | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem(Constants.OPS_GLITCH_TOKEN);
    setToken(storedToken);
  }, []);

  const requestUrl = token ? "/api/v2/contests" : null;

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

  const { data, error, loading, refetch } = useFetch<ContestsResponse>(
    requestUrl,
    fetchOptions
  );

  const contests = data?.contests ?? [];

  const filteredContests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return contests;

    return contests.filter(({ title, slug }) => {
      const haystack = `${title} ${slug}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [contests, query]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredContests.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedContests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContests.slice(start, start + pageSize);
  }, [filteredContests, currentPage]);

  const handlePageChange = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    setPage(clamped);
  };

  const handleDeleteClick = (contest: Contest) => {
    setDeleteTarget(contest);
    setDeleteError(null);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !token) {
      setDeleteError("Missing contest or admin token");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/v2/contests?id=${deleteTarget.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let message = "Failed to delete contest";
        try {
          const errorBody = await response.json();
          if (errorBody && typeof errorBody.error === "string") {
            message = errorBody.error;
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

  return (
    <>
      <AdminContentHeader>
        <AdminContentTitle
          className={`${orbitron.className} uppercase tracking-[0.25em]`}
        >
          Contests Command Deck
        </AdminContentTitle>
        <AdminContentDescription>
          Review active operations, monitor hunter activity, and deploy new
          missions when ready. Maintain the neon edge and keep OPS GLITCH
          secure.
        </AdminContentDescription>
      </AdminContentHeader>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm tracking-[0.2em] text-emerald-200 uppercase">
          Total contests: {contests.length}
        </p>
        <Button
          asChild
          className="gap-2 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-400/30"
        >
          <Link href="/ui/controller/protected/admin-pannel/create-challenge">
            Launch New Contest
          </Link>
        </Button>
      </div>

      <AdminQuickActions>
        <div className="flex flex-col gap-5 rounded-xl border border-emerald-500/20 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.55)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-emerald-300" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search contests by name or slug"
                className="h-11 w-full border-emerald-500/30 bg-slate-950/70 pl-10 text-slate-100"
              />
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
              <span>
                Showing {paginatedContests.length} of {filteredContests.length}{" "}
                filtered contests
              </span>
              <span className="hidden sm:inline">•</span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <TooltipProvider delayDuration={200}>
              <table className="min-w-[720px] w-full table-fixed border-collapse text-left text-sm text-slate-200">
                <thead className="bg-emerald-500/10 text-xs uppercase tracking-[0.18em] text-emerald-200">
                  <tr>
                    <th className="rounded-l-lg px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th className="px-4 py-3">Reward (XP)</th>
                    <th className="px-4 py-3">Participants</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="rounded-r-lg px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="border border-emerald-500/20">
                  {paginatedContests.length > 0 ? (
                    paginatedContests.map((contest) => {
                      const {
                        id,
                        slug,
                        title,
                        difficulty,
                        reward,
                        participants,
                        deadline,
                        status,
                      } = contest;

                      return (
                        <tr
                          key={id}
                          className="group border-b border-emerald-500/20 bg-slate-950/80 transition hover:bg-emerald-500/10"
                        >
                          <td className="rounded-l-lg px-4 py-3 text-xs uppercase tracking-[0.22em] text-emerald-300">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block max-w-[6rem] truncate">
                                  #{slug}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                Contest slug #{slug}
                              </TooltipContent>
                            </Tooltip>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-100">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block max-w-[18rem] truncate">
                                  {title}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {title}
                              </TooltipContent>
                            </Tooltip>
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {difficulty}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {reward.toLocaleString()} XP
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {participants}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block max-w-[10rem] truncate">
                                  {deadline
                                    ? new Date(deadline).toLocaleDateString()
                                    : "—"}
                                </span>
                              </TooltipTrigger>
                              {deadline ? (
                                <TooltipContent side="bottom">
                                  Reporting deadline{" "}
                                  {new Date(deadline).toLocaleDateString()}
                                </TooltipContent>
                              ) : null}
                            </Tooltip>
                          </td>
                          <td className="px-4 py-3">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-xs uppercase tracking-[0.18em] text-emerald-200">
                                  {status}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                Contest status: {status}
                              </TooltipContent>
                            </Tooltip>
                          </td>
                          <td className="rounded-r-lg px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-emerald-200 hover:text-emerald-100 cursor-pointer bg-emerald-500/10 border border-emerald-500/20"
                                    onClick={() =>
                                      router.push(
                                        `/ui/controller/protected/admin-pannel/create-challenge?id=${encodeURIComponent(
                                          id
                                        )}`
                                      )
                                    }
                                  >
                                    <Pencil className="size-4" />
                                    <span className="sr-only">Edit contest</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  Edit contest
                                </TooltipContent>
                              </Tooltip>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-red-300 hover:text-red-200 cursor-pointer bg-red-500/10 border border-red-500/20"
                                onClick={() => handleDeleteClick(contest)}
                              >
                                <Trash2 className="size-4" />
                                {/* Delete */}
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
                        colSpan={8}
                      >
                        {loading
                          ? "Loading contests..."
                          : error || "No contests available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TooltipProvider>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-emerald-500/20 pt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
            <span>
              {filteredContests.length > 0 ? (
                <>
                  Showing contests{" "}
                  {Math.min(
                    (currentPage - 1) * pageSize + 1,
                    filteredContests.length
                  )}
                  -{Math.min(currentPage * pageSize, filteredContests.length)}
                </>
              ) : (
                "No contests to display"
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
              Are you sure you want to delete the contest "
              <span className="text-emerald-200">{deleteTarget.title}</span>"?
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

export default Page;
