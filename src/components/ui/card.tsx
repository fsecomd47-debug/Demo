"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/design-system";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, glow, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, ...(glow ? { boxShadow: "0 20px 60px rgba(201,169,110,0.15)" } : {}) } : {}}
      className={cn(
        "rounded-xl bg-surface p-6 shadow-premium transition-shadow duration-300",
        hover && "cursor-pointer",
        glow && "shadow-glow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
