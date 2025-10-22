"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface SelectProps extends React.ComponentProps<"select"> {
  hasPlaceholder?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasPlaceholder = false, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md border border-emerald-500/25 bg-slate-950/60 px-4 text-sm text-slate-100 shadow-[0_5px_20px_rgba(2,6,23,0.35)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          hasPlaceholder && "text-slate-500",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";

export { Select };
