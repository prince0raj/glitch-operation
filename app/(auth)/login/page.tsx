"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Orbitron } from "next/font/google";
import {
  Shield,
  Lock,
  Terminal as TerminalIcon,
  Wifi,
  Database,
  Code2,
  Chrome,
  Github,
  Loader2,
} from "lucide-react";
import {
  LoginContainer,
  LeftSection,
  RightSection,
  Separator,
  FormContainer,
  Logo,
  FormTitle,
  FormSubtitle,
  SocialButtons,
  SocialButton,
  Terminal,
  TerminalHeader,
  TerminalDot,
  TerminalTitle,
  TerminalContent,
  TerminalLine,
  TypewriterText,
  FloatingIcon,
  BinaryPattern,
  BinaryColumn,
  LeftContainer,
} from "./style";
import GoogleSignin from "./GoogleSignIn";
import GithubSignIn from "./GithubSignIn";
import GridPattern from "@/app/commonComponents/GridPattern/GridPattern";
import WireframeSpheres from "@/app/commonComponents/Sphere/WireframeSphere";
import GlitchText from "@/app/commonComponents/GlitchText/GlitchText";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const Page = () => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [binaryColumns, setBinaryColumns] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const validateGate = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (user) {
        redirect("/ui/dashboard/home");
      }
      setLoginStatus(true);
    };

    validateGate();
  }, []);

  const hackingCommands = useMemo(
    () => [
      "Initializing OPS GLITCH system...",
      "Scanning for vulnerabilities...",
      "Found 127 potential targets",
      "Establishing secure connection...",
      "Connection established: 192.168.1.100",
      "Bypassing firewall protocols...",
      "Access granted to mainframe",
      "Downloading classified files...",
      "File transfer complete: 2.4GB",
      "Covering digital tracks...",
      "Mission accomplished. Welcome, hacker.",
      "Ready for next operation...",
    ],
    []
  );

  useEffect(() => {
    setIsClient(true);
    const generated = Array.from({ length: 25 }, (_, i) => ({
      left: `${i * 4}%`,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4,
    }));
    setBinaryColumns(generated);
  }, []);

  useEffect(() => {
    const typeWriter = () => {
      const currentCommand = hackingCommands[currentIndex];
      if (currentText.length < currentCommand.length) {
        setCurrentText(currentCommand.slice(0, currentText.length + 1));
      } else {
        setTimeout(() => {
          setCurrentText("");
          setCurrentIndex((prev) => (prev + 1) % hackingCommands.length);
        }, 2000);
      }
    };

    const timer = setTimeout(typeWriter, 100);
    return () => clearTimeout(timer);
  }, [currentText, currentIndex, hackingCommands]);

  if (!isClient) {
    // Avoid rendering random parts on server to prevent hydration mismatch
    return null;
  }

  if (!loginStatus) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060a]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute right-16 top-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6 text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-400" />
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">
              Verifying access
            </p>
            <p className="max-w-xs text-sm text-zinc-300">
              Please wait while we secure your tunnel and confirm your credentials.
            </p>
          </div>
          <div className="mt-2 flex w-56 flex-col gap-2">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-5/6" />
            <Skeleton className="h-2 w-2/3" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <LoginContainer>
      <LeftContainer className="relative h-screen w-full bg-[#05060a]">
        <GridPattern />
        <WireframeSpheres />
        <LeftSection>
          <Separator />
          <FormContainer>
            <Logo className={orbitron.className}>
              <TerminalIcon size={50} strokeWidth={2} color="#00d492" />
              <GlitchText
                className={`${orbitron.className} text-[2.5rem] font-black tracking-wider text-white font-mono`}
              >
                OPS. GLITCH
              </GlitchText>
            </Logo>

            <FormTitle className="font-mono">Access Terminal</FormTitle>
            <FormSubtitle>
              Choose your authentication method to access the hacker playground
            </FormSubtitle>
            <SocialButtons>
              <GoogleSignin />
            </SocialButtons>
            <SocialButtons>
              <GithubSignIn />
            </SocialButtons>
          </FormContainer>
        </LeftSection>
      </LeftContainer>

      <RightSection>
        <BinaryPattern>
          {binaryColumns.map(({ left, delay, duration }, i) => (
            <BinaryColumn key={i} left={left} delay={delay} duration={duration}>
              {Array.from({ length: 60 }, (_, j) => (
                <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
              ))}
            </BinaryColumn>
          ))}
        </BinaryPattern>

        {/* Static Floating Icons */}
        <FloatingIcon top="15%" left="15%">
          <Lock size={20} />
        </FloatingIcon>
        <FloatingIcon top="15%" left="85%">
          <TerminalIcon size={20} />
        </FloatingIcon>
        <FloatingIcon top="45%" left="10%">
          <Shield size={20} />
        </FloatingIcon>
        <FloatingIcon top="65%" left="80%">
          <Database size={20} />
        </FloatingIcon>
        <FloatingIcon top="85%" left="30%">
          <Wifi size={20} />
        </FloatingIcon>
        <FloatingIcon top="35%" left="90%">
          <Code2 size={20} />
        </FloatingIcon>

        {/* Terminal */}
        <Terminal>
          <TerminalHeader>
            <TerminalDot color="#ff5f56" />
            <TerminalDot color="#ffbd2e" />
            <TerminalDot color="#27ca3f" />
            <TerminalTitle>ops-glitch-terminal</TerminalTitle>
          </TerminalHeader>

          <TerminalContent>
            <TerminalLine>Welcome to OPS GLITCH v2.1.0</TerminalLine>
            <TerminalLine>System Status: ONLINE</TerminalLine>
            <TerminalLine>Security Level: MAXIMUM</TerminalLine>
            <TerminalLine>Active Users: 1337</TerminalLine>
            <TerminalLine>─────────────────────────────</TerminalLine>
            <TerminalLine>
              <TypewriterText>{currentText}</TypewriterText>
            </TerminalLine>
          </TerminalContent>
        </Terminal>
      </RightSection>
    </LoginContainer>
  );
};

export default Page;
