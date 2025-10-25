"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Orbitron } from "next/font/google";
import { ArrowLeft, Loader2, Save, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetch } from "@/app/hook/useFetch";
import { Constants } from "@/app/utils/Constants";
import {
  AdminContentDescription,
  AdminContentHeader,
  AdminContentTitle,
} from "../../style";

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

type BreachProposalResponse = {
  proposal: {
    id: string;
    title: string;
    status: ProposalStatus;
    document_link: string | null;
    reference_url: string | null;
    proposal_link: string | null;
    full_name: string | null;
    email: string | null;
    created_at: string | null;
  };
};

type FormState = {
  title: string;
  status: ProposalStatus;
  documentLink: string;
  referenceUrl: string;
  proposalLink: string;
  fullName: string;
  email: string;
  notes: string;
};

const initialState: FormState = {
  title: "",
  status: "In Review",
  documentLink: "",
  referenceUrl: "",
  proposalLink: "",
  fullName: "",
  email: "",
  notes: "",
};

const ManageBreachProposalPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const proposalId = searchParams.get("id");

  const [token, setToken] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [helperMessage, setHelperMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(Constants.OPS_GLITCH_TOKEN);
    setToken(storedToken);
  }, []);

  const requestUrl =
    proposalId && token
      ? `/api/v2/breach-proposals?id=${encodeURIComponent(proposalId)}`
      : null;

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

  const {
    data: proposalResponse,
    error: proposalError,
    loading: proposalLoading,
  } = useFetch<BreachProposalResponse>(requestUrl, fetchOptions);

  useEffect(() => {
    if (!proposalResponse?.proposal) {
      return;
    }

    const {
      title,
      status,
      document_link,
      reference_url,
      proposal_link,
      full_name,
      email,
    } = proposalResponse.proposal;

    setFormState({
      title: title ?? "",
      status: STATUS_OPTIONS.includes(status) ? status : "In Review",
      documentLink: document_link ?? "",
      referenceUrl: reference_url ?? "",
      proposalLink: proposal_link ?? "",
      fullName: full_name ?? "",
      email: email ?? "",
      notes: "",
    });
  }, [proposalResponse?.proposal]);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = useMemo(() => {
    if (!formState.title.trim()) return false;
    if (!STATUS_OPTIONS.includes(formState.status)) return false;
    if (!formState.documentLink.trim()) return false;
    return true;
  }, [formState]);

  const buildPayload = () => {
    return {
      id: proposalId,
      title: formState.title.trim(),
      status: formState.status,
      document_link: formState.documentLink.trim(),
      reference_url: formState.referenceUrl.trim() || null,
      proposal_link: formState.proposalLink.trim() || null,
      full_name: formState.fullName.trim() || null,
      email: formState.email.trim() || null,
    } as const;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!proposalId) {
      setSubmitError("Missing breach proposal identifier");
      return;
    }

    if (!token) {
      setSubmitError("Missing admin token. Please log in again.");
      return;
    }

    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setHelperMessage(null);

    try {
      const response = await fetch("/api/v2/breach-proposals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildPayload()),
      });

      if (!response.ok) {
        let message = "Failed to update breach proposal";
        try {
          const body = await response.json();
          if (body && typeof body.error === "string") {
            message = body.error;
          }
        } catch {
          // ignore JSON parse error
        }
        throw new Error(message);
      }

      setHelperMessage("Breach proposal updated successfully.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Breach proposal update failed";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!proposalId) {
    return (
      <div className="flex flex-col gap-4">
        <AdminContentHeader>
          <AdminContentTitle
            className={`${orbitron.className} uppercase tracking-[0.25em]`}
          >
            Breach Proposal Editor
          </AdminContentTitle>
        </AdminContentHeader>
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          Missing breach proposal identifier. Please navigate from the proposals
          table.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            // Update breach proposal
          </p>
          <h1
            className={`${orbitron.className} text-3xl sm:text-4xl font-semibold tracking-[0.25em] uppercase text-emerald-100`}
          >
            Edit Breach Proposal
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Adjust the mission briefing details, update review status, or
            refresh contact links for this breach scenario submission.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 cursor-pointer text-emerald-200 hover:text-emerald-100"
          onClick={() =>
            router.push("/ui/controller/protected/admin-pannel/breach-proposal")
          }
        >
          <ArrowLeft className="size-4" />
          Back to proposals
        </Button>
      </div>

      {proposalError ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {proposalError}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="relative grid gap-6 rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-6 sm:p-8 shadow-[0_25px_60px_rgba(2,6,23,0.6)] backdrop-blur-xl"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="title"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Title
            </label>
            <Input
              id="title"
              value={formState.title}
              // onChange={(event) => updateField("title", event.target.value)}
              placeholder="Ghost Hydra Breach"
              className="bg-emerald-500/10"
              required
              readOnly
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              Status
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between border-emerald-500/30 bg-slate-950/60 text-slate-100 hover:bg-emerald-500/10"
                >
                  <span>{formState.status}</span>
                  <Sparkle className="size-4 text-emerald-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-slate-950/95 text-slate-100"
              >
                {STATUS_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => updateField("status", option)}
                    className="cursor-pointer"
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="documentLink"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Document link
            </label>
            <Input
              id="documentLink"
              type="url"
              placeholder="https://docs.google.com/..."
              value={formState.documentLink}
              className="bg-emerald-500/10"
              // onChange={(event) => updateField("documentLink", event.target.value)}
              readOnly
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="referenceUrl"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Reference URL
            </label>
            <Input
              id="referenceUrl"
              type="url"
              placeholder="https://github.com/org/project"
              value={formState.referenceUrl}
              className="bg-emerald-500/10"
              // onChange={(event) => updateField("referenceUrl", event.target.value)}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="proposalLink"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Proposal link / Follow-up
            </label>
            <Input
              id="proposalLink"
              type="url"
              placeholder="https://cal.com/your-team/breach-brief"
              value={formState.proposalLink}
              className="bg-emerald-500/10"
              // onChange={(event) => updateField("proposalLink", event.target.value)}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Submitter name
            </label>
            <Input
              id="fullName"
              value={formState.fullName}
              className="bg-emerald-500/10"
              // onChange={(event) => updateField("fullName", event.target.value)}
              readOnly
              placeholder="Operator Alias"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Submitter email
            </label>
            <Input
              id="email"
              type="email"
              value={formState.email}
              className="bg-emerald-500/10"
              // onChange={(event) => updateField("email", event.target.value)}
              readOnly
              placeholder="operator@glitch.net"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="notes"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
          >
            Reviewer notes (local only)
          </label>
          <Textarea
            id="notes"
            rows={4}
            value={formState.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Optional scratchpad for your review session. Not persisted."
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer text-emerald-200 hover:text-emerald-100"
            onClick={() =>
              router.push(
                "/ui/controller/protected/admin-pannel/breach-proposal"
              )
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="gap-2 bg-emerald-500/25 text-emerald-100 hover:bg-emerald-400/35"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save Changes
          </Button>
        </div>

        {submitError ? (
          <p className="text-sm text-red-400">{submitError}</p>
        ) : null}

        {helperMessage ? (
          <div className="flex items-center gap-2 text-sm text-emerald-300">
            <Sparkle className="size-4" />
            {helperMessage}
          </div>
        ) : null}

        {proposalLoading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/70 backdrop-blur">
            <Loader2 className="size-6 animate-spin text-emerald-200" />
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default ManageBreachProposalPage;
