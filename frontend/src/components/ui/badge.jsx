import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-100 text-brand-700",
        outline: "border-border text-navy-700",
        high: "border-transparent bg-risk-high-soft text-risk-high",
        medium: "border-transparent bg-risk-medium-soft text-amber-700",
        low: "border-transparent bg-risk-low-soft text-risk-low",
        neutral: "border-transparent bg-navy-100 text-navy-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
