import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-cyber",
  {
    variants: {
      variant: {
        default:
          "border-blue-400/30 bg-blue-500/15 text-blue-300 backdrop-blur-md shadow-[0_0_12px_rgba(59,130,246,0.2)] hover:bg-blue-500/25",
        secondary:
          "border-white/10 bg-white/[0.06] text-slate-300 backdrop-blur-md shadow-[0_0_10px_rgba(0,0,0,0.2)] hover:bg-white/[0.1]",
        destructive:
          "border-rose-400/30 bg-rose-500/15 text-rose-300 backdrop-blur-md shadow-[0_0_12px_rgba(244,63,94,0.25)] hover:bg-rose-500/25",
        outline:
          "border-white/15 text-slate-300 backdrop-blur-md hover:bg-white/5",
        success:
          "border-emerald-400/30 bg-emerald-500/15 text-emerald-300 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:bg-emerald-500/25",
        warning:
          "border-amber-400/30 bg-amber-500/15 text-amber-300 backdrop-blur-md shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:bg-amber-500/25",
        cyber:
          "border-cyan-400/30 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-200 backdrop-blur-md shadow-[0_0_12px_rgba(6,182,212,0.25)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
