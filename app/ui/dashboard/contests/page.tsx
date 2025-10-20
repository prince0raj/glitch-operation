"use client";
import { Trophy, Calendar, Users, Zap, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContestsPage() {
  const router = useRouter();

  const contests = [
    {
      id: 1,
      title: "SQL Injection Hunt",
      difficulty: "Medium",
      participants: 1234,
      deadline: "2025-11-15",
      reward: "500 XP",
      status: "Active",
      description: "Find SQL injection vulnerabilities in our mock e-commerce platform",
    },
    {
      id: 2,
      title: "XSS Challenge",
      difficulty: "Hard",
      participants: 892,
      deadline: "2025-11-20",
      reward: "750 XP",
      status: "Active",
      description: "Identify and exploit cross-site scripting vulnerabilities",
    },
    {
      id: 3,
      title: "API Security Test",
      difficulty: "Easy",
      participants: 2156,
      deadline: "2025-11-10",
      reward: "300 XP",
      status: "Active",
      description: "Test API endpoints for authentication and authorization flaws",
    },
    {
      id: 4,
      title: "Authentication Bypass",
      difficulty: "Hard",
      participants: 567,
      deadline: "2025-11-25",
      reward: "1000 XP",
      status: "Active",
      description: "Attempt to bypass authentication mechanisms in various scenarios",
    },
    {
      id: 5,
      title: "CSRF Exploitation",
      difficulty: "Medium",
      participants: 745,
      deadline: "2025-10-05",
      reward: "400 XP",
      status: "Ended",
      description: "Discover and exploit CSRF vulnerabilities in web applications",
    },
  ];

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
          {contests.map((contest, idx) => (
            <div
              key={contest.id}
              className="bg-black/30 border border-[#00d492]/30 rounded-xl p-6 backdrop-blur-sm hover:border-[#00d492]/60 hover:shadow-[0_0_20px_rgba(0,255,174,0.3)] transition-all cursor-pointer animate-slideUp"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => router.push(`/ui/contests/${contest.id}`)}
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
                {contest.description}
              </p>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4 text-[#00d492]" />
                  <span>{contest.participants.toLocaleString()} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4 text-[#00d492]" />
                  <span>Ends: {contest.deadline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Zap className="w-4 h-4 text-[#00d492]" />
                  <span className="text-[#00d492] font-bold">
                    {contest.reward}
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-[#00d492]/10 border border-[#00d492]/30 rounded-lg py-2 text-[#00d492] hover:bg-[#00d492]/20 transition-all">
                <span className="text-sm font-semibold">View Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
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
