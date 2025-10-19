"use client";
import { useEffect, useRef } from "react";
import { Code, Shield, Zap } from "lucide-react";

const steps = [
  {
    id: 1,
    number: "01",
    icon: Code,
    title: "Select a Challenge",
    description:
      "Browse through various debugging challenges and pick one that matches your skill level and interests.",
  },
  {
    id: 2,
    number: "02",
    icon: Shield,
    title: "Hunt for Bugs",
    description:
      "Dive deep into the code or website, analyze patterns, and track down those elusive bugs using your expertise.",
  },
  {
    id: 3,
    number: "03",
    icon: Zap,
    title: "Earn Rewards",
    description:
      "Complete challenges successfully to earn points, unlock exclusive badges, and climb the global leaderboard.",
  },
];

export default function HowItWorks() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // 👇 Simple scroll fade-in effect (no Framer Motion)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative py-20 bg-[#05060a] text-white overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-[radial-gradient(circle,#0a0f1c_0%,#000_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#00ffae] mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg">
            A simple 3-step guide to start your bug hunting journey.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                ref={(el) => { cardsRef.current[idx] = el!; }}
                className="relative group bg-black/40 border border-[#00ffae]/30 rounded-2xl p-8 opacity-0 translate-y-10 transition-all duration-700 ease-out overflow-hidden"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                {/* 🔹 Animated Border (below content) */}
                {/* <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none">
                  <div className="absolute inset-[-2px] bg-[conic-gradient(from_0deg,transparent_0deg,#00ffae_60deg,transparent_120deg)] animate-spin-slow rounded-2xl" />
                  <div className="absolute inset-[2px] bg-black/40 rounded-2xl" />
                </div> */}

                {/* 🔹 Content (above border) */}
                <div className="relative z-10">
                  {/* Number Badge */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-[#00ffae] rounded-full flex items-center justify-center shadow-[0_0_15px_#00ffae]">
                    <span className="text-black font-bold text-lg">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon Container */}
                  <div className="flex justify-center mt-8 mb-8">
                    <div className="relative w-32 h-32 border-2 border-[#00ffae]/60 rounded-2xl flex items-center justify-center bg-black/60">
                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ffae] rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ffae] rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ffae] rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffae] rounded-br-lg" />

                      <Icon className="w-16 h-16 text-[#00ffae] stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#00ffae] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔹 Custom Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
