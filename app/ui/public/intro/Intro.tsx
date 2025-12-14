"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Target, Users, Trophy, Code, Shield, Play, Pause, BookOpen, Globe, Zap, ArrowRight, Crosshair, Cross, Webhook, BowArrow } from "lucide-react";
import GlitchText from "@/app/commonComponents/GlitchText/GlitchText";
import GridPattern from "@/app/commonComponents/GridPattern/GridPattern";
import { Orbitron } from "next/font/google";
import { useRouter } from "next/navigation";

const orbitron = Orbitron({
    subsets: ["latin"],
    variable: "--font-orbitron",
});

const IntroPage = () => {
    const router = useRouter();
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
        <div className="min-h-screen bg-[#05060a] text-white">
            {/* Hero Section */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                <GridPattern />

                {/* Radial Gradient Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#00d49218,transparent_50%),radial-gradient(ellipse_at_bottom,#00d49212,transparent_50%)]" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-[#00d492] sm:text-sm text-xs tracking-widest mb-4 font-mono">
                            // MISSION BRIEFING
                        </p>
                        <h1 className={`${orbitron.className} md:text-7xl sm:text-6xl text-4xl font-extrabold mb-6`}>
                            <GlitchText>OPS. GLITCH</GlitchText>
                        </h1>
                        <p className="text-gray-300 sm:text-xl md:text-2xl text-md mb-8 leading-relaxed">
                            Your Gateway to Mastering Bug Bounty Hunting
                        </p>
                        <p className="text-gray-500 sm:text-sm text-xs mb-12 max-w-2xl mx-auto">
                            A cutting-edge platform designed by developers for developers.
                            Sharpen your skills, hunt bugs, and earn rewards in a gamified cybersecurity playground.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-[80%] sm:gap-4 justify-center items-stretch sm:items-center mx-auto">

                            <button
                                onClick={() => router.push("/ui/dashboard/home")}
                                className="group cursor-pointer relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#00d492] to-[#00b87a] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00d492]/25 transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden"
                            >
                                <Crosshair className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
                                <span className="relative z-10 text-sm sm:text-base">Start Mission</span>
                            </button>

                            <button
                                onClick={() => {
                                    const videoSection = document.querySelector('#video-section');
                                    if (videoSection) {
                                        videoSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="group cursor-pointer relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-transparent border border-[#00d492] text-[#00d492] font-bold rounded-xl hover:bg-[#00d492]/10 hover:text-white transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden"
                            >
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current relative z-10" />
                                <span className="relative z-10 text-sm sm:text-base">Watch Video</span>
                            </button>

                        </div>

                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute sm:bottom-10 bottom-5 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="text-[#00d492]/60 flex flex-col items-center gap-2">
                        <span className="text-sm font-mono">Scroll to Explore</span>
                        <span className="animate-bounce text-2xl">↓</span>
                    </div>
                </motion.div>
            </section>

            {/* What is Operation Glitch Section */}
            <section
                ref={(el) => { if (el) sectionsRef.current[0] = el as HTMLDivElement; }}
                className="relative py-20 px-6 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden"
            >
                {/* Animated Pattern Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(#00d49212_1px,transparent_1px),linear-gradient(90deg,#00d49212_1px,transparent_1px)] bg-[size:80px_80px] animate-pattern-slow" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05060a_100%)]" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center sm:mb-16 mb-10">
                        <h2 className="sm:text-4xl md:text-5xl text-2xl font-bold bg-gradient-to-r from-[#00d492] via-[#00f5a0] to-[#00d492] bg-clip-text text-transparent sm:mb-6 mb-4">
                            What is Operation Glitch?
                        </h2>
                        <div className="w-24 sm:h-1 h-[0.5px]  bg-gradient-to-r from-transparent via-[#00d492] to-transparent mx-auto sm:mb-8 mb-4" />
                        <p className="text-gray-400 sm:text-sm text-xs max-w-3xl mx-auto ">
                            A Revolutionary Platform for Bug Bounty Hunters and Security Enthusiasts.
                        </p>
                    </div>

                    {/* Main Description */}
                    <div className="bg-gradient-to-br from-black/70 via-black/50 to-black/70 border border-[#00d492]/20 rounded-3xl sm:p-8 p-6 md:p-12 mb-12 backdrop-blur-sm hover:border-[#00d492]/40 transition-colors duration-500">
                        <div className="space-y-6">
                            <p className="text-gray-300 sm:text-lg text-md leading-relaxed text-left sm:text-base leading-relaxed max-w-prose mx-auto">
                                <span className="text-[#00d492] font-bold sm:text-lg text-md">Operation Glitch</span> is an
                                innovative bug bounty platform that transforms cybersecurity training
                                into an engaging, gamified experience. We bridge the gap between
                                theoretical knowledge and real-world application by providing hands-on
                                challenges that simulate actual security vulnerabilities.
                            </p>
                            <p className="text-gray-400 sm:text-sm text-xs leading-relaxed">
                                Whether you're a seasoned security researcher or just starting your
                                journey, Operation Glitch provides a safe, controlled environment to practice,
                                learn, and excel in finding vulnerabilities. Our platform combines
                                competitive elements with educational content to make learning
                                cybersecurity both effective and enjoyable.
                            </p>
                            <p className="text-gray-400 sm:text-sm text-xs leading-relaxed">
                                We believe that the best way to learn security is by doing. That's why
                                every challenge on Operation Glitch is designed to teach you practical skills
                                you can apply in real-world scenarios, from web application security
                                to API testing and beyond.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Key Features */}
                        <div className="space-y-6">
                            <h3 className="sm:text-2xl  text-xl font-bold text-[#00d492] sm:mb-6 mb-4 flex items-center gap-3">
                                <div className="sm:w-1 w-[1px] h-8 bg-[#00d492] rounded-full" />
                                Key Features
                            </h3>

                            <div className="space-y-4">
                                {[
                                    {
                                        icon: Shield,
                                        title: "Real-World Challenges",
                                        description: "Practice on realistic scenarios that mirror actual security vulnerabilities found in production systems. Learn to identify and exploit common weaknesses like SQL injection, XSS, CSRF, and more."
                                    },
                                    {
                                        icon: Trophy,
                                        title: "Earn Rewards & Recognition",
                                        description: "Complete challenges to earn points, unlock badges, and climb the global leaderboard. Build your reputation and showcase your skills to potential employers and the security community."
                                    },
                                    {
                                        icon: Code,
                                        title: "Progressive Skill Development",
                                        description: "Start with beginner-friendly challenges and gradually advance to expert-level vulnerabilities. Our structured learning path ensures you build a solid foundation before tackling complex security issues."
                                    }
                                ].map((feature, idx) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={idx} className="group bg-gradient-to-br from-black/60 via-black/40 to-black/60 border border-[#00d492]/20 rounded-xl p-6 hover:border-[#00d492]/60 transition-all duration-300">
                                            <div className="flex sm:items-start items-center gap-4">
                                                <div className="sm:w-12 sm:h-12 w-10 h-10 bg-[#00d492]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#00d492]/20 transition-colors duration-300">
                                                    <Icon className="sm:w-6 sm:h-6 w-5 h-5 text-[#00d492]" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="sm:text-lg text-md font-bold text-white mb-2 group-hover:text-[#00d492] transition-colors duration-300">
                                                        {feature.title}
                                                    </h4>
                                                    <p className="text-gray-400 sm:text-sm text-xs leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mission & Vision */}
                        <div className="space-y-6">
                            <h3 className="sm:text-2xl text-xl font-bold text-[#00d492] sm:mb-6 mb-4 flex items-center gap-3">
                                <div className="sm:w-1 w-[1px] h-8 bg-[#00d492] rounded-full" />
                                Our Purpose
                            </h3>

                            <div className="bg-gradient-to-br from-black/70 via-black/50 to-[#00d492]/5 border border-[#00d492]/20 rounded-2xl p-8 relative overflow-hidden hover:border-[#00d492]/50 transition-colors duration-500">
                                <div className="relative space-y-8">
                                    <div className="flex sm:items-start items-center gap-4">
                                        <div className="sm:w-14 w-12 sm:h-14 h-12 bg-[#00d492]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Target className="sm:w-7 sm:h-7 w-6 h-6 text-[#00d492]" />
                                        </div>
                                        <div>
                                            <h3 className="sm:text-xl text-lg font-bold text-[#00d492] mb-3">Our Mission</h3>
                                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                                Democratize cybersecurity education and create the next
                                                generation of ethical hackers by making bug bounty hunting
                                                accessible, engaging, and rewarding for everyone.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-[#00d492]/30 to-transparent" />

                                    <div className="flex sm:items-start items-center gap-4">
                                        <div className="sm:w-14 sm:h-14 h-12 w-12 bg-[#00d492]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Trophy className="sm:w-7 sm:h-7 w-6 h-6 text-[#00d492]" />
                                        </div>
                                        <div>
                                            <h3 className="sm:text-xl text-lg font-bold text-[#00d492] mb-3">Our Vision</h3>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                Build a global community where security researchers can
                                                learn, compete, and grow together while making the internet
                                                a safer place for everyone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {[
                                    { value: "100+", label: "Challenges" },
                                    { value: "10K+", label: "Hunters" }
                                ].map((stat, idx) => (
                                    <div key={idx} className="bg-gradient-to-br from-black/60 via-black/40 to-black/60 border border-[#00d492]/20 rounded-xl p-6 text-center hover:border-[#00d492]/60 transition-all duration-300 group">
                                        <div className="sm:text-3xl text-2xl font-bold text-[#00d492] mb-2 group-hover:scale-110 transition-transform duration-300">
                                            {stat.value}
                                        </div>
                                        <div className="text-gray-400 sm:text-sm text-xs">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Section - See Operation Glitch in Action */}
            <section
                ref={(el) => { if (el) sectionsRef.current[1] = el as HTMLDivElement; }}
                className="relative py-20 px-6 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden"
            >
                {/* Radial Gradient Pattern Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#00d49212,transparent_40%),radial-gradient(circle_at_70%_80%,#00d49212,transparent_40%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(30deg,#00d49208_12%,transparent_12.5%,transparent_87%,#00d49208_87.5%,#00d49208),linear-gradient(150deg,#00d49208_12%,transparent_12.5%,transparent_87%,#00d49208_87.5%,#00d49208)] bg-[size:80px_140px] bg-[position:0_0,0_0,40px_70px,40px_70px] animate-pattern-slow" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05060a_100%)]" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12" id="video-section">
                        <div className="text-center">
                            <h2 className=" text-md sm:text-lg md:text-5xl font-extrabold bg-gradient-to-r from-[#00f5a0] via-[#00d492] to-[#009e6f] bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_10px_rgba(0,212,146,0.1)]">
                                Welcome to <span className="text-white/90">Operation Glitch</span>
                                <span className="text-[#00d492]"> (OpsGlitch)</span>
                            </h2>

                            <div className="w-28 sm:h-[2px] h-[1px] bg-gradient-to-r from-transparent via-[#00d492] to-transparent mx-auto sm:my-6 my-4 rounded-full" />

                            <p className="text-gray-400 sm:text-sm text-xs max-w-2xl mx-auto leading-relaxed">
                                <span className="text-gray-300">Step into the cyber arena</span> — where intelligence meets defense.
                                <span className="text-[#00d492]/80"> Operation Glitch</span> empowers your cybersecurity journey with immersive learning, real-world missions, and hands-on challenges.
                            </p>
                        </div>
                    </div>

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
                                className="sm:w-20 sm:h-20 w-16 h-16 bg-[#00d492] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform duration-300"
                                whileTap={{ scale: 0.95 }}
                            >
                                {isPlaying ? (
                                    <Pause className="sm:w-8 sm:h-8 w-6 h-6 fill-current" />
                                ) : (
                                    <Play className="sm:w-8 sm:h-8 w-6 h-6 fill-current ml-1" />
                                )}
                            </motion.div>
                        </div>

                        {/* Video Status Indicator */}
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-gray-400'}`} />
                            <span>{isPlaying ? 'Playing' : 'Paused'}</span>
                        </div>
                    </div>

                    {/* Additional Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6 sm:mt-12 mt-10">
                        {[
                            {
                                title: "Step-by-Step Guidance",
                                description: "Follow our comprehensive tutorials to understand each vulnerability type",
                                icon: BookOpen
                            },
                            {
                                title: "Real-World Scenarios",
                                description: "Practice on realistic applications that mirror production environments",
                                icon: Globe
                            },
                            {
                                title: "Instant Feedback",
                                description: "Get immediate validation and detailed explanations for your submissions",
                                icon: Zap
                            }
                        ].map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group relative overflow-hidden bg-gradient-to-br from-black via-[#010a07] to-black border border-[#00d492]/15 rounded-2xl sm:p-6 p-4 transition-all duration-500"
                                >
                                    {/* Subtle gradient pattern background */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,212,146,0.05),transparent_70%)] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>

                                    {/* Faint grid pattern for hacker texture */}
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,212,146,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                                    <div className="relative z-10">
                                        {/* Icon Section - smooth hover animation only */}
                                        <div className="sm:w-14 sm:h-14 w-12 h-12 bg-[#00d492]/10 rounded-xl flex items-center justify-center mb-5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#00d492]/15">
                                            <Icon className="sm:w-7 sm:h-7 w-6 h-6 text-[#00d492] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
                                        </div>

                                        {/* Title */}
                                        <h4 className="sm:text-lg text-md font-semibold text-white mb-2 transition-colors duration-500 group-hover:text-[#00d492]/80">
                                            {card.title}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-gray-400 sm:text-sm text-xs leading-relaxed transition-colors duration-500 group-hover:text-gray-300/90">
                                            {card.description}
                                        </p>
                                    </div>

                                    {/* Dim neon border pulse */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition duration-700">
                                        <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-[#00d492]/20 via-transparent to-[#00d492]/20 blur-[2px] animate-[pulse_5s_infinite]"></div>
                                    </div>
                                </div>

                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Creators Section */}
            <section
                ref={(el) => { if (el) sectionsRef.current[2] = el as HTMLDivElement; }}
                className="relative py-20 px-6 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden"
            >
                {/* Animated Pattern Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,#00d49210_1px,transparent_1px),linear-gradient(-45deg,#00d49210_1px,transparent_1px)] bg-[size:60px_60px] animate-pattern-diagonal" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05060a_100%)]" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="sm:text-4xl text-2xl md:text-5xl font-bold bg-gradient-to-r from-[#00d492] via-[#00f5a0] to-[#00d492] bg-clip-text text-transparent sm:mb-6 mb-5">
                            Built by Developers, For Developers
                        </h2>
                        <div className="w-24 sm:h-1 h-[1px] bg-gradient-to-r from-transparent via-[#00d492] to-transparent mx-auto mb-8" />
                        <p className="text-gray-400 sm:text-sm text-xs max-w-3xl mx-auto">
                            Operation Glitch was created by a passionate team of developers with a deep
                            interest in bug bounty hunting and cybersecurity. We understand the
                            challenges because we've faced them ourselves.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Code,
                                title: "Developer-First",
                                description: "Built with developers in mind, using modern tech stacks and best practices.",
                            },
                            {
                                icon: Users,
                                title: "Community Driven",
                                description: "Shaped by feedback from security researchers and bug bounty hunters.",
                            },
                            {
                                icon: Shield,
                                title: "Security Focused",
                                description: "Every challenge is crafted to teach real-world security concepts.",
                            },
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="relative bg-gradient-to-br from-black/60 via-black/40 to-[#00d492]/10 border border-[#00d492]/30 rounded-2xl sm:p-8 p-6 hover:border-[#00d492] transition-all duration-500 group overflow-hidden"
                                >
                                    {/* Subtle gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00d492]/0 via-[#00d492]/5 to-[#00d492]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="flex justify-center mb-6">
                                            <div className="sm:w-20 sm:h-20 h-16 w-16 bg-gradient-to-br from-[#00d492]/30 to-[#00d492]/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                <Icon className="w-10 h-10 text-[#00d492] group-hover:scale-110 transition-transform duration-300" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-[#00d492] mb-3 text-center group-hover:text-white transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-400 sm:text-sm text-xs sm:text-base text-center group-hover:text-gray-300 transition-colors duration-300">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-16 bg-gradient-to-br from-black/70 via-black/50 to-[#00d492]/5 border-l-2 sm:border-l-3 border-[#00d492] rounded-lg p-6 sm:p-8 hover:border-[#00d492] transition-colors duration-500">
                        <p className="text-gray-300 sm:text-md text-sm md:text-base font-mono leading-relaxed">
                            "We started Operation Glitch because we wanted to create the platform we
                            wished existed when we were learning cybersecurity. A place
                            where theory meets practice, where learning is fun, and where every
                            developer can become a security expert."
                        </p>
                        <p className="text-[#00d492] font-bold mt-4">— The Operation Glitch Team</p>
                    </div>
                </div>
            </section>

            {/* Platform Goals Section */}
            <section
                ref={(el) => { if (el) sectionsRef.current[3] = el as HTMLDivElement; }}
                className="relative py-20 px-6 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden"
            >
                {/* Animated Pattern Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,#00d49215_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#00d49215_0%,transparent_50%)] animate-pulse-slow" />
                    <div className="absolute inset-0 bg-[linear-gradient(#00d49208_1px,transparent_1px),linear-gradient(90deg,#00d49208_1px,transparent_1px)] bg-[size:100px_100px] animate-pattern-reverse" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center sm:mb-16 mb-14">
                        <h2 className="sm:text-4xl text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#00d492] via-[#00f5a0] to-[#00d492] bg-clip-text text-transparent sm:mb-6 mb-4">
                            Our Goals
                        </h2>
                        <div className="w-24 sm:h-1 h-[1px] bg-gradient-to-r from-transparent via-[#00d492] to-transparent mx-auto mb-4" />
                        <p className="text-gray-400 sm:text-lg text-sm leading-relaxed max-w-2xl mx-auto mt-6">
                            Empowering the next generation of cybersecurity professionals through innovation and community
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                number: "01",
                                title: "Skill Development",
                                description: "Provide hands-on experience with real-world vulnerabilities in a safe, controlled environment.",
                            },
                            {
                                number: "02",
                                title: "Community Building",
                                description: "Foster a supportive community where security researchers can collaborate and learn from each other.",
                            },
                            {
                                number: "03",
                                title: "Gamified Learning",
                                description: "Make cybersecurity education engaging through challenges, rewards, and competitive leaderboards.",
                            },
                            {
                                number: "04",
                                title: "Career Growth",
                                description: "Help aspiring security professionals build portfolios and gain recognition in the industry.",
                            },
                        ].map((goal, idx) => (
                            <div
                                key={idx}
                                className="relative group"
                            >
                                {/* Card */}
                                <div className="relative rounded-2xl border border-[#00d492]/20 bg-gradient-to-br from-black/60 via-black/40 to-[#00d492]/5 p-8 overflow-hidden hover:border-[#00d492]/80 transition-all duration-500 backdrop-blur-sm">

                                    {/* Hover gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00d492]/0 via-[#00d492]/8 to-[#00b87a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Subtle background pattern */}
                                    <div className="pointer-events-none absolute inset-0 opacity-20">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#00d49218,transparent_60%)]" />
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,#00d49210_1px,transparent_1px),linear-gradient(-45deg,#00d49210_1px,transparent_1px)] bg-[size:24px_24px]" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Number badge */}
                                        <div className="inline-flex items-center justify-center mb-6">
                                            <div className="sm:h-12 h-10 sm:w-18 w-14 px-4 sm:px-5 px-4 rounded-lg bg-gradient-to-br from-[#00d492] to-[#00b87a] text-black font-bold text-lg sm:text-xl tracking-wider flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                                {goal.number}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="sm:text-2xl text-xl font-bold text-white mb-4 group-hover:text-[#00d492] transition-colors duration-300">
                                            {goal.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="sm:text-base text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                            {goal.description}
                                        </p>

                                        {/* Bottom accent line */}
                                        <div className="mt-6 sm:h-[2px] h-[0.5px] bg-gradient-to-r from-[#00d492] via-[#00b87a]/40 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                {/* Animated Dots Pattern Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,#00d49212_1px,transparent_1px)] bg-[size:50px_50px] animate-pattern-slow" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05060a_100%)]" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="bg-gradient-to-br from-black/70 via-black/50 to-[#00d492]/5 border border-[#00d492]/30 rounded-3xl sm:p-12 p-6 relative overflow-hidden hover:border-[#00d492]/50 transition-colors duration-500">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00d49215_0%,transparent_70%)]" />

                        <div className="relative z-10">
                            <h2 className="sm:text-4xl text-3xl md:text-5xl font-bold text-white mb-6">
                                Ready to Start Your Journey?
                            </h2>
                            <p className="text-gray-400 text-base sm:text-lg mb-8">
                                Join thousands of developers who are already mastering bug bounty hunting on Operation Glitch.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push("/ui/dashboard/home")}
                                    className="group cursor-pointer px-8 py-4 bg-gradient-to-r from-[#00d492] to-[#00b87a] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00d492]/25 transition-all duration-300 flex items-center gap-3 justify-center"
                                >
                                    <BowArrow className="sm:w-6 sm:h-6 h-5 w-5 transition-transform duration-300" />
                                    Start Your Mission
                                </button>

                                <button
                                    onClick={() => router.push("/ui/dashboard/contests")}
                                    className="px-8 py-4  cursor-pointer flex items-center gap-3 justify-center border-2 border-[#00d492]/60 bg-[#00d492]/5 text-[#00d492] font-bold rounded-xl hover:border-[#00d492] hover:bg-[#00d492]/10 transition-all duration-300"
                                >
                                    <Webhook className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
                                    Browse Challenges
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Animations */}
            <style jsx>{`
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

                @keyframes pattern-slow {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: 80px 80px;
                    }
                }

                .animate-pattern-slow {
                    animation: pattern-slow 20s linear infinite;
                }

                @keyframes pattern-diagonal {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: 60px 60px;
                    }
                }

                .animate-pattern-diagonal {
                    animation: pattern-diagonal 25s linear infinite;
                }

                @keyframes pattern-reverse {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: -100px -100px;
                    }
                }

                .animate-pattern-reverse {
                    animation: pattern-reverse 30s linear infinite;
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.6;
                    }
                }

                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default IntroPage;