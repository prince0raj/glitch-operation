"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import GlitchText from "@/app/commonComponents/GlitchText/GlitchText";
import { useRouter } from "next/navigation";
import { ArrowLeft, Crosshair, Terminal, Users } from "lucide-react";
import {
  BrandLink,
  BrandLogo,
  BrandText,
  ChallangetContainer,
  ChallengeTitle,
  ChallengeBadge,
  IconGlow,
  IframeWrapper,
  NavBar,
  NavActions,
  StyledIframe,
  BackButton,
} from "./style";
import { Orbitron } from "next/font/google";
import Link from "next/link";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

type Creator = {
  creator_name?: string;
  social_Id?: string;
};

type MissionPayload = {
  creator: Creator[] | Creator | null;
  id: string;
  title: string;
  target_url: string | null;
};

const ensureAbsoluteUrl = (value: string | null | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const page = () => {
  const router = useRouter();
  const [mission, setMission] = useState<MissionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveOperatives, setLiveOperatives] = useState(
    () => Math.floor(Math.random() * (1800 - 600 + 1)) + 600
  );

  useEffect(() => {
    const loadMission = () => {
      try {
        const raw = sessionStorage.getItem("ops.glitch.startMission");
        if (!raw) {
          router.replace("/ui/dashboard/contests");
          return;
        }

        const parsed = JSON.parse(raw) as MissionPayload;
        setMission(parsed);
      } catch (error) {
        console.error("Failed to restore mission payload", error);
        router.replace("/ui/dashboard/contests");
      } finally {
        setLoading(false);
      }
    };

    loadMission();
  }, [router]);

  const iframeSrc = useMemo(() => {
    const resolved = ensureAbsoluteUrl(mission?.target_url);
    return resolved ?? "https://prince00raj.netlify.app/";
  }, [mission?.target_url]);

  useEffect(() => {
    const updateLiveOperatives = () => {
      const next = Math.floor(Math.random() * (1800 - 600 + 1)) + 600;
      setLiveOperatives(next);
    };

    const interval = setInterval(updateLiveOperatives, 10_000);
    return () => clearInterval(interval);
  }, []);

  const participantsLabel = useMemo(() => {
    return `${liveOperatives.toLocaleString()} Operatives Online`;
  }, [liveOperatives]);

  const handleBackToContest = useCallback(() => {
    if (mission?.id) {
      router.push(`/ui/dashboard/contests/${mission.id}`);
      return;
    }
    router.push("/ui/dashboard/contests");
  }, [mission?.id, router]);

  if (loading) {
    return null;
  }

  return (
    <ChallangetContainer>
      <NavBar>
        <ChallengeTitle>
          <span className="label">Mission Brief</span>
          <span className="name">
            <Crosshair size={20} strokeWidth={2.4} />
            {mission?.title ?? "Reconnaissance Challenge"}
          </span>
        </ChallengeTitle>
        <div className="flex gap-3 items-center">
          <BackButton type="button" onClick={handleBackToContest}>
            <ArrowLeft strokeWidth={2.4} />
            <span>Back to Contest</span>
          </BackButton>

          <ChallengeBadge>
            <span className="online-indicator" aria-hidden />
            <span>{participantsLabel}</span>
            <Users size={18} strokeWidth={2.4} />
          </ChallengeBadge>
        </div>

        <NavActions>
          <Link href="/ui/dashboard/home">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Terminal
                  className="w-10 h-10 text-emerald-400 animate-pulse"
                  strokeWidth={2}
                />
                <div className="absolute inset-0 blur-xl bg-emerald-400 opacity-70 animate-ping"></div>
                <div className="absolute -inset-2 border-2 border-emerald-400/30 rounded-lg animate-ping"></div>
              </div>
              <div>
                <GlitchText
                  className={`${orbitron.className} text-2xl font-black tracking-wider text-white font-mono`}
                >
                  OPS. GLITCH
                </GlitchText>
                <div className="text-xs text-emerald-400 font-mono flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>SYSTEMS ONLINE</span>
                </div>
              </div>
            </div>
          </Link>
        </NavActions>
      </NavBar>
      <IframeWrapper>
        <StyledIframe
          src={iframeSrc}
          title="Challenge Workspace"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </IframeWrapper>
    </ChallangetContainer>
  );
};

export default page;
