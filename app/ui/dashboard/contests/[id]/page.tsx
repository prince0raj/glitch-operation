"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Calendar,
  Users,
  Zap,
  ArrowLeft,
  Send,
  AlertCircle,
} from "lucide-react";
import { Preloader } from "@/app/commonComponents/Preloader/Preloader";
import { useFetch } from "@/app/hook/useFetch";

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params.id as string | undefined;

  type Contest = {
    id: string;
    title: string;
    difficulty: string;
    participants: number;
    deadline: string | null;
    reward: number;
    status: string;
    description: string | null;
    requirements: string[] | null;
    target_url: string | null;
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

  const requirements = useMemo(() => {
    return Array.isArray(contest?.requirements)
      ? contest?.requirements.filter(
          (req) => typeof req === "string" && req.trim().length > 0
        )
      : [];
  }, [contest?.requirements]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Bug Report Submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      router.push("/ui/dashboard/contests");
    }, 2000);
  };

  const handleReset = () => {
    setFormData(createInitialFormData());
    setSubmitted(false);
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
                    <span className="text-xs text-gray-400">Participants</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {Number(contest.participants || 0).toLocaleString()}
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

              {contest.target_url ? (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-[#00d492] mb-2">
                    Target URL
                  </h3>
                  <a
                    href={contest.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00d492] underline break-all"
                  >
                    {contest.target_url}
                  </a>
                </div>
              ) : null}

              {/* Requirements */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#00d492] mb-3">
                  Requirements
                </h3>
                {requirements.length > 0 ? (
                  <ul className="space-y-2">
                    {requirements.map((req, idx) => (
                      <li
                        key={`${req}-${idx}`}
                        className="flex items-start gap-2 text-gray-400"
                      >
                        <span className="text-[#00d492] mt-1">▸</span>
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
            </div>

            {/* Bug Submission Form */}
            {submitted ? (
              <div className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-8 backdrop-blur-sm text-center">
                <div className="w-16 h-16 bg-[#00d492]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-[#00d492]" />
                </div>
                <h2 className="text-2xl font-bold text-[#00d492] mb-2">
                  Bug Report Submitted!
                </h2>
                <p className="text-gray-400">
                  Thank you for your submission. Redirecting to contests page...
                </p>
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
                      rows={6}
                      placeholder="Paste the exploit code, payload, or response data you obtained..."
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
                      className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-[#00d492] text-black font-bold py-3 rounded-lg hover:bg-[#00d492]/80 transition-all"
                    >
                      <Send className="w-5 h-5" />
                      Submit Bug Report
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 bg-black/40 cursor-pointer border border-[#00d492]/30 text-[#00d492] rounded-lg hover:bg-black/60 transition-all"
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
