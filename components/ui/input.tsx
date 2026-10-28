import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-blue-200/20 bg-slate-800/50 px-4 py-2 text-sm text-slate-100 placeholder:text-zinc-500 transition-all duration-200 focus:outline-none focus:border-blue-300/50 focus:ring-2 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
