import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import StyledComponentsRegistry from "@/lib/registry";
import { Toaster } from "sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlitchOps - Bug Bounty & Debugging Platform",
  description:
    "Enter the world of GlitchOps — a hacker-themed bug bounty playground. Hunt bugs, earn rewards, level up your debugging skills, and dominate the leaderboard.",
  other: {
    "google-site-verification": "HiOOE0gl5vSE9dXEsbfVTE5zIcYdB-fUeXDkL4OvjWI",
  },
  keywords: [
    "bug bounty",
    "debugging challenges",
    "ethical hacking",
    "cybersecurity training",
    "gamified learning",
    "hacker platform",
    "code debugging",
    "GlitchOps",
  ],
  authors: [{ name: "GlitchOps Team", url: "https://www.opsglitch.com" }],
  creator: "GlitchOps",
  publisher: "GlitchOps",
  metadataBase: new URL("https://www.opsglitch.com"),
  openGraph: {
    title: "GlitchOps - Bug Bounty & Debugging Platform",
    description:
      "Join GlitchOps to find bugs, earn rewards, and sharpen your debugging and ethical hacking skills in a neon cyber environment.",
    url: "https://www.opsglitch.com",
    siteName: "GlitchOps",
    images: [
      {
        url: "/Ops.Glitch.png",
        width: 1200,
        height: 630,
        alt: "GlitchOps - Bug Bounty & Debugging Platform",
      },
    ],
    locale: "en_US",
    type: "website",

    determiner: "the",
    emails: ["ops.glitch.hack@gmail.com"]
  },
  twitter: {
    card: "summary_large_image",
    title: "GlitchOps - Bug Bounty & Debugging Platform",
    description:
      "Find bugs. Earn rewards. Level up your debugging skills in a hacker-themed playground.",
    creator: "@GlitchOps",
    images: ["/Ops.Glitch.png"],
  },
  themeColor: "#0ff",
  category: "Cybersecurity",
  icons: {
    icon: "/terminal-icon.svg",
    shortcut: "/terminal-icon.svg",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.opsglitch.com",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
        </Script>


        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={200}>
            <main className="flex-1">
              <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            </main>
            <Toaster position="top-right" theme="dark" richColors closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
