"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Calendar,
  Users,
  Zap,
  ArrowLeft,
  Send,
  Upload,
  AlertCircle,
} from "lucide-react";

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params.id;

  const [formData, setFormData] = useState({
    bugTitle: "",
    severity: "Medium",
    stepsFollowedToBreak: "",
    codeObtainedByBreaking: "",
    stepsToImprove: "",
    proofOfConcept: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Mock contest data - in real app, this would be fetched based on contestId
  const contestsData: Record<string, any> = {
    "1": {
      id: 1,
      title: "SQL Injection Hunt",
      difficulty: "Medium",
      participants: 1234,
      deadline: "2025-11-15",
      reward: "500 XP",
      status: "Active",
      description:
        "Find SQL injection vulnerabilities in our mock e-commerce platform. Test various input fields, search functionality, and authentication mechanisms.",
      requirements: [
        "Provide detailed steps followed to break the code",
        "Include the code/payload obtained by breaking",
        "Attach proof of concept (screenshots/video)",
        "Optionally suggest improvement steps",
      ],
      targetUrl: "https://demo.example.com",
    },
    "2": {
      id: 2,
      title: "XSS Challenge",
      difficulty: "Hard",
      participants: 892,
      deadline: "2025-11-20",
      reward: "750 XP",
      status: "Active",
      description:
        "Identify and exploit cross-site scripting vulnerabilities in our web application.",
      requirements: [
        "Provide detailed steps followed to break the code",
        "Include the code/payload obtained by breaking",
        "Attach proof of concept (screenshots/video)",
        "Optionally suggest improvement steps",
      ],
      targetUrl: "https://xss-demo.example.com",
    },
    "3": {
      id: 3,
      title: "API Security Test",
      difficulty: "Easy",
      participants: 2156,
      deadline: "2025-11-10",
      reward: "300 XP",
      status: "Active",
      description:
        "Test API endpoints for authentication and authorization flaws. Identify weak API implementations, missing rate limiting, and improper access controls.",
      requirements: [
        "Provide detailed steps followed to break the code",
        "Include the code/payload obtained by breaking",
        "Attach proof of concept (screenshots/video)",
        "Optionally suggest improvement steps",
      ],
      targetUrl: "https://api-demo.example.com",
    },
    "4": {
      id: 4,
      title: "Authentication Bypass",
      difficulty: "Hard",
      participants: 567,
      deadline: "2025-11-25",
      reward: "1000 XP",
      status: "Active",
      description:
        "Attempt to bypass authentication mechanisms in various scenarios. Test JWT tokens, session management, OAuth flows, and multi-factor authentication.",
      requirements: [
        "Provide detailed steps followed to break the code",
        "Include the code/payload obtained by breaking",
        "Attach proof of concept (screenshots/video)",
        "Optionally suggest improvement steps",
      ],
      targetUrl: "https://auth-demo.example.com",
    },
    "5": {
      id: 5,
      title: "CSRF Exploitation",
      difficulty: "Medium",
      participants: 745,
      deadline: "2025-10-05",
      reward: "400 XP",
      status: "Ended",
      description:
        "Discover and exploit CSRF vulnerabilities in web applications. Test state-changing operations and identify missing CSRF protections.",
      requirements: [
        "Provide detailed steps followed to break the code",
        "Include the code/payload obtained by breaking",
        "Attach proof of concept (screenshots/video)",
        "Optionally suggest improvement steps",
      ],
      targetUrl: "https://csrf-demo.example.com",
    },
  };

  const contest = contestsData[contestId as string] || contestsData["1"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Bug Report Submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      router.push("/ui/contests");
    }, 2000);
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
          onClick={() => router.push("/ui/contests")}
          className="flex items-center gap-2 text-[#00d492] hover:text-[#00d492]/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Contests</span>
        </button>

        {/* Contest Header */}
        <div className="bg-black/30 border border-[#00d492]/30 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#00d492] mb-2 flex items-center gap-3">
                <Trophy className="w-10 h-10" />
                {contest.title}
              </h1>
              <p className="text-gray-400 text-lg">{contest.description}</p>
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
                {contest.participants.toLocaleString()}
              </p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-[#00d492]/20">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#00d492]" />
                <span className="text-xs text-gray-400">Deadline</span>
              </div>
              <p className="text-lg font-bold text-white">{contest.deadline}</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-[#00d492]/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-[#00d492]" />
                <span className="text-xs text-gray-400">Reward</span>
              </div>
              <p className="text-2xl font-bold text-[#00d492]">
                {contest.reward}
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

          {/* Requirements */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-[#00d492] mb-3">
              Requirements
            </h3>
            <ul className="space-y-2">
              {contest.requirements.map((req: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-gray-400">
                  <span className="text-[#00d492] mt-1">▸</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
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
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Proof of Concept (URL/Screenshots)
                </label>
                <input
                  type="text"
                  name="proofOfConcept"
                  value={formData.proofOfConcept}
                  onChange={handleChange}
                  placeholder="Paste URL to screenshots, video, or additional proof..."
                  className="w-full bg-black/40 border border-[#00d492]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d492] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#00d492] text-black font-bold py-3 rounded-lg hover:bg-[#00d492]/80 transition-all"
                >
                  <Send className="w-5 h-5" />
                  Submit Bug Report
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/ui/contests")}
                  className="px-6 py-3 bg-black/40 border border-[#00d492]/30 text-[#00d492] rounded-lg hover:bg-black/60 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
