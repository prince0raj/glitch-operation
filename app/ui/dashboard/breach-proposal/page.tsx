"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FileText,
  Lightbulb,
  Link as LinkIcon,
  Loader2,
  Search,
  Send,
  Sparkles,
  Clock,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

type FormState = {
  name: string;
  email: string;
  challengeTitle: string;
  challengeDescription: string;
  documentLink: string;
  referenceUrl: string;
  proposalLink: string;
};

type ProposalSummary = {
  id: string;
  title: string;
  status: string;
  createdAt: string | null;
  documentLink?: string | null;
  referenceUrl?: string | null;
  proposalLink?: string | null;
};

const initialState: FormState = {
  name: "",
  email: "",
  challengeTitle: "",
  challengeDescription: "",
  documentLink: "",
  referenceUrl: "",
  proposalLink: "",
};

const BreachProposalPage = () => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [userDefaults, setUserDefaults] = useState<{
    name: string;
    email: string;
  }>({ name: "", email: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalHistory, setProposalHistory] = useState<ProposalSummary[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toProposalSummary = useCallback((proposal: any): ProposalSummary => {
    return {
      id: String(proposal?.id ?? crypto.randomUUID()),
      title: String(proposal?.title ?? "Untitled Proposal"),
      status: String(proposal?.status ?? "Pending Review"),
      createdAt:
        typeof proposal?.created_at === "string" && proposal.created_at.trim()
          ? proposal.created_at
          : proposal?.createdAt ?? null,
      documentLink: proposal?.document_link ?? proposal?.documentLink ?? null,
      referenceUrl: proposal?.reference_url ?? proposal?.referenceUrl ?? null,
      proposalLink: proposal?.proposal_link ?? proposal?.proposalLink ?? null,
    };
  }, []);

  const fetchProposals = useCallback(
    async (email: string) => {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setProposalHistory([]);
        return;
      }

      setLoadingHistory(true);
      setHistoryError(null);

      try {
        const params = new URLSearchParams({ email: trimmedEmail });
        const response = await fetch(
          `/api/v1/breach-proposals?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const errorBody = await response
            .json()
            .catch(async () => ({ error: await response.text() }));
          throw new Error(
            typeof errorBody?.error === "string"
              ? errorBody.error
              : `Request failed with status ${response.status}`
          );
        }

        const payload = await response.json();
        const proposals = Array.isArray(payload?.proposals)
          ? (payload.proposals as unknown[]).map(toProposalSummary)
          : [];

        setProposalHistory(proposals);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
        setHistoryError("Failed to load proposal history");
      } finally {
        setLoadingHistory(false);
      }
    },
    [toProposalSummary]
  );

  useEffect(() => {
    const populateUser = async () => {
      try {
        const supabase = createClient();
        const { data, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error(
            "Failed to fetch user for breach proposal page",
            userError
          );
          return;
        }

        const user = data?.user;
        if (!user) return;

        const derivedName =
          (user.user_metadata?.name as string | undefined) ??
          (user.user_metadata?.full_name as string | undefined) ??
          (user.user_metadata?.username as string | undefined) ??
          "";

        const resolvedName = derivedName || "";
        const resolvedEmail = user.email ?? "";

        setUserDefaults({ name: resolvedName, email: resolvedEmail });
        setFormState((prev) => ({
          ...prev,
          name: resolvedName || prev.name,
          email: resolvedEmail || prev.email,
        }));
        setUserId(user.id ?? null);
      } catch (err) {
        console.error("Unexpected error while prefilling user info", err);
      }
    };

    populateUser();
  }, []);

  useEffect(() => {
    const resolvedEmail = userDefaults.email.trim();

    if (!userId || !resolvedEmail) {
      setProposalHistory([]);
      return;
    }
    fetchProposals(resolvedEmail).catch(() => {
      setProposalHistory([]);
    });
  }, [userId, userDefaults.email, fetchProposals]);

  const guidelines = useMemo(
    () => [
      "Clearly outline the real-world project or system the challenge is based on.",
      "Describe the breach scenario, including potential impact and desired learning outcomes.",
      "Share any supporting documentation, repositories, or demo environments.",
    ],
    []
  );

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleReset = () => {
    setFormState({ ...initialState, ...userDefaults });
    setSubmitted(false);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submissionPayload = {
        title: formState.challengeTitle.trim(),
        document_link: formState.documentLink.trim(),
        full_name: formState.name.trim(),
        email: formState.email.trim(),
        reference_url: formState.referenceUrl.trim() || null,
        proposal_link: formState.proposalLink.trim() || null,
      };

      const response = await fetch("/api/v1/breach-proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(submissionPayload),
      });

      if (!response.ok) {
        const errorBody = await response
          .json()
          .catch(async () => ({ error: await response.text() }));
        throw new Error(
          typeof errorBody?.error === "string"
            ? errorBody.error
            : `Submission failed with status ${response.status}`
        );
      }

      const payload = await response.json();
      const proposal = payload?.proposal
        ? toProposalSummary(payload.proposal)
        : null;

      if (proposal) {
        setProposalHistory((prev) => [
          proposal,
          ...prev.filter((item) => item.id !== proposal.id),
        ]);
      }

      if (formState.email.trim()) {
        fetchProposals(formState.email).catch(() => {
          // ignore; keep optimistic insertion above
        });
      }

      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to submit proposal. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) return proposalHistory;
    const query = searchTerm.trim().toLowerCase();
    return proposalHistory.filter((proposal) =>
      proposal.title.toLowerCase().includes(query)
    );
  }, [proposalHistory, searchTerm]);

  return (
    <section className="relative min-h-screen bg-[#05060a] text-white font-mono pt-24 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#091020_0%,_#03040a_50%,_#010207_100%)] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#00d49230_1px,transparent_1px),linear-gradient(90deg,#00d49230_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="relative z-10 w-[95%] mx-auto px-6 space-y-10">
        <header className="bg-black/40 border border-[#00d492]/30 rounded-2xl p-8 backdrop-blur-md">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#00d492]">
              <Sparkles className="w-6 h-6" />
              <span className="text-xs tracking-[0.3em] uppercase">
                Breach Challenge Proposal
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Pitch Your Real-World Breach Scenario
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              Help us craft hands-on breach simulations rooted in actual
              systems. Share context, impact, and supporting resources so we can
              transform your idea into the next GlitchOps challenge.
            </p>
            <ul className="grid gap-3 md:grid-cols-3 text-sm text-gray-300">
              {guidelines.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 bg-black/30 border border-[#00d492]/20 rounded-lg px-4 py-3"
                >
                  <Lightbulb className="w-4 h-4 text-[#00d492] mt-1 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="flex flex-row gap-8">
          <div className="bg-black/40 border w-[60%] border-[#00d492]/30 rounded-2xl p-8 lg:p-10 backdrop-blur-md">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#00d492]/20">
                  <Send className="w-8 h-8 text-[#00d492]" />
                </div>
                <h2 className="text-3xl font-semibold text-[#00d492]">
                  Proposal queued!
                </h2>
                <p className="text-gray-300 max-w-xl mx-auto">
                  We'll take a close look at your breach scenario and follow up
                  through the contact links you provided. You can submit another
                  idea anytime.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Button variant="outline" onClick={handleReset}>
                    Share another proposal
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 text-[#00d492] mb-8">
                  <FileText className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold text-white">
                    Proposal details
                  </h2>
                </div>

                {error ? (
                  <div className="mb-6 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-2" htmlFor="fullName">
                      <span className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">
                        Full name
                      </span>
                      <Input
                        id="fullName"
                        placeholder="Your name"
                        autoComplete="name"
                        className="!bg-[#00d492]/10 !focus:ring-0 !focus:border-0 !focus:outline-none !cursor-not-allowed !pointer-events-none"
                        value={formState.name}
                        readOnly
                        required
                      />
                    </label>

                    <label className="space-y-2" htmlFor="email">
                      <span className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">
                        Email (auto-fills)
                      </span>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={formState.email}
                        className="!bg-[#00d492]/10 !focus:ring-0 !focus:border-0 !focus:outline-none !cursor-not-allowed !pointer-events-none"
                        readOnly
                        required
                      />
                    </label>
                  </div>
                  <div className="flex flex-col gap-6">
                    <label className="space-y-2">
                      <span className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">
                        Challenge title
                      </span>
                      <Input
                        placeholder="e.g. Zero Trust Collapse in Edge Network"
                        value={formState.challengeTitle}
                        onChange={(event) =>
                          handleChange("challengeTitle", event.target.value)
                        }
                        required
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">
                        Challenge description
                      </span>
                      <Textarea
                        rows={6}
                        className="resize-none"
                        placeholder="Outline the breach scenario, key systems, vulnerabilities, and expected outcomes."
                        value={formState.challengeDescription}
                        onChange={(event) =>
                          handleChange(
                            "challengeDescription",
                            event.target.value
                          )
                        }
                        required
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">
                        Document link (detailed brief)
                      </span>
                      <Input
                        type="url"
                        placeholder="https://docs.google.com/..."
                        value={formState.documentLink}
                        onChange={(event) =>
                          handleChange("documentLink", event.target.value)
                        }
                        required
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">
                        Reference project URL
                      </span>
                      <Input
                        type="url"
                        placeholder="https://github.com/org/project"
                        value={formState.referenceUrl}
                        onChange={(event) =>
                          handleChange("referenceUrl", event.target.value)
                        }
                        required
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">
                        Send proposal link (contact or follow-up form)
                      </span>
                      <Input
                        type="url"
                        placeholder="https://cal.com/your-team/breach-brief"
                        value={formState.proposalLink}
                        onChange={(event) =>
                          handleChange("proposalLink", event.target.value)
                        }
                        required
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[200px] cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "Submitting..." : "Submit proposal"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="cursor-pointer"
                      onClick={handleReset}
                      disabled={isSubmitting}
                    >
                      <LinkIcon className="w-4 h-4" />
                      Reset form
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>

          <aside className="bg-black/40 border w-[40%] border-[#00d492]/30 rounded-2xl p-6 lg:p-7 backdrop-blur-md">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3 text-[#00d492]">
                <Clock className="w-5 h-5" />
                <h2 className="text-xl font-semibold text-white lg:text-2xl">
                  Past proposals
                </h2>
              </div>
              <span className="text-xs uppercase tracking-[0.28em] text-gray-500">
                Track review progress
              </span>
            </div>

            <div className="mb-4">
              <label className="sr-only" htmlFor="proposal-search">
                Search proposals
              </label>
              <div className="relative">
                <Input
                  id="proposal-search"
                  placeholder="Search by challenge title"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pr-11"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 size-8 text-[#00d492] hover:text-[#00d492]/80"
                  onClick={() => setSearchTerm((value) => value.trim())}
                >
                  <Search className="size-4" />
                  <span className="sr-only">Search proposals</span>
                </Button>
              </div>
            </div>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-10 text-[#00d492]">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-3 text-sm text-gray-300">
                  Loading proposal history...
                </span>
              </div>
            ) : historyError ? (
              <div className="flex items-center gap-3 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <AlertCircle className="w-5 h-5" />
                <span>{historyError}</span>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="rounded-lg border border-[#00d492]/20 bg-black/30 px-4 py-6 text-sm text-gray-400">
                {searchTerm.trim()
                  ? "No proposals match this search."
                  : "No proposals yet. Share a scenario to see it listed here with its review status."}
              </div>
            ) : (
              <div className="max-h-[460px] space-y-4 overflow-y-auto pr-2">
                {filteredHistory.map((proposal) => {
                  const normalisedStatus = proposal.status.replace(/_/g, " ");
                  const key = normalisedStatus.toLowerCase();

                  const statusClasses: Record<string, string> = {
                    rejected: "bg-rose-500/15 text-rose-300 border-rose-500/30",
                    approved:
                      "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                    "in review": "bg-sky-500/15 text-sky-300 border-sky-500/30",
                    "needs info":
                      "bg-orange-500/15 text-orange-300 border-orange-500/30",
                  };

                  const badgeClass =
                    statusClasses[key] ??
                    "bg-slate-500/20 text-slate-200 border-slate-500/30";

                  const formatTimestamp = (value: string | null) => {
                    if (!value) return "Date pending";
                    const date = new Date(value);
                    if (Number.isNaN(date.getTime())) return "Date pending";
                    return date.toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  };

                  const linkItems = [
                    proposal.documentLink
                      ? { label: "Brief", href: proposal.documentLink }
                      : null,
                    proposal.referenceUrl
                      ? { label: "Reference", href: proposal.referenceUrl }
                      : null,
                    proposal.proposalLink
                      ? { label: "Follow-up", href: proposal.proposalLink }
                      : null,
                  ].filter(Boolean) as { label: string; href: string }[];

                  return (
                    <article
                      key={proposal.id}
                      className="rounded-xl border border-[#00d492]/20 bg-black/30 px-5 py-5"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-2">
                            <p className="rounded-l-lg text-xs uppercase tracking-[0.22em] text-emerald-300">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="block max-w-[6rem] truncate text-white text-[14px] font-semibold text-ellipsis">
                                    {proposal.title}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="bg-black/80 p-2"
                                >
                                  Contest title: {proposal.title}
                                </TooltipContent>
                              </Tooltip>
                            </p>
                            <p className="text-xs uppercase tracking-[0.32em] text-gray-500">
                              {formatTimestamp(proposal.createdAt)}
                            </p>
                          </div>
                          <span
                            className={`self-start rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClass}`}
                          >
                            {normalisedStatus}
                          </span>
                        </div>

                        {linkItems.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {linkItems.map((item) => (
                              <a
                                key={`${proposal.id}-${item.label}`}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-md border border-[#00d492]/30 bg-black/40 px-3 py-2 text-[11px] font-semibold text-[#00d492] transition-colors hover:border-[#00d492]/60 hover:text-[#00d492]/90"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                {item.label}
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default BreachProposalPage;
