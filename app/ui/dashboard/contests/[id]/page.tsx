"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Calendar,
  Users,
  Zap,
  ArrowLeft,
  Send,
  AlertCircle,
  Linkedin,
  Crosshair,
  PartyPopper,
  Loader2,
  Frown,
  LocateOff,
} from "lucide-react";
import { Preloader } from "@/app/commonComponents/Preloader/Preloader";
import { useFetch } from "@/app/hook/useFetch";
import Link from "next/link";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { toast } from "sonner";

type Creator = {
  profiles: {
    username: string;
    social_id: string;
  };
};

const normalizeProfileUrl = (value: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const extractInitials = (value: string) => {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  if (initials) {
    return initials;
  }

  return value.slice(0, 2).toUpperCase() || "??";
};

const extractHostname = (value: string) => {
  if (!value) return "";
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, "");
    return hostname;
  } catch (error) {
    return value.replace(/^https?:\/\//i, "");
  }
};

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params.id as string | undefined;

  type Contest = {
    creators: Creator[];
    id: string;
    title: string;
    difficulty: string;
    deadline: string | null;
    reward: number;
    status: string;
    description: string | null;
    requirements: string[] | null;
    target_url: string | null;
    submissions: number;
  };

  const [contest, setContest] = useState<Contest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createInitialFormData = () => ({
    bugTitle: "",
    severity: "Medium",
    stepsFollowedToBreak: "",
    codeObtainedByBreaking: "",
    stepsToImprove: "",
    proofOfConcept: "",
  });

  const [formData, setFormData] = useState(createInitialFormData);

  const [submitted, setSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<boolean | null>(
    null
  );
  const [submissionMessage, setSubmissionMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    loading,
    error: fetchError,
  } = useFetch<{
    contest?: Contest;
    error?: string;
  }>(contestId ? `/api/v1/contests/${contestId}` : null);

  useEffect(() => {
    if (data?.contest) {
      setContest(data.contest);
      setError(null);
    } else if (data?.error) {
      setContest(null);
      setError(data.error);
    }
  }, [data?.contest, data?.error]);

  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError]);

  const handleStartMission = useCallback(() => {
    if (!contest) return;

    const payload = {
      creator: contest.creators,
      id: contest.id,
      title: contest.title,
      target_url: contest.target_url,
    };

    try {
      sessionStorage.setItem(
        "ops.glitch.startMission",
        JSON.stringify(payload)
      );
    } catch (storageError) {
      console.error("Failed to persist mission payload", storageError);
    }

    router.push("/ui/start-mission");
  }, [contest, router]);

  const requirements = useMemo(() => {
    return Array.isArray(contest?.requirements)
      ? contest?.requirements.filter(
          (req) => typeof req === "string" && req.trim().length > 0
        )
      : [];
  }, [contest?.requirements]);

  const creatorProfiles = useMemo(() => {
    const rawCreators = Array.isArray(contest?.creators)
      ? contest?.creators
      : contest?.creators
      ? [contest.creators]
      : [];

    return rawCreators
      .map((rawCreator) => {
        const name =
          typeof rawCreator?.profiles?.username === "string"
            ? rawCreator?.profiles?.username.trim()
            : "";
        const rawUrl =
          typeof rawCreator?.profiles?.social_id === "string"
            ? rawCreator?.profiles?.social_id.trim()
            : "";
        const href = normalizeProfileUrl(rawUrl);

        return {
          name,
          initials: name ? extractInitials(name) : "??",
          href,
          hostname: href ? extractHostname(href) : "",
        };
      })
      .filter((profile) => profile.name || profile.href);
  }, [contest?.creators]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await submitChallenge();
      if (result) {
        setSubmissionStatus(!!result.status);
        setSubmissionMessage(result.message || "");
      }
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitChallenge = async (): Promise<
    { message?: string; status?: boolean } | undefined
  > => {
    try {
      if (!contestId) {
        toast.error("Contest ID is missing.");
        return;
      }

      const payload = {
        improvements: formData.stepsToImprove,
        uniqueCode: formData.codeObtainedByBreaking,
        steps: formData.stepsFollowedToBreak,
      };

      const response = await fetch(`/api/v1/contests/${contestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const respData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          respData?.error || respData?.message || "Failed to submit challenge."
        );
      }

      if (respData?.status) {
        toast.success(respData?.message || "Challenge passed!");
      } else {
        toast.info(
          respData?.message || "Challenge submitted, but did not pass."
        );
      }

      return respData as { message?: string; status?: boolean };
    } catch (error: any) {
      toast.error(
        error.message || "Something went wrong while submitting the challenge."
      );
      return undefined;
    }
  };

  const handleReset = () => {
    setFormData(createInitialFormData());
    setSubmitted(false);
    setSubmissionStatus(null);
    setSubmissionMessage("");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-400";
      case "High":
        return "text-orange-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <section className="relative min-h-screen bg-[#05060a] text-white font-mono pt-24 pb-10">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a0f1c_0%,_#000_100%)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(#00d49240_1px,transparent_1px),linear-gradient(90deg,#00d49240_1px,transparent_1px)] bg-[size:50px_50px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/ui/dashboard/contests")}
          className="flex cursor-pointer items-center gap-2 text-[#00d492] hover:text-[#00d492]/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Contests</span>
        </button>

        {loading ? (
          <Preloader message="Fetching contest" />
        ) : error ? (
          <div className="bg-black/30 border border-red-400/40 rounded-2xl p-8 backdrop-blur-sm text-center text-red-400">
            {error}
          </div>
        ) : !contest ? (
          <div className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-8 backdrop-blur-sm text-center text-gray-400">
            Contest not found.
          </div>
        ) : (
          <>
            {/* Contest Header */}
            <div className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-8 mb-8 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-[#00d492] mb-2 flex items-center gap-3">
                    <Trophy className="w-10 h-10" />
                    {contest.title}
                  </h1>
                  <p className="text-gray-400 text-lg">
                    {contest.description ??
                      "Join this contest to show your skills."}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    contest.status === "Active"
                      ? "bg-[#00d492]/20 text-[#00d492] border border-[#00d492]/30"
                      : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                  }`}
                >
                  {contest.status}
                </span>
              </div>

              {/* Contest Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-black/40 rounded-lg p-4 border border-[#00d492]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-[#00d492]" />
                    <span className="text-xs text-gray-400">Submissions</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {contest.submissions || 0}
                  </p>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-[#00d492]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-[#00d492]" />
                    <span className="text-xs text-gray-400">Deadline</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {contest.deadline
                      ? new Date(contest.deadline).toLocaleDateString()
                      : "No deadline"}
                  </p>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-[#00d492]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-[#00d492]" />
                    <span className="text-xs text-gray-400">Reward</span>
                  </div>
                  <p className="text-2xl font-bold text-[#00d492]">
                    {Number(contest.reward || 0)} XP
                  </p>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-[#00d492]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-[#00d492]" />
                    <span className="text-xs text-gray-400">Difficulty</span>
                  </div>
                  <p className="text-lg font-bold text-yellow-400">
                    {contest.difficulty}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="relative overflow-hidden rounded-2xl border border-[#00d492]/25 bg-black/40 p-5 md:flex md:items-center md:justify-between gap-5">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00d492]/10 via-transparent to-transparent opacity-40" />
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#00d492]/35 bg-[#00d492]/10 text-[#00d492] shadow-[0_0_18px_rgba(0,212,146,0.18)]">
                      <Crosshair className="h-6 w-6" strokeWidth={2.6} />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-xl font-bold font-mono text-white uppercase tracking-[0.25em]">
                        Start Mission
                      </h3>
                      <p className="text-xs uppercase tracking-[0.4em] text-[#00d492]/70">
                        Engage Target
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-4 flex flex-col sm:flex-row md:mt-0 md:items-center gap-3">
                    <button
                      type="button"
                      onClick={handleStartMission}
                      disabled={!contest}
                      className="group cursor-pointer relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#00d492]/50 bg-[#00d492]/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-[#00d492] transition-all hover:bg-[#00d492]/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#00d492]/20 via-transparent to-[#00d492]/25 opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className="relative z-10">Launch</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-bold text-[#00d492] mb-3">
                  Requirements
                </h3>
                {requirements.length > 0 ? (
                  <ul className="space-y-2">
                    {requirements.map((req, idx) => (
                      <li
                        key={`${req}-${idx}`}
                        className="flex items-baseline gap-2 text-gray-400"
                      >
                        <span className="text-[#00d492] mb-1">▸</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">
                    No specific requirements provided.
                  </p>
                )}
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold text-[#00d492] mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00d492]" />
                  Contest Creators
                </h3>
                {creatorProfiles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {creatorProfiles.map((profile, index) => (
                      <div
                        key={`${profile.name}-${profile.href}-${index}`}
                        className="group relative w-full overflow-hidden rounded-xl border border-[#00d492]/20 bg-black/40 p-2 transition-colors hover:border-[#00d492]/40 max-w-[360px]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00d492]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-full border border-[#00d492]/30 bg-[#00d492]/10 text-lg font-semibold text-[#00d492]">
                              {profile.initials}
                            </div>
                            <div>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="text-sm font-semibold text-white block max-w-[130px] truncate overflow-hidden whitespace-nowrap">
                                    {profile.name || "Anonymous Creator"}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  {profile.name || "Anonymous Creator"}
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="text-xs text-gray-400 block max-w-[130px] truncate overflow-hidden whitespace-nowrap">
                                    {profile.hostname || "Profile details"}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  {profile.hostname || "Anonymous Creator"}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          {profile.href ? (
                            <Link
                              href={profile.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-lg border border-[#00d492]/40 bg-[#00d492]/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#00d492] transition-colors hover:bg-[#00d492]/20"
                            >
                              <Linkedin className="h-4 w-4" />
                              View Profile
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">
                    Creator information is not available for this contest.
                  </p>
                )}
              </div>
            </div>

            {/* Bug Submission Form */}
            {submitted ? (
              <div className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-8 backdrop-blur-sm text-center">
                <div className="w-16 h-16 bg-[#00d492]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {submissionStatus === true ? (
                    <PartyPopper
                      className="w-8 h-8 text-[#00d492]"
                      aria-label="Passed"
                    />
                  ) : submissionStatus == false ? (
                    <LocateOff
                      className="w-8 h-8 text-[#d40000]"
                      aria-label="Failed"
                    />
                  ) : (
                    <Send
                      className="w-8 h-8 text-[#00d492]"
                      aria-label="Submitted"
                    />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#00d492] mb-2">
                  Bug Report Submitted!
                </h2>
                <p className="text-gray-400">
                  {submissionMessage || "Thank you for your submission."}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    submissionStatus === true
                      ? "text-emerald-400"
                      : submissionStatus === false
                      ? "text-[#d40000]"
                      : "text-gray-400"
                  }`}
                >
                  {submissionStatus === true
                    ? "You passed the challenge."
                    : submissionStatus === false
                    ? "You didn't pass the challenge."
                    : ""}
                </p>
                <div className="h-6" />
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/ui/dashboard/contests")}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 bg-[#00d492] text-black font-bold px-5 py-3 rounded-lg hover:bg-[#00d492]/80 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Go to Contests
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-[#00d492] mb-6">
                  Submit Bug Report
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Steps Followed to Break the Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Steps Followed to Break the Code *
                    </label>
                    <textarea
                      name="stepsFollowedToBreak"
                      value={formData.stepsFollowedToBreak}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      rows={5}
                      placeholder="1. Identified the vulnerable endpoint&#10;2. Tested different payloads&#10;3. Successfully exploited the vulnerability..."
                      className="w-full bg-black/40 border border-[#00d492]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d492] transition-colors resize-none"
                    />
                  </div>

                  {/* Code Obtained by Breaking the Bug */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Code Obtained by Breaking the Bug *
                    </label>
                    <textarea
                      name="codeObtainedByBreaking"
                      value={formData.codeObtainedByBreaking}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      rows={1}
                      placeholder="Paste the exploit code (i.e 3c7340c526ca4a40ebf8a90d0d0de353) you obtained..."
                      className="w-full bg-black/40 border border-[#00d492]/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00d492] transition-colors resize-none"
                    />
                  </div>

                  {/* Steps to Improve It (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Steps to Improve It (Optional)
                    </label>
                    <textarea
                      name="stepsToImprove"
                      value={formData.stepsToImprove}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      rows={4}
                      placeholder="Suggest improvements or fixes to prevent this vulnerability..."
                      className="w-full bg-black/40 border border-[#00d492]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d492] transition-colors resize-none"
                    />
                  </div>

                  {/* Proof of Concept */}
                  {/* <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Proof of Concept (URL/Screenshots)
                    </label>
                    <input
                      type="text"
                      name="proofOfConcept"
                      value={formData.proofOfConcept}
                      onChange={handleChange}
                      placeholder="Paste URL to screenshots, video, or additional proof..."
                      className="w-full bg-black/40 border cursor-pointer border-[#00d492]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d492] transition-colors"
                    />
                  </div> */}

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-[#00d492] text-black font-bold py-3 rounded-lg hover:bg-[#00d492]/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Bug Report
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-black/40 cursor-pointer border border-[#00d492]/30 text-[#00d492] rounded-lg hover:bg-black/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
