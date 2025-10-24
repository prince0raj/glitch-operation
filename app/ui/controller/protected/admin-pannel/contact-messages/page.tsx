"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Orbitron } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  Mail,
  Search,
  User,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Trash2,
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

type ContactMessage = {
  id: number;
  created_at: string;
  sender_name: string;
  sender_email: string;
  sender_subject: string;
  sender_message: string;
};

type ContactResponse = {
  messages: ContactMessage[];
};

const ContactMessagesPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    const storedToken = localStorage.getItem(Constants.OPS_GLITCH_TOKEN);
    setToken(storedToken);
  }, []);

  const requestUrl = token ? "/api/v2/contactus" : null;

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

  const { data, error, loading, refetch } = useFetch<ContactResponse>(
    requestUrl,
    fetchOptions
  );

  const messages = data?.messages ?? [];

  const filteredMessages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return messages;

    return messages.filter((message) => {
      const { sender_name, sender_email, sender_subject, sender_message } =
        message;
      const haystack =
        `${sender_name} ${sender_email} ${sender_subject} ${sender_message}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [messages, query]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMessages.slice(start, start + pageSize);
  }, [filteredMessages, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const handleRowClick = (message: ContactMessage) => {
    setSelectedMessage(message);
  };

  const closeDetails = () => {
    setSelectedMessage(null);
  };

  const prepareDelete = (message: ContactMessage) => {
    setSelectedMessage(null);
    setDeleteTarget(message);
    setDeleteError(null);
  };

  const handleDeleteClick = (
    event: React.MouseEvent,
    message: ContactMessage
  ) => {
    event.stopPropagation();
    prepareDelete(message);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !token) {
      setDeleteError("Missing message or admin token");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/v2/contactus?id=${deleteTarget.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let message = "Failed to delete message";
        try {
          const body = await response.json();
          if (body && typeof body.error === "string") {
            message = body.error;
          }
        } catch {
          // ignore JSON parse issues
        }
        throw new Error(message);
      }

      await refetch();
      setDeleteTarget(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected delete failure";
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (next: number) => {
    const clamped = Math.max(1, Math.min(totalPages, next));
    setPage(clamped);
  };

  return (
    <>
      <AdminContentHeader>
        <AdminContentTitle
          className={`${orbitron.className} uppercase tracking-[0.25em]`}
        >
          Contact Transmission Logs
        </AdminContentTitle>
        <AdminContentDescription>
          Review incoming transmissions from the Contact Ops channel. Inspect
          sender intel and message payloads to coordinate timely responses.
        </AdminContentDescription>
      </AdminContentHeader>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm tracking-[0.2em] text-emerald-200 uppercase">
          Total messages: {messages.length}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 cursor-pointer text-emerald-200 hover:text-emerald-100"
            onClick={() => router.push("/ui/controller/protected/admin-pannel")}
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer text-emerald-200 border-emerald-500/40"
            onClick={() => refetch()}
            disabled={loading}
          >
            {loading ? "Refreshing" : "Refresh"}
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
                placeholder="Search by name, email, or subject"
                className="h-11 w-full border-emerald-500/30 bg-slate-950/70 pl-10 text-slate-100"
              />
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Showing {paginatedMessages.length} of {filteredMessages.length}{" "}
              filtered messages
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full table-fixed border-collapse text-left text-sm text-slate-200">
              <thead className="bg-emerald-500/10 text-xs uppercase tracking-[0.18em] text-emerald-200">
                <tr>
                  <th className="rounded-l-lg px-4 py-3">Sender</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3 text-right">Received</th>
                  <th className="rounded-r-lg px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="border border-emerald-500/20">
                {paginatedMessages.length > 0 ? (
                  paginatedMessages.map((message) => {
                    const {
                      id,
                      sender_name,
                      sender_email,
                      sender_subject,
                      created_at,
                    } = message;

                    return (
                      <tr
                        key={id}
                        className="group cursor-pointer border-b border-emerald-500/20 bg-slate-950/80 transition hover:bg-emerald-500/10"
                        onClick={() => handleRowClick(message)}
                      >
                        <td className="rounded-l-lg px-4 py-3 font-medium text-slate-100">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-2">
                                <User className="size-4 shrink-0 text-emerald-300" />
                                <span
                                  className="signal-ellipsis"
                                  title={sender_name}
                                >
                                  {sender_name}
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="max-w-xs break-words text-center"
                            >
                              {sender_name}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-2">
                                <Mail className="size-4 shrink-0 text-emerald-300" />
                                <span
                                  className="max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap block"
                                  title={sender_email}
                                >
                                  {sender_email}
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="max-w-xs break-words text-center"
                            >
                              {sender_email}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap block"
                                title={sender_subject}
                              >
                                {sender_subject}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="max-w-sm break-words text-center"
                            >
                              {sender_subject}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-2">
                                <Calendar className="size-4 shrink-0 text-emerald-300" />
                                <span
                                  className="signal-ellipsis"
                                  title={new Date(created_at).toLocaleString()}
                                >
                                  {new Date(created_at).toLocaleString()}
                                </span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              Received at{" "}
                              {new Date(created_at).toLocaleString()}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="rounded-r-lg px-4 py-3 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-red-300 hover:text-red-200 bg-red-500/10 border border-red-500/20"
                            onClick={(event) =>
                              handleDeleteClick(event, message)
                            }
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Delete message</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border-b border-emerald-500/20 bg-slate-950/80">
                    <td
                      className="px-4 py-6 text-center text-slate-400"
                      colSpan={5}
                    >
                      {loading
                        ? "Loading messages..."
                        : error || "No contact submissions available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-emerald-500/20 pt-4 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>
              {filteredMessages.length > 0 ? (
                <>
                  Showing messages{" "}
                  {Math.min(
                    (currentPage - 1) * pageSize + 1,
                    filteredMessages.length
                  )}
                  -{Math.min(currentPage * pageSize, filteredMessages.length)}{" "}
                  of {filteredMessages.length}
                </>
              ) : (
                "No messages to display"
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

      {selectedMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-slate-950/95 via-slate-950/90 to-slate-950/80 shadow-[0_30px_80px_rgba(2,6,23,0.75)]">
            <div className="relative flex items-center justify-between bg-emerald-500/10 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                  Transmission Details
                </p>
                <h2
                  className={`${orbitron.className} text-2xl font-semibold uppercase tracking-[0.25em] text-emerald-100`}
                >
                  {selectedMessage.sender_subject}
                </h2>
              </div>
              <div className="hidden text-right text-xs uppercase tracking-[0.2em] text-emerald-200 sm:block">
                Received
                <br />
                {new Date(selectedMessage.created_at).toLocaleString()}
              </div>
            </div>

            <div className="grid gap-6 px-6 py-6 sm:grid-cols-[320px_1fr]">
              <div className="space-y-5 rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-5">
                <div className="space-y-2 text-sm text-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                    Sender Profile
                  </p>
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <User className="size-4 text-emerald-300" />
                    <div>
                      <p className="font-medium text-slate-100">
                        {selectedMessage.sender_name}
                      </p>
                      <p className="text-xs text-slate-400">
                        #{selectedMessage.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <Mail className="size-4 text-emerald-300" />
                    <span className="break-all text-slate-100">
                      {selectedMessage.sender_email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <Calendar className="size-4 text-emerald-300" />
                    <span>
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                    Message Body
                  </p>
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-950/70">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),rgba(10,16,28,0.9))] opacity-70" />
                    <div className="relative flex gap-3 p-5 text-sm text-slate-100">
                      <MessageSquare className="mt-1 size-4 shrink-0 text-emerald-300" />
                      <div className="max-h-[320px] w-full overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {selectedMessage.sender_message}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-emerald-200 hover:text-emerald-100"
                    onClick={closeDetails}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    className="gap-2 bg-red-500/20 text-red-200 hover:bg-red-500/35"
                    onClick={() => prepareDelete(selectedMessage)}
                  >
                    <Trash2 className="size-4" />
                    Delete Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-950/95 p-6 shadow-[0_20px_60px_rgba(127,29,29,0.45)]">
            <div className="space-y-3 text-sm text-slate-100">
              <p className="text-xs uppercase tracking-[0.3em] text-red-300">
                Confirm purge
              </p>
              <h3
                className={`${orbitron.className} text-xl uppercase tracking-[0.25em] text-red-100`}
              >
                Delete Message
              </h3>
              <p>
                You are about to permanently remove the transmission from
                <span className="font-medium text-emerald-200">
                  {" "}
                  {deleteTarget.sender_name}
                </span>
                . This action cannot be undone.
              </p>
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                "{deleteTarget.sender_subject}"
              </div>
              {deleteError ? (
                <p className="text-xs text-red-300">{deleteError}</p>
              ) : null}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                className="text-slate-300 hover:text-slate-100"
                onClick={closeDeleteDialog}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="gap-2 bg-red-500/25 text-red-100 hover:bg-red-500/35"
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

export default ContactMessagesPage;
