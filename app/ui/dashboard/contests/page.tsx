"use client";
import { Trophy, Calendar, Users, Zap, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Preloader } from "@/app/commonComponents/Preloader/Preloader";
import { useFetch } from "@/app/hook/useFetch";

type Contest = {
  id: string;
  title: string;
  difficulty: string;
  deadline: string | null;
  reward: number;
  status: string;
  short_desc: string | null;
  submissions: number;
};

type ContestsResponse = {
  contests?: Contest[];
  error?: string;
};

export default function ContestsPage() {
  const router = useRouter();

  const {
    data,
    loading,
    error: fetchError,
  } = useFetch<ContestsResponse>("/api/v1/contests");

  const contests = useMemo(() => {
    if (!data?.contests) {
      return [] as Contest[];
    }
    return data.contests;
  }, [data?.contests]);

  const normalizedError = fetchError ?? data?.error ?? null;

  const orderedContests = useMemo(() => {
    return [...contests].sort((a, b) => {
      const aTime = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const bTime = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return aTime - bTime;
    });
  }, [contests]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      case "Medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "Hard":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  return (
    <section className="relative min-h-screen bg-[#05060a] text-white font-mono pt-32 pb-10">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a0f1c_0%,_#000_100%)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(#00d49240_1px,transparent_1px),linear-gradient(90deg,#00d49240_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 animate-[pulseGrid_4s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold text-[#00d492] mb-4 flex items-center gap-3">
            <Trophy className="w-12 h-12" />
            Active Contests
          </h1>
          <p className="text-gray-400 text-lg">
            Participate in bug hunting contests and earn rewards
          </p>
        </div>

        {/* Contests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full">
              <Preloader message="Fetching contests" />
            </div>
          ) : normalizedError ? (
            <div className="col-span-full text-center text-red-400 text-sm">
              {normalizedError}
            </div>
          ) : orderedContests.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-sm">
              No contests available yet.
            </div>
          ) : (
            orderedContests.map((contest, idx) => (
              <div
                key={contest.id}
                className="bg-black/30 border border-[#00d492]/30 rounded-xl p-6 backdrop-blur-sm hover:border-[#00d492]/60 hover:shadow-[0_0_20px_rgba(0,255,174,0.3)] transition-all animate-slideUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
                // onClick={() => router.push(`/ui/dashboard/contests/${contest.slug}`)}
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                      contest.difficulty
                    )}`}
                  >
                    {contest.difficulty}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      contest.status === "Active"
                        ? "bg-[#00d492]/20 text-[#00d492]"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {contest.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {contest.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {contest.short_desc ??
                    "Join to learn more about this contest."}
                </p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4 text-[#00d492]" />
                    <span>Submissions : {contest.submissions || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4 text-[#00d492]" />
                    <span>
                      Ends:{" "}
                      {contest.deadline
                        ? new Date(contest.deadline).toLocaleDateString()
                        : "No deadline"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 text-[#00d492]" />
                    <span className="text-[#00d492] font-bold">
                      {Number(contest.reward || 0)} XP
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/ui/dashboard/contests/${contest.id}`);
                  }}
                  className="w-full cursor-pointer flex items-center justify-center gap-2 bg-[#00d492]/10 border border-[#00d492]/30 rounded-lg py-2 text-[#00d492] hover:bg-[#00d492]/20 transition-all"
                >
                  <span className="text-sm font-semibold">View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulseGrid {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
