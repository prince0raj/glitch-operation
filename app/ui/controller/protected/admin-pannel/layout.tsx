"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Orbitron } from "next/font/google";
import {
  LayoutDashboard,
  Mailbox,
  MessageSquare,
  Target,
  Users2,
  Settings,
  Loader2,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import GridPattern from "@/app/commonComponents/GridPattern/GridPattern";
import WireframeSpheres from "@/app/commonComponents/Sphere/WireframeSphere";
import { Button } from "@/components/ui/button";
import {
  AdminBackdrop,
  AdminContent,
  AdminPannelContainer,
  AdminPannelWrapper,
  AdminSidebar,
  AdminSidebarHeader,
  AdminSidebarNav,
  AdminSidebarSubtitle,
  AdminSidebarTitle,
} from "./style";
import { Constants } from "@/app/utils/Constants";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

interface AdminNavItem {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

const navItems: AdminNavItem[] = [
  {
    label: "Contests",
    href: "/ui/controller/protected/admin-pannel",
    icon: LayoutDashboard,
    description: "Monitor and manage all live security contests.",
  },
  {
    label: "Contact Messages",
    href: "/ui/controller/protected/admin-pannel/contact-messages",
    icon: Mailbox,
    description: "Review transmissions sent via the contact portal.",
  },
  {
    label: "Testimonials",
    href: "/ui/controller/protected/admin-pannel/testimonials",
    icon: MessageSquare,
    description: "Manage social proof from hunters and partners.",
  },
  // {
  //   label: "Create Contest",
  //   href: "/ui/controller/protected/admin-pannel/create-challenge",
  //   icon: Target,
  //   description: "Launch a new bug bounty operation.",
  // },
  // {
  //   label: "Teams",
  //   href: "/ui/controller/protected/admin-pannel/teams",
  //   icon: Users2,
  //   description: "Coordinate internal squads and guest researchers.",
  // },
  // {
  //   label: "Settings",
  //   href: "/ui/controller/protected/admin-pannel/settings",
  //   icon: Settings,
  //   description: "Fine-tune access and platform preferences.",
  // },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignout = () => {
    localStorage.removeItem(Constants.OPS_GLITCH_TOKEN);
    router.replace("/ui/controller/admin-login");
  };

  const LogoutButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        onClick={() => {
          handleSignout();
        }}
        variant="ghost"
        size="lg"
        disabled={pending}
        className="w-full cursor-pointer justify-start gap-3 font-medium border border-transparent text-red-300 hover:text-red-200 hover:bg-red-500/10 hover:border-red-500/40 disabled:opacity-60 disabled:pointer-events-none"
      >
        {pending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <LogOut className="size-5" />
        )}
        {pending ? "Logging out..." : "Logout"}
      </Button>
    );
  };

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
            <AdminSidebarTitle
              className={`${orbitron.className} uppercase tracking-[0.35em] text-[#00d492]`}
            >
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

          <div className="mt-auto pt-4 border-t border-white/10">
            <LogoutButton />
          </div>
        </AdminSidebar>

        <AdminContent>
          <div className="relative flex h-full flex-col gap-10 overflow-y-auto">
            {children}
          </div>
        </AdminContent>
      </AdminPannelWrapper>
    </AdminPannelContainer>
  );
};

export default AdminLayout;
