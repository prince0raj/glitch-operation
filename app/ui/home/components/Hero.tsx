import GlitchText from '@/app/commonComponents/GlitchText/GlitchText';
import WireframeSpheres from '@/app/commonComponents/Sphere/WireframeSphere';
import TerminalWindows from '@/app/commonComponents/TerminalWindows/TerminalWindows';
import { motion } from 'framer-motion';
    
export default function HeroSection() {
  return (
    <section className="relative h-screen w-full bg-[#05060a] text-white flex flex-col items-center justify-center overflow-hidden font-mono">
      {/* Neon grid and particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a0f1c_0%,_#000_100%)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(#00d49240_1px,transparent_1px),linear-gradient(90deg,#00d49240_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 animate-[pulseGrid_4s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-20 animate-[matrixFlow_15s_linear_infinite]" />
      </div>

      {/* Floating Spheres */}
      <WireframeSpheres />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-11/12 max-w-6xl">
        {/* Left Text Section */}
        <div className="flex flex-col gap-4 max-w-lg">
          <p className="text-[#00d492] text-sm tracking-widest">// Welcome to</p>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white glitch" data-text="OPS. GLITCH">
            <GlitchText className="text-5xl md:text-6xl font-extrabold leading-tight text-white glitch" data-text="OPS. GLITCH">
              OPS. GLITCH
            </GlitchText>
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Find Bugs. Earn Rewards. Level up your debugging and hacking skills in our interactive playground.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-3 bg-[#00d492] text-black font-bold rounded-xl shadow-[0_0_20px_#00d492] hover:scale-110 hover:shadow-[0_0_40px_#00d492] transition-transform">
              Start Hunting
            </button>
            <button className="px-6 py-3 border border-[#00d492] text-[#00d492] rounded-xl hover:bg-[#00d492]/10 hover:shadow-[0_0_15px_#00d492] transition-all">
              Learn Debugging
            </button>
          </div>
        </div>

        {/* Right Animated Circle */}
        <div className="pt-16">
          <TerminalWindows />
        </div>
      </div>

      {/* Explore More Button */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-60"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <a
          href="#how-it-works" // link to next section
          className="px-6 py-3 border border-[#00d492] text-[#00d492] rounded-full hover:bg-[#00d492]/20 hover:shadow-[0_0_20px_#00d492] transition-all flex items-center gap-2"
        >
          Explore More
          <span className="animate-bounce">↓</span>
        </a>
      </motion.div>

      <style jsx>{`
        @keyframes matrixFlow {
          0% { background-position: 0 0; }
          100% { background-position: 0 1000px; }
        }
        @keyframes pulseGrid {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        .glitch {
          position: relative;
          color: #fff;
          text-shadow: 0 0 5px #00d492, 0 0 10px #00d492;
        }
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          overflow: hidden;
          clip: rect(0, 900px, 0, 0);
        }
        .glitch::before {
          left: 2px;
          text-shadow: -2px 0 magenta;
          animation: glitchTop 2s infinite linear alternate-reverse;
        }
        .glitch::after {
          left: -2px;
          text-shadow: -2px 0 cyan;
          animation: glitchBottom 2s infinite linear alternate-reverse;
        }
        @keyframes glitchTop {
          0% { clip: rect(0, 9999px, 0, 0); }
          50% { clip: rect(0, 9999px, 100%, 0); }
          100% { clip: rect(0, 9999px, 0, 0); }
        }
        @keyframes glitchBottom {
          0% { clip: rect(0, 9999px, 100%, 0); }
          50% { clip: rect(0, 9999px, 0, 0); }
          100% { clip: rect(0, 9999px, 100%, 0); }
        }
      `}</style>
    </section>
  );
}
