"use client";
import { useEffect, useMemo, useState } from "react";
import {
  User,
  Target,
  Bug,
  Award,
  TrendingUp,
  Edit2,
  Save,
  X,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/app/hook/useFetch";
import { Preloader } from "@/app/commonComponents/Preloader/Preloader";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [metrics, setMetrics] = useState<{
    Challenges: number;
    Bugs_found: number;
    Unsuccessful_attempts: number;
    Level: number;
    score: number;
    rank: number;
    xpTarget: number;
  } | null>(null);
  const [activities, setActivities] = useState<
    Array<{
      contest_id: string;
      title: string | null;
      status: string;
      submission_time: string | null;
      reward: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(activities.length / pageSize)),
    [activities.length]
  );
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activities.slice(start, start + pageSize);
  }, [activities, currentPage]);

  const BIO_CHAR_LIMIT = 150;

  const {
    data: getData,
    error: getError,
    loading: getLoading,
  } = useFetch<{ profile: any; stats: any; recentActivities: any }>(
    "/api/v1/profile"
  );

  useEffect(() => {
    if (getError) setError(getError);
  }, [getError]);

  useEffect(() => {
    if (!getData?.profile) return;
    // console.log(getData);

    const profile = getData.profile;
    setUsername(profile?.username || "");
    setTitle(profile?.tag_line || "");
    setBio(profile?.bio || "");
    setMetrics({
      Challenges: getData.stats.totalAttempts,
      Bugs_found: getData.stats.successfulAttempts,
      Unsuccessful_attempts: getData.stats.failedAttempts,
      score: getData.profile.totalXPAchieved,
      Level: Math.max(getData.profile.totalXPAchieved / 1000, 1),
      rank: getData.profile.rank,
      xpTarget: getData.profile.maxLevelXP,
    });
    setLevel(getData.profile.currentLevel);
    setScore(getData.profile.totalXPAchieved);
    const act = getData?.recentActivities ?? [];
    const normalisedActivities = Array.isArray(act)
      ? act.map((item: any) => ({
          contest_id: String(item?.contest?.id ?? ""),
          title: item?.contest?.title ? String(item?.contest?.title) : null,
          status: String(item?.status ?? ""),
          submission_time: item?.created_at ? String(item.created_at) : null,
          reward: Number(item?.contest?.reward ?? 0) || 0,
        }))
      : [];
    setActivities(normalisedActivities);
  }, [getData]);

  useEffect(() => {
    setLoading(getLoading);
  }, [getLoading]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [activities.length, totalPages]);

  const xpTarget = Number(metrics?.xpTarget ?? 0);
  const progressPercent = useMemo(() => {
    if (
      !Number.isFinite(score) ||
      !Number.isFinite(xpTarget) ||
      xpTarget <= 0
    ) {
      return "0%";
    }
    const pct = Math.max(0, Math.min(100, (score / xpTarget) * 100));
    return `${pct}%`;
  }, [score, xpTarget]);

  const formatTimestamp = (value: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const pad = (input: number) => input.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  };

  const {
    refetch: saveProfile,
    loading: saving,
    error: saveError,
  } = useFetch<{ profile: any }>("/api/v1/profile", {
    method: "PUT",
    manual: true,
  });

  useEffect(() => {
    if (saveError) setError(saveError);
  }, [saveError]);

  const handleSave = async () => {
    const body = {
      bio,
      tag_line: title,
    };

    await saveProfile({ body });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally reset to original values
  };

  return (
    <section className="relative min-h-screen bg-[#05060a] text-white font-mono">
      {saving && (
        <div className="absolute top-0 left-0 right-0 z-40 h-1 overflow-hidden bg-[#00d492]/20">
          <div className="h-full w-full bg-[#00d492] animate-progressLoader" />
        </div>
      )}
      {loading && !error && (
        <Preloader
          variant="overlay"
          message="Loading profile"
          className="bg-[#05060a]/95"
        />
      )}
      {/* Background neon grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a0f1c_0%,_#000_100%)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(#00d49240_1px,transparent_1px),linear-gradient(90deg,#00d49240_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 animate-[pulseGrid_4s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-20 animate-[matrixFlow_15s_linear_infinite]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 mt-20">
        {/* Profile Header - Fade in animation */}
        <div className="animate-fadeIn">
          {/* Edit/Save/Cancel Buttons */}
          <div className="flex justify-end mb-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-[#00d492]/10 border border-[#00d492]/30 rounded-lg text-[#00d492] hover:bg-[#00d492]/20 transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-[#00d492] text-black rounded-lg hover:bg-[#00d492]/80 transition-all font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
            {/* Avatar with pulse animation */}
            <div className="relative animate-scaleIn">
              <div className="w-40 h-40 rounded-full border-4 border-[#00d492]/60 flex items-center justify-center bg-black/60 shadow-[0_0_2px_#00d492] animate-glow">
                <User className="w-16 h-16 text-[#00d492]" />
              </div>
              <div className="absolute -bottom-2 -right-[-20px] bg-[#00d492] text-black font-bold px-3 py-1 rounded-lg text-sm shadow-[0_0_3px_#00d492]">
                {level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {/* Username */}
              <h1 className="text-5xl font-bold text-[#00d492] mb-2">
                {username}
              </h1>

              {/* Title */}
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  placeholder="place your tagline"
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-sm my-2 text-gray-400 mb-3 bg-black/40 border border-[#00d492]/30 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-[#00d492]"
                />
              ) : (
                <p className="text-gray-400 text-lg mb-3">{title}</p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-2 text-[#00d492]/80 mb-4">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">
                  Rank #{metrics?.rank ?? 0} Globally
                </span>
              </div>

              {/* Bio */}
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="BIO.."
                  rows={3}
                  className="text-sm text-gray-400 mb-6 mx-auto md:mx-0 leading-relaxed bg-black/40 border border-[#00d492]/30 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-[#00d492] resize-none"
                />
              ) : (
                <div className="mb-6 mx-auto md:mx-0">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {bio.length > BIO_CHAR_LIMIT && !isExpanded
                      ? `${bio.substring(0, BIO_CHAR_LIMIT)}...`
                      : bio}
                  </p>
                  {bio.length > BIO_CHAR_LIMIT && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-[#00d492] text-sm mt-2 hover:text-[#00d492]/80 transition-colors font-semibold"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              )}

              {/* XP Progress Bar with animation */}
              <div className="space-y-2 max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Level {level}</span>
                  <span className="text-[#8b5cf6]">
                    {score} / {xpTarget} XP
                  </span>
                </div>
                <div className="relative h-2 bg-black/60 rounded-full overflow-hidden border border-[#8b5cf6]/30">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-full shadow-[0_0_10px_#8b5cf6]"
                    style={{ width: progressPercent }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards with staggered animation */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div
            className="bg-black/30 border border-[#00d492]/30 rounded-xl p-6 backdrop-blur-sm hover:border-[#00d492]/60 hover:shadow-[0_0_20px_rgba(0,255,174,0.3)] transition-all animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-[#00d492]" />
              <span className="text-4xl font-bold text-[#00d492] animate-countUp">
                {metrics?.Challenges ?? 0}
              </span>
            </div>
            <h3 className="text-sm text-gray-400">Challenges</h3>
          </div>

          <div
            className="bg-black/30 border border-[#00d492]/30 rounded-xl p-6 backdrop-blur-sm hover:border-[#00d492]/60 hover:shadow-[0_0_20px_rgba(0,255,174,0.3)] transition-all animate-slideUp"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-between mb-2">
              <Bug className="w-8 h-8 text-[#00d492]" />
              <span className="text-4xl font-bold text-[#00d492] animate-countUp">
                {metrics?.Bugs_found ?? 0}
              </span>
            </div>
            <h3 className="text-sm text-gray-400">Bugs Found</h3>
          </div>

          <div
            className="bg-black/30 border border-[#00d492]/30 rounded-xl p-6 backdrop-blur-sm hover:border-[#00d492]/60 hover:shadow-[0_0_20px_rgba(0,255,174,0.3)] transition-all animate-slideUp"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center justify-between mb-2">
              <RefreshCcw className="w-8 h-8 text-[#00d492]" />
              <span className="text-4xl font-bold text-[#00d492] animate-countUp">
                {metrics?.Unsuccessful_attempts ?? 0}
              </span>
            </div>
            <h3 className="text-sm text-gray-400">Retry Opportunities</h3>
          </div>
        </div>

        {/* Recent Activity with fade animation */}
        <div
          className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-6 backdrop-blur-sm"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-2xl font-bold text-[#00d492] mb-6">
            Recent Activity
          </h2>
          {activities.length === 0 ? (
            <div className="bg-black/50 border border-dashed border-[#00d492]/30 p-6 rounded-lg text-center flex flex-col items-center gap-4">
              <p className="text-gray-400 text-sm">
                No recent activity yet. Join a contest to get started!
              </p>
              <button
                type="button"
                onClick={() => router.push("/ui/dashboard/contests")}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-[#00d492]/10 border border-[#00d492]/30 rounded-lg text-[#00d492] hover:bg-[#00d492]/20 transition-all"
              >
                Explore Contests
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedActivities.map((activity, idx) => {
                const isPass = activity.status.toLowerCase() === "pass";
                const formattedTime = formatTimestamp(activity.submission_time);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/ui/dashboard/contests/${activity.contest_id}`
                      )
                    }
                    className="w-full text-left bg-black/50 border border-[#00d492]/20 p-4 rounded-lg flex justify-between items-center hover:border-[#00d492]/50 hover:shadow-[0_0_10px_rgba(0,255,174,0.2)] transition-all cursor-pointer"
                    style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                  >
                    <div className="flex flex-col">
                      <span className="text-gray-300 font-semibold">
                        {activity.title || "Unknown Contest"}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {activity.contest_id || "Unknown"}
                      </span>
                      {Number.isFinite(activity.reward) &&
                        activity.reward > 0 && (
                          <span className="text-xs text-gray-500">
                            Reward: {activity.reward}
                          </span>
                        )}
                      {formattedTime && (
                        <span className="text-xs text-gray-500">
                          Submitted: {formattedTime}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold flex items-center gap-1 ${
                        isPass ? "text-[#00d492]" : "text-red-400"
                      }`}
                    >
                      {isPass ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {activity.status || "Unknown"}
                    </span>
                  </button>
                );
              })}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-[#00d492]/30 text-[#00d492] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00d492]/10 transition-colors"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-[#00d492]/30 text-[#00d492] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00d492]/10 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes matrixFlow {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 1000px;
          }
        }
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
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
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
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px #00d492;
          }
          50% {
            box-shadow: 0 0 5px #00d492, 0 0 5px #00d492;
          }
        }
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 84%;
          }
        }
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressLoader {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(-10%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-slideRight {
          opacity: 0;
          animation: slideRight 0.5s ease-out forwards;
        }
        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 0.7s ease-out forwards;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-progressBar {
          animation: progressBar 1.5s ease-out forwards;
        }
        .animate-countUp {
          animation: countUp 0.8s ease-out forwards;
        }
        .animate-progressLoader {
          animation: progressLoader 1.2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
