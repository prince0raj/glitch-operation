"use client"
import React, { useState, useEffect, ReactNode } from 'react';

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ children, className = '' }) => {
  const [glitch, setGlitch] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <span className={glitch ? 'animate-pulse' : ''}>{children}</span>
      {glitch && (
        <>
          <span
            className="absolute top-0 left-0 text-cyan-500 opacity-70"
            style={{ transform: 'translate(-3px, -2px)', filter: 'blur(1px)' }}
          >
            {children}
          </span>
          <span
            className="absolute top-0 left-0 text-pink-500 opacity-70"
            style={{ transform: 'translate(3px, 2px)', filter: 'blur(1px)' }}
          >
            {children}
          </span>
        </>
      )}
    </div>
  );
};

export default GlitchText;
