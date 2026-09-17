"use client";
import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  hoverGlow?: boolean;
  onClick?: () => void;
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  animate = true,
  hoverGlow = true,
  onClick,
  delay = 0,
}: GlassCardProps) {
  const cardClasses = `glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
    hoverGlow ? "glow-hover" : ""
  } ${onClick ? "cursor-pointer" : ""} ${className}`;

  if (!animate) {
    return (
      <div className={cardClasses} onClick={onClick}>
        {/* Subtle decorative geometric overlay */}
        <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gold-500/5 blur-xl pointer-events-none" />
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={onClick ? { y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cardClasses}
      onClick={onClick}
    >
      <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gold-500/5 blur-xl pointer-events-none" />
      {children}
    </motion.div>
  );
}
