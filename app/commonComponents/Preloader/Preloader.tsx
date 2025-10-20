"use client";

import { cn } from "@/lib/utils";

type PreloaderProps = {
  message?: string;
  variant?: "inline" | "overlay";
  className?: string;
};

export function Preloader({
  message = "Loading...",
  variant = "inline",
  className,
}: PreloaderProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-[#00d492]/30 border-t-[#00d492] animate-spin" />
      <span className="text-sm uppercase tracking-[0.3em] text-[#00d492]">
        {message}
      </span>
    </div>
  );

  if (variant === "overlay") {
    return (
      <div
        className={cn(
          "absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      {content}
    </div>
  );
}
