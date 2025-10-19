"use client";

import React, { useEffect, useState } from "react";

interface Particle {
  top: number;
  left: number;
  delay: number;
}

const Hero: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 30 particles only on client
    const generated = Array.from({ length: 30 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(generated);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("matrix") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "01111110000011010100011011110001";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(11,15,18,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff99"; // neon green
      ctx.font = `${fontSize}px Fira Mono`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0b0f12]">
      {/* Matrix background */}
      <canvas id="matrix" className="absolute top-0 left-0 w-full h-full"></canvas>

      {/* Floating particle/glow elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute bg-[#00c6ff] w-2 h-2 rounded-full animate-float"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff99] via-[#00c6ff] to-[#ff4db8] animate-glitch">
          Find Bugs. Earn Rewards.
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-[#b0b0b0] font-mono animate-fadeIn">
          Level up your debugging skills in our hacker playground.
        </p>
        <div className="mt-8 flex space-x-6">
          <button className="px-6 py-3 border-2 border-[#00ff99] text-[#00ff99] font-bold rounded-md hover:bg-[#00ff99] hover:text-[#0b0f12] transition duration-300 neon-button">
            Start Hunting
          </button>
          <button className="px-6 py-3 border-2 border-[#00c6ff] text-[#00c6ff] font-bold rounded-md hover:bg-[#00c6ff] hover:text-[#0b0f12] transition duration-300 neon-button">
            Learn Debugging
          </button>
        </div>
      </div>

      {/* Explore More Arrow */}
      <div className="absolute bottom-10 w-full flex justify-center z-10">
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-[#00ff99] font-mono tracking-wider uppercase text-sm">
            Explore More
          </span>
          <svg
            className="w-6 h-6 mt-2 text-[#00ff99]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-10px) translateX(5px) scale(1.2);
          }
          100% {
            transform: translateY(0) translateX(0) scale(1);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes glitch {
          0% {
            text-shadow: 2px 0 #00ff99, -2px 0 #ff4db8;
          }
          20% {
            text-shadow: -2px -2px #00c6ff, 2px 2px #ff4db8;
          }
          40% {
            text-shadow: 2px 2px #00ff99, -2px -2px #ff4db8;
          }
          60% {
            text-shadow: -2px 2px #00c6ff, 2px -2px #ff4db8;
          }
          80% {
            text-shadow: 2px -2px #00ff99, -2px 2px #ff4db8;
          }
          100% {
            text-shadow: 2px 0 #00ff99, -2px 0 #ff4db8;
          }
        }
        .animate-glitch {
          animation: glitch 1s infinite;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 2s ease forwards;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(12px);
          }
        }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
