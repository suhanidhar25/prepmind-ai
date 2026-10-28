import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
        secondary: "border-zinc-600/40 bg-zinc-800/50 text-zinc-300",
        success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
        destructive: "border-red-400/30 bg-red-500/10 text-red-300",
        outline: "border-yellow-400/30 text-zinc-300",
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
