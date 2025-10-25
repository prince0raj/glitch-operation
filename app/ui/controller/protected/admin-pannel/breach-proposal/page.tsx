"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";
import {
  CalendarClock,
  ExternalLink,
  Loader2,
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

const STATUS_OPTIONS = [
  "In Review",
  "Needs Info",
  "Approved",
  "Rejected",
] as const;

type ProposalStatus = (typeof STATUS_OPTIONS)[number];

type BreachProposal = {
  id: string;
  title: string;
  status: ProposalStatus;
  created_at: string | null;
  document_link: string | null;
  reference_url: string | null;
  proposal_link: string | null;
  full_name: string | null;
  email: string | null;
};

type BreachProposalsResponse = {
  proposals: BreachProposal[];
};

const statusBadgeClasses: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  "needs info": "bg-orange-500/15 text-orange-300 border-orange-500/30",
  "in review": "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

const formatDateTime = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

const BreachProposalPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<BreachProposal | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(Constants.OPS_GLITCH_TOKEN);
    setToken(storedToken);
  }, []);

  const requestUrl = token ? "/api/v2/breach-proposals" : null;

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

  const { data, error, loading, refetch } = useFetch<BreachProposalsResponse>(
    requestUrl,
    fetchOptions
  );

  const proposals = data?.proposals ?? [];

  const filteredProposals = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return proposals;

    return proposals.filter((proposal) => {
      const haystack = [
        proposal.title,
        proposal.status,
        proposal.full_name ?? "",
        proposal.email ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [proposals, query]);

  const pageSize = 5;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProposals.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedProposals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProposals.slice(start, start + pageSize);
  }, [filteredProposals, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const handlePageChange = (next: number) => {
    const clamped = Math.max(1, Math.min(totalPages, next));
    setPage(clamped);
  };

  const handleDeleteClick = (proposal: BreachProposal) => {
    setDeleteTarget(proposal);
    setDeleteError(null);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !token) {
      setDeleteError("Missing breach proposal or admin token");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(
        `/api/v2/breach-proposals?id=${encodeURIComponent(deleteTarget.id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let message = "Failed to delete breach proposal";
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

  return (
    <>
      <AdminContentHeader>
        <AdminContentTitle
          className={`${orbitron.className} uppercase tracking-[0.25em]`}
        >
          Breach Proposal Command Deck
        </AdminContentTitle>
        <AdminContentDescription>
          Review breach scenario submissions from operatives, update their
          status, or retire proposals once processed.
        </AdminContentDescription>
      </AdminContentHeader>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm tracking-[0.2em] text-emerald-200 uppercase">
          Total proposals: {proposals.length}
        </p>
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
      </div>

      <AdminQuickActions>
        <div className="flex flex-col gap-5 rounded-xl border border-emerald-500/20 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.55)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-emerald-300" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, status, or submitter"
                className="h-11 w-full border-emerald-500/30 bg-slate-950/70 pl-10 text-slate-100"
              />
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Showing {paginatedProposals.length} of {filteredProposals.length}{" "}
              filtered proposals
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[820px] w-full table-fixed border-collapse text-left text-sm text-slate-200">
              <thead className="bg-emerald-500/10 text-xs uppercase tracking-[0.18em] text-emerald-200">
                <tr>
                  <th className="rounded-l-lg px-4 py-3">Title</th>
                  <th className="px-4 py-3">Submitter</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  {/* <th className="px-4 py-3">Links</th> */}
                  <th className="rounded-r-lg px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="border border-emerald-500/20">
                {paginatedProposals.length > 0 ? (
                  paginatedProposals.map((proposal) => {
                    const normalisedStatus = proposal.status.replace(/_/g, " ");
                    const badgeKey = normalisedStatus.toLowerCase();
                    const badgeClass =
                      statusBadgeClasses[badgeKey] ??
                      "bg-slate-500/20 text-slate-200 border-slate-500/30";

                    const links = [
                      proposal.document_link
                        ? { label: "Brief", href: proposal.document_link }
                        : null,
                      proposal.reference_url
                        ? { label: "Reference", href: proposal.reference_url }
                        : null,
                      proposal.proposal_link
                        ? { label: "Follow-up", href: proposal.proposal_link }
                        : null,
                    ].filter(Boolean) as { label: string; href: string }[];

                    return (
                      <tr
                        key={proposal.id}
                        className="group border-b border-emerald-500/20 bg-slate-950/80 transition hover:bg-emerald-500/10"
                      >
                        <td className="rounded-l-lg px-4 py-3 font-medium text-slate-100">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="block max-w-[16rem] truncate"
                                title={proposal.title}
                              >
                                {proposal.title}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {proposal.title}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {proposal.full_name ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-2">
                                  <UserCircle2 className="size-4 text-emerald-300" />
                                  <span
                                    className="block max-w-[10rem] truncate"
                                    title={proposal.full_name}
                                  >
                                    {proposal.full_name}
                                  </span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {proposal.full_name}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {proposal.email ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="block max-w-[14rem] truncate"
                                  title={proposal.email}
                                >
                                  {proposal.email}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {proposal.email}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeClass}`}
                          >
                            {normalisedStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="inline-flex items-center gap-2"
                                title={formatDateTime(proposal.created_at)}
                              >
                                <CalendarClock className="size-4 text-emerald-300" />
                                <span className="block max-w-[8rem] truncate">
                                  {formatDateTime(proposal.created_at)}
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {formatDateTime(proposal.created_at)}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        {/* <td className="px-4 py-3 text-slate-300">
                          {links.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {links.map((link) => (
                                <a
                                  key={`${proposal.id}-${link.label}`}
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-200 transition hover:border-emerald-500/50 hover:text-emerald-100"
                                >
                                  <ExternalLink className="size-3.5" />
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td> */}
                        <td className="rounded-r-lg px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-emerald-200 hover:text-emerald-100 cursor-pointer bg-emerald-500/10 border border-emerald-500/20"
                              onClick={() =>
                                router.push(
                                  `/ui/controller/protected/admin-pannel/breach-proposal/manage?id=${encodeURIComponent(
                                    proposal.id
                                  )}`
                                )
                              }
                            >
                              <Pencil className="size-4" />
                              <span className="sr-only">
                                Edit breach proposal
                              </span>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-red-300 hover:text-red-200 cursor-pointer bg-red-500/10 border border-red-500/20"
                              onClick={() => handleDeleteClick(proposal)}
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">
                                Delete breach proposal
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
                        ? "Loading breach proposals..."
                        : error || "No breach proposals available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-emerald-500/20 pt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
            <span>
              {filteredProposals.length > 0 ? (
                <>
                  Showing proposals{" "}
                  {Math.min(
                    (currentPage - 1) * pageSize + 1,
                    filteredProposals.length
                  )}
                  -{Math.min(currentPage * pageSize, filteredProposals.length)}
                </>
              ) : (
                "No proposals to display"
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
              Are you sure you want to delete the breach proposal "
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
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BreachProposalPage;
