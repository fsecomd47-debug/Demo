"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/design-system";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  highlighted?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, highlighted, ...props }, ref) => {
    const id = useId();
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text/80">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full rounded-lg border bg-white px-4 py-3 text-text placeholder:text-text-muted/60 transition-all duration-200",
              "focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none",
              icon && "pl-10",
              error && "border-red-400 focus:border-red-400 focus:ring-red-200",
              highlighted
                ? "border-secondary ring-2 ring-secondary/30 animate-pulse"
                : "border-border",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 animate-slide-up">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
