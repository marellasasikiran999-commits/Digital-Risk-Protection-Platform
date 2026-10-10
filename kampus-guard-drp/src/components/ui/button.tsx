import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] btn-shimmer relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:shadow-blue-500/40",
        destructive:
          "bg-rose-600 text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 hover:shadow-rose-500/40",
        outline:
          "border border-slate-700 bg-slate-900/40 hover:bg-slate-800 text-slate-200 hover:text-white hover:border-slate-600",
        secondary:
          "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/60",
        ghost:
          "hover:bg-slate-800/60 hover:text-white text-slate-400",
        link:
          "text-blue-400 underline-offset-4 hover:underline",
        cyber:
          "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 border border-blue-400/30",
        glowEmerald:
          "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 hover:shadow-emerald-500/40",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-[11px]",
        lg: "h-11 rounded-xl px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
