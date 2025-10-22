"use client";

import React from "react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { BadgeCheck, CalendarClock, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AdminContentDescription,
  AdminContentHeader,
  AdminContentTitle,
  AdminQuickActionCard,
  AdminQuickActionDescription,
  AdminQuickActionTitle,
  AdminQuickActions,
} from "./style";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const contests = [
  {
    slug: "GH01",
    title: "Ghost Hydra Breach",
    difficulty: "Hard",
    reward: 1500,
    participants: 47,
    deadline: "2025-11-12",
    status: "Active",
  },
  {
    slug: "NX42",
    title: "Neon Nexus Firewall",
    difficulty: "Medium",
    reward: 900,
    participants: 82,
    deadline: "2025-10-05",
    status: "Active",
  },
  {
    slug: "CR27",
    title: "Cipher Relay", 
    difficulty: "Easy",
    reward: 400,
    participants: 120,
    deadline: "2025-09-18",
    status: "Closed",
  },
];

const Page = () => {
  return (
    <>
      <AdminContentHeader>
        <AdminContentTitle
          className={`${orbitron.className} uppercase tracking-[0.25em]`}
        >
          Contests Command Deck
        </AdminContentTitle>
        <AdminContentDescription>
          Review active operations, monitor hunter activity, and deploy new
          missions when ready. Maintain the neon edge and keep OPS GLITCH secure.
        </AdminContentDescription>
      </AdminContentHeader>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm tracking-[0.2em] text-emerald-200 uppercase">
          Total contests: {contests.length}
        </p>
        <Button
          asChild
          className="gap-2 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-400/30"
        >
          <Link href="/ui/controller/protected/admin-pannel/create-challenge">
            Launch New Contest
          </Link>
        </Button>
      </div>

      <AdminQuickActions>
        {contests.map(
          ({ slug, title, difficulty, reward, participants, deadline, status }) => (
            <AdminQuickActionCard key={slug}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                  #{slug}
                </span>
                <span className="rounded-full border border-emerald-400/30 px-2 py-0.5 text-xs uppercase tracking-[0.18em] text-emerald-200">
                  {status}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <AdminQuickActionTitle className="text-lg">
                  {title}
                </AdminQuickActionTitle>
                <AdminQuickActionDescription className="flex items-center gap-2 text-sm text-slate-400">
                  <BadgeCheck className="size-4 text-emerald-300" />
                  Difficulty: {difficulty}
                </AdminQuickActionDescription>
              </div>

              <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                <span className="flex items-center gap-2">
                  <Coins className="size-4 text-emerald-300" />
                  Reward Pool: ${reward.toLocaleString()}
                </span>
                <span className="flex items-center gap-2">
                  <CalendarClock className="size-4 text-emerald-300" />
                  Deadline: {deadline}
                </span>
                <span>Active hunters: {participants}</span>
              </div>

              <Button
                asChild
                variant="secondary"
                size="sm"
                className="mt-auto w-fit bg-emerald-500/20 text-emerald-200 hover:bg-emerald-400/30"
              >
                <Link href={`/ui/controller/protected/admin-pannel/contests/${slug.toLowerCase()}`}>
                  View Briefing
                </Link>
              </Button>
            </AdminQuickActionCard>
          ),
        )}
      </AdminQuickActions>
    </>
  );
};

export default Page;
