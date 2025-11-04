"use client";
import GlitchText from "@/app/commonComponents/GlitchText/GlitchText";
import React from "react";
import { Orbitron } from "next/font/google";
import { contactInfo } from "@/config/contact";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});
const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-emerald-500/30 mt-16 bg-black/90 backdrop-blur-md overflow-hidden">
      {/* === Animated Background === */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)] animate-pulse"></div>
      <div className="absolute inset-0 hacker-grid animate-hackerGrid"></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* === Top Grid === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Column 1 */}
          <div>
            <h3 className="text-white font-black mb-3 font-mono text-lg tracking-wide">
              <GlitchText
                className={`${orbitron.className} text-2xl font-black tracking-wider font-mono`}
              >
                OPS. GLITCH
              </GlitchText>
            </h3>
            <p className="text-emerald-400 text-sm font-mono font-bold">
              INNOVATION AT SCALE
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white font-black mb-3 font-mono tracking-wide">
              SYSTEMS
            </h4>
            <ul className="space-y-2 text-emerald-400 text-sm font-mono">
              {[
                "AI & ML",
                "Cybersecurity",
                "Cloud Solutions",
                "Data Analytics",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-emerald-300 cursor-pointer transition-colors duration-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white font-black mb-3 font-mono tracking-wide">
              COMMAND
            </h4>
            <ul className="space-y-2 text-emerald-400 text-sm font-mono">
              {["About Us", "Careers", "Case Studies", "Intel"].map((item) => (
                <li
                  key={item}
                  className="hover:text-emerald-300 cursor-pointer transition-colors duration-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-white font-black mb-3 font-mono tracking-wide">
              CONNECT
            </h4>
            <ul className="space-y-2 text-emerald-400 text-sm font-mono">
              <li className="hover:text-emerald-300 transition-colors cursor-pointer">
                {contactInfo.email}
              </li>
              <li className="hover:text-emerald-300 transition-colors cursor-pointer flex flex-col gap-1.5">
                {contactInfo.phone.contact_no}{" "}
                {/* <p>{contactInfo.phone.avaliable}</p> */}
              </li>
              <li className="hover:text-emerald-300 transition-colors cursor-pointer">
                {contactInfo.address.pin_address}
              </li>
            </ul>
          </div>
        </div>

        {/* === Divider + Bottom Text === */}
        <div className="border-t border-emerald-500/30 pt-6 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-emerald-400">
          <div className="flex items-center space-x-3 mb-3 md:mb-0">
            <span className="font-semibold">SYSTEM STATUS:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-flicker"></div>
              <span className="text-emerald-300">ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          <div className="text-gray-500 text-center md:text-right font-semibold">
            © {new Date().getFullYear()} OPS. GLITCH. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>

      {/* Neon Border Corners */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-emerald-400/50 rounded-tl-lg neon-glow animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-emerald-400/50 rounded-br-lg neon-glow animate-pulse-slow"></div>

      <style jsx>{`
        @keyframes flicker {
          0%,
          19%,
          21%,
          50%,
          100% {
            opacity: 1;
          }
          20%,
          51% {
            opacity: 0.2;
          }
        }
        .animate-flicker {
          animation: flicker 1.5s infinite;
        }

        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }

        @keyframes hackerGrid {
          0%,
          100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.02);
          }
        }
        .animate-hackerGrid {
          animation: hackerGrid 4s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
