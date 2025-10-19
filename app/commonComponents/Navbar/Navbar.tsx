"use client";
import React, { useState, useEffect, FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Zap,
  Users,
  Mail,
  Terminal,
  Trophy,
  Crosshair,
  LucideIcon,
} from "lucide-react";
import GlitchText from "../GlitchText/GlitchText";

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
}

const Navbar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [energyLevel, setEnergyLevel] = useState<number>(100);

  const navItems: NavItem[] = [
    { id: "home", icon: Crosshair, label: "Home", path: "/ui/home" },
    { id: "contests", icon: Trophy, label: "Contests", path: "/ui/contests" },
    { id: "profile", icon: Users, label: "Profile", path: "/ui/profile" },
    { id: "contact", icon: Mail, label: "Contact", path: "/ui/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/ui/home") {
      return pathname === "/" || pathname === "/ui/home" || pathname?.startsWith("/ui/home");
    }
    return pathname?.startsWith(path);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyLevel((prev) => {
        const newLevel = prev - Math.floor(Math.random() * 5);
        return newLevel <= 0 ? 100 : newLevel;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/70 border-b-2 border-emerald-500/50 animate-fadeInDown">
      <div className="flex justify-between items-center px-6 md:px-12 py-4">
        {/* Brand Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Terminal className="w-10 h-10 text-emerald-400 animate-pulse" strokeWidth={2} />
            <div className="absolute inset-0 blur-xl bg-emerald-400 opacity-70 animate-ping"></div>
            <div className="absolute -inset-2 border-2 border-emerald-400/30 rounded-lg animate-ping"></div>
          </div>
          <div>
            <GlitchText className="text-2xl font-black tracking-wider text-white font-mono">
              NEXUS TECH
            </GlitchText>
            <div className="text-xs text-emerald-400 font-mono flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>SYSTEMS ONLINE</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex space-x-2">
          {navItems.map(({ id, icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <button
                key={id}
                onClick={() => router.push(path)}
                className={`group relative flex items-center space-x-2 px-4 py-2 transition-all duration-300 font-mono font-bold ${
                  active
                    ? "text-emerald-400"
                    : "text-gray-400 hover:text-emerald-400"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.5} />
                <span className="text-xs hidden md:inline">{label}</span>

                {/* Neon Glitch Animation */}
                <span
                  className={`absolute inset-0 rounded-md pointer-events-none ${
                    active
                      ? "border-2 border-emerald-400 bg-emerald-400/10 animate-glow"
                      : "border border-emerald-500/30 group-hover:border-emerald-400/50 group-hover:bg-emerald-400/5 group-hover:animate-glow"
                  }`}
                ></span>
              </button>
            );
          })}
        </div>

        {/* Energy Bar */}
        <div className="hidden lg:block w-32">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <div className="flex-1 h-2 bg-gray-900 border border-emerald-500/50 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-400 animate-energyBar"
                style={{ width: `${energyLevel}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono text-emerald-400">{energyLevel}%</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glow {
  0% {
    box-shadow: 0 0 3px #00ff99, 0 0 6px #00ff99;
  }
  50% {
    box-shadow: 0 0 8px #00ff99, 0 0 16px #00ff99;
  }
  100% {
    box-shadow: 0 0 3px #00ff99, 0 0 6px #00ff99;
  }
}
.animate-glow {
  animation: glow 3s infinite; /* slower */
}

        @keyframes energyBar {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 0%;
          }
        }
        .animate-energyBar {
          animation: energyBar 2s linear infinite;
          background-size: 200% 100%;
        }

        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 1s ease forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
