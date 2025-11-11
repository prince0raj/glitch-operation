"use client";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Code, Globe, Pause, Play, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

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

  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle video end
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleEnded = () => setIsPlaying(false);
      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }
  }, []);

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

    sectionsRef.current.forEach((section) => section && observer.observe(section));
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
          <h2 className="text-4xl md:text-5xl font-bold text-[#00d492] mb-4">
            How It Works
          </h2>
          <div className="w-28 h-[2px] bg-gradient-to-r from-transparent via-[#00d492] to-transparent mx-auto my-6 rounded-full" />

          <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            <span className="text-gray-300">Step into the cyber arena</span> — where intelligence meets defense.
            <span className="text-[#00d492]/80"> Operation Glitch</span> empowers your cybersecurity journey with immersive learning, real-world missions, and hands-on challenges.
          </p>
        </div>


        <section
          ref={(el) => { if (el) sectionsRef.current[1] = el as HTMLDivElement; }}
          className="relative pb-4 px-0 opacity-0 pt-0 transition-all duration-700 overflow-hidden"
        >
          {/* Radial Gradient Pattern Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#00d49212,transparent_40%),radial-gradient(circle_at_70%_80%,#00d49212,transparent_40%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(30deg,#00d49208_12%,transparent_12.5%,transparent_87%,#00d49208_87.5%,#00d49208),linear-gradient(150deg,#00d49208_12%,transparent_12.5%,transparent_87%,#00d49208_87.5%,#00d49208)] bg-[size:80px_140px] bg-[position:0_0,0_0,40px_70px,40px_70px] animate-pattern-slow" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05060a_100%)]" />
          </div>

          <div className="mx-auto relative z-10">

            {/* Video Player */}
            <div className="relative aspect-video bg-gradient-to-br from-[#05060a] via-[#0a0f1a] to-[#05060a] rounded-2xl overflow-hidden border border-[#00d492]/20 hover:border-[#00d492]/40 transition-colors duration-500 group">
              <video
                ref={videoRef}
                className="w-full h-full object-cover cursor-pointer"
                src="/assets/video/contest.mp4"
                onClick={togglePlayPause}
                controls={false}
                playsInline
                preload="metadata"
                poster="/assets/img/contest-poster.png"
              />

              {/* Play/Pause Overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={togglePlayPause}
              >
                <motion.div
                  className="w-20 h-20 bg-[#00d492] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform duration-300"
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </motion.div>
              </div>

              {/* Video Status Indicator */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-gray-400'}`} />
                <span>{isPlaying ? 'Playing' : 'Paused'}</span>
              </div>
            </div>

          </div>
        </section>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                ref={(el) => { cardsRef.current[idx] = el!; }}
                className="relative group bg-black/40 border border-[#00d492]/30 rounded-2xl p-8 opacity-0 translate-y-10 transition-all duration-700 ease-out overflow-hidden"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                {/* 🔹 Animated Border (below content) */}
                {/* <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none">
                  <div className="absolute inset-[-2px] bg-[conic-gradient(from_0deg,transparent_0deg,#00d492_60deg,transparent_120deg)] animate-spin-slow rounded-2xl" />
                  <div className="absolute inset-[2px] bg-black/40 rounded-2xl" />
                </div> */}

                {/* 🔹 Content (above border) */}
                <div className="relative z-10">
                  {/* Number Badge */}
                  <div className="absolute top-[-30px] left-2 w-12 h-12 bg-[#00d492] rounded-full flex items-center justify-center shadow-[0_0_15px_#00d492]">
                    <span className="text-black font-bold text-lg">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon Container */}
                  <div className="flex justify-center mt-8 mb-8">
                    <div className="relative w-32 h-32 border-2 border-[#00d492]/60 rounded-2xl flex items-center justify-center bg-black/60">
                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00d492] rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00d492] rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00d492] rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00d492] rounded-br-lg" />

                      <Icon className="w-16 h-16 text-[#00d492] stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#00d492] mb-3">
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
    </section >
  );
}
