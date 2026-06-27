"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type PremiumButtonVariant = "primary" | "secondary" | "ghost" | "icon";
type PremiumButtonSize = "sm" | "md" | "lg";

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PremiumButtonVariant;
  size?: PremiumButtonSize;
}

const variantStyles: Record<PremiumButtonVariant, string> = {
  primary: [
    "bg-gradient-to-b from-[#d4af37] via-[#c9a227] to-[#b8960b]",
    "text-[#0a0a0a] font-semibold",
    "border border-[#d4af37]/40",
    "shadow-[0_1px_2px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.15)]",
    "hover:from-[#ebd08f] hover:via-[#d4af37] hover:to-[#c9a227]",
    "hover:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_8px_20px_rgba(212,175,55,0.15),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.15)]",
    "hover:border-[#d4af37]/60",
    "active:from-[#b8960b] active:via-[#a88400] active:to-[#9a7d0a]",
    "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
  ].join(" "),
  secondary: [
    "bg-gradient-to-b from-[#1e1e1e] to-[#161616]",
    "text-[#d4af37] font-medium",
    "border border-[#d4af37]/20",
    "shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)]",
    "hover:from-[#252525] hover:to-[#1e1e1e]",
    "hover:border-[#d4af37]/35",
    "hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),0_0_12px_rgba(212,175,55,0.06),inset_0_1px_0_rgba(255,255,255,0.05)]",
    "active:from-[#161616] active:to-[#121212]",
    "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[#b0b0b0] font-medium",
    "border border-transparent",
    "hover:text-[#d4af37] hover:bg-[#161616]",
    "active:bg-[#1e1e1e] active:text-[#d4af37]",
  ].join(" "),
  icon: [
    "bg-gradient-to-b from-[#1e1e1e] to-[#161616]",
    "text-[#b0b0b0]",
    "border border-[rgba(255,255,255,0.05)]",
    "shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)]",
    "hover:text-[#d4af37] hover:border-[#d4af37]/20",
    "hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),0_0_8px_rgba(212,175,55,0.05)]",
    "active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]",
  ].join(" "),
};

const sizeStyles: Record<PremiumButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-2.5 text-sm rounded-lg gap-2",
};

const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "premium-btn inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-out",
          "select-none cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/30 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0a0a]",
          "disabled:pointer-events-none disabled:opacity-40",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PremiumButton.displayName = "PremiumButton";

export { PremiumButton, type PremiumButtonProps, type PremiumButtonVariant, type PremiumButtonSize };