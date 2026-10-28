import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-r from-yellow-400 to-yellow-300 text-black shadow-lg hover:shadow-xl hover:from-yellow-300 hover:to-yellow-200 active:scale-95",
        secondary:
          "bg-zinc-900/80 border border-yellow-400/20 text-zinc-100 hover:bg-zinc-800/80 hover:border-yellow-400/40",
        outline:
          "border border-yellow-400/30 text-zinc-100 hover:bg-yellow-400/10 hover:border-yellow-400/60",
        ghost:
          "text-zinc-100 hover:bg-zinc-800/60 active:bg-zinc-700/60",
        premium:
          "bg-linear-to-r from-yellow-500 via-yellow-400 to-yellow-300 text-black shadow-xl hover:shadow-2xl hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-200 active:scale-95 font-semibold",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
        xl: "px-8 py-4 text-lg",
        icon: "h-10 w-10 p-0",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
