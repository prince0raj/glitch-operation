"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const contests = [
  {
    slug: "GH01",
    title: "Ghost Hydra Breach",
    difficulty: "Hard",
    reward: 1500,
    participants: 47,
    deadline: "2025-11-12",
    status: "Active",
  },
  {
    slug: "NX42",
    title: "Neon Nexus Firewall",
    difficulty: "Medium",
    reward: 900,
    participants: 82,
    deadline: "2025-10-05",
    status: "Active",
  },
  {
    slug: "CR27",
    title: "Cipher Relay",
    difficulty: "Easy",
    reward: 400,
    participants: 120,
    deadline: "2025-09-18",
    status: "Closed",
  },
];

const Page = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredContests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return contests;

    return contests.filter(({ title, slug }) => {
      const haystack = `${title} ${slug}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [query]);

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
                  <th className="rounded-r-lg px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="border border-emerald-500/20">
                {paginatedContests.map(
                  ({
                    slug,
                    title,
                    difficulty,
                    reward,
                    participants,
                    deadline,
                    status,
                  }) => (
                    <tr
                      key={slug}
                      className="group border-b border-emerald-500/20 bg-slate-950/80 transition hover:bg-emerald-500/10"
                    >
                      <td className="rounded-l-lg px-4 py-3 text-xs uppercase tracking-[0.22em] text-emerald-300">
                        <span className="block max-w-[6rem] truncate">
                          #{slug}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-100">
                        <span className="block max-w-[18rem] truncate">
                          {title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{difficulty}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {reward.toLocaleString()} XP
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {participants}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <span className="block max-w-[10rem] truncate">
                          {deadline}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-xs uppercase tracking-[0.18em] text-emerald-200">
                          {status}
                        </span>
                      </td>
                      <td className="rounded-r-lg px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-emerald-200 hover:text-emerald-100 cursor-pointer bg-emerald-500/10 border border-emerald-500/20"
                            onClick={() => console.log(`Edit ${slug}`)}
                          >
                            <Pencil className="size-4" />
                            {/* Edit */}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-red-300 hover:text-red-200 cursor-pointer bg-red-500/10 border border-red-500/20"
                            onClick={() => console.log(`Delete ${slug}`)}
                          >
                            <Trash2 className="size-4" />
                            {/* Delete */}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-emerald-500/20 pt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
            <span>
              Showing contests{" "}
              {Math.min(
                (currentPage - 1) * pageSize + 1,
                filteredContests.length
              )}
              -{Math.min(currentPage * pageSize, filteredContests.length)}
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
    </>
  );
};

export default Page;
