"use client";
import React from "react";
import { motion } from "framer-motion";

interface CustomButtonProps extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    | 'onDrag'
    | 'onDragStart'
    | 'onDragEnd'
    | 'onDragEnter'
    | 'onDragExit'
    | 'onDragLeave'
    | 'onDragOver'
    | 'onDrop'
    | 'onAnimationStart'
    | 'onAnimationEnd'
    | 'onAnimationIteration'
    | 'onTransitionEnd'
    | 'onTransitionRun'
  > {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function CustomButton({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  ...props
}: CustomButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base tracking-wide",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-gold-600 via-gold-500 to-sandy-500 text-sandy-950 font-semibold shadow-md shadow-gold-500/10 hover:shadow-lg hover:shadow-gold-500/20 hover:brightness-110 border border-gold-400/20",
    secondary:
      "bg-sage-600 hover:bg-sage-500 text-sage-50 shadow-md shadow-sage-500/10 hover:shadow-lg hover:shadow-sage-500/20 border border-sage-500/20",
    outline:
      "bg-transparent hover:bg-gold-500/5 text-gold-600 dark:text-gold-400 border border-gold-500/30 hover:border-gold-500/60",
    ghost:
      "bg-transparent hover:bg-sandy-500/10 text-[var(--foreground)]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2 text-current flex items-center">{icon}</span>}
      {children}
    </motion.button>
  );
}
