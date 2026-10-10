import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-cyber",
  {
    variants: {
      variant: {
        default:
          "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20",
        secondary:
          "border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-800",
        destructive:
          "border-rose-500/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25",
        outline:
          "border-slate-700 text-slate-300",
        success:
          "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25",
        warning:
          "border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25",
        cyber:
          "border-cyan-500/40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-200 shadow-sm shadow-cyan-500/20",
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
