"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Users2, Settings } from "lucide-react";
import { Orbitron } from "next/font/google";
import GridPattern from "@/app/commonComponents/GridPattern/GridPattern";
import WireframeSpheres from "@/app/commonComponents/Sphere/WireframeSphere";
import { Button } from "@/components/ui/button";
import {
  AdminPannelContainer,
  AdminPannelWrapper,
  AdminBackdrop,
  AdminSidebar,
  AdminSidebarHeader,
  AdminSidebarTitle,
  AdminSidebarSubtitle,
  AdminSidebarNav,
  AdminContent,
  AdminContentHeader,
  AdminContentTitle,
  AdminContentDescription,
  AdminQuickActions,
  AdminQuickActionCard,
  AdminQuickActionTitle,
  AdminQuickActionDescription,
} from "./style";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const navItems = [
  {
    label: "Overview",
    href: "/ui/controller/protected/admin-pannel",
    icon: LayoutDashboard,
    description: "Monitor system health and recent activity.",
  },
  {
    label: "Create Challenge",
    href: "/ui/controller/protected/admin-pannel/create-challenge",
    icon: Target,
    description: "Launch a new bug bounty challenge.",
  },
  {
    label: "Manage Teams",
    href: "/ui/controller/protected/admin-pannel/teams",
    icon: Users2,
    description: "Coordinate internal and external teams.",
  },
  {
    label: "Settings",
    href: "/ui/controller/protected/admin-pannel/settings",
    icon: Settings,
    description: "Configure access and platform preferences.",
  },
];

const Page = () => {
  const pathname = usePathname();

  return (
    <AdminPannelContainer>
      <AdminBackdrop>
        <GridPattern />
        <WireframeSpheres />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,146,0.12),rgba(5,6,10,0.85))] mix-blend-screen opacity-80" />
      </AdminBackdrop>
      <AdminPannelWrapper>
        <AdminSidebar>
          <AdminSidebarHeader>
            <AdminSidebarTitle className={`${orbitron.className} uppercase tracking-[0.35em] text-[#00d492]`}>
              Ops. Glitch
            </AdminSidebarTitle>
            <AdminSidebarSubtitle>
              Navigate between core operations.
            </AdminSidebarSubtitle>
          </AdminSidebarHeader>

          <AdminSidebarNav>
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Button
                  key={href}
                  asChild
                  variant="ghost"
                  size="lg"
                  className={`justify-start gap-3 font-medium border border-transparent transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200 shadow-[0_0_18px_rgba(0,212,146,0.35)]"
                      : "text-slate-200 hover:bg-emerald-400/10 hover:text-emerald-200 hover:border-emerald-400/40"
                  }`}
                >
                  <Link href={href}>
                    <Icon className="size-5" />
                    {label}
                  </Link>
                </Button>
              );
            })}
          </AdminSidebarNav>
        </AdminSidebar>

        <AdminContent>
          <AdminContentHeader>
            <AdminContentTitle className={`${orbitron.className} uppercase tracking-[0.25em]`}>
              Welcome back, Commander.
            </AdminContentTitle>
            <AdminContentDescription>
              Keep the platform secure, launch new challenges, and coordinate
              your response units. Select an operation from the left to begin.
            </AdminContentDescription>
          </AdminContentHeader>

          <AdminQuickActions>
            {navItems.slice(1, 3).map(({ label, description, href, icon: Icon }) => (
              <AdminQuickActionCard key={href}>
                <Icon className="size-5 text-emerald-300" />
                <div>
                  <AdminQuickActionTitle>{label}</AdminQuickActionTitle>
                  <AdminQuickActionDescription>
                    {description}
                  </AdminQuickActionDescription>
                </div>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="mt-auto w-fit bg-emerald-500/20 text-emerald-200 hover:bg-emerald-400/30"
                >
                  <Link href={href}>Open</Link>
                </Button>
              </AdminQuickActionCard>
            ))}
          </AdminQuickActions>
        </AdminContent>
      </AdminPannelWrapper>
    </AdminPannelContainer>
  );
};

export default Page;
