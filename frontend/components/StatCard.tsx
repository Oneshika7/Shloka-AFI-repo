"use client";
import React from "react";
import GlassCard from "./GlassCard";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon,
  delay = 0,
}: StatCardProps) {
  return (
    <GlassCard delay={delay} className="flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-bold font-serif tracking-tight">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0">
          {icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center space-x-1.5 text-xs">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-sage-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          )}
          <span className={isPositive ? "text-sage-500 font-semibold" : "text-rose-500 font-semibold"}>
            {change}
          </span>
          <span className="text-sandy-500 opacity-60">vs last cycle</span>
        </div>
      )}
    </GlassCard>
  );
}
