"use client";
import React from "react";
import Link from "next/link";
import { Landmark, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[var(--background)] shloka-grid-bg">
      {/* Split Auth layout: Forms on the left, branding asset on the right */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8 flex items-center space-x-2">
            <Link href="/about" className="flex items-center space-x-2">
              <Landmark className="w-8 h-8 text-gold-500" />
              <span className="font-serif text-xl font-bold tracking-wider text-[var(--foreground)]">SHLOKA-AFI</span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden lg:block relative flex-1 w-0 bg-sandy-900 overflow-hidden border-l border-sandy-500/10">
        {/* Floating gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-sandy-950 via-sandy-900 to-gold-950 opacity-95" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[80px]" />
        
        {/* Sacred Geometry background elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[600px] h-[600px] rounded-full border border-gold-500 animate-spin" style={{ animationDuration: '100s' }} />
          <div className="absolute w-[450px] h-[450px] rounded-full border border-sage-500 animate-spin" style={{ animationDuration: '60s', animationDirection: 'reverse' }} />
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-16 z-10 text-sandy-100">
          <div className="flex items-center space-x-2 text-gold-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-sans font-semibold">Ayurvedic NLP Core</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold font-serif leading-tight text-white">
              Unlocking Ancient Wisdom <br />
              With Modern AI
            </h2>
            <p className="text-sm text-sandy-300 max-w-md leading-relaxed font-sans">
              SHLOKA-AFI structures botanical properties, formulas, and treatments from ancient treatises, transforming them into graph structures for clinical validation and dataset construction.
            </p>
          </div>

          <div className="border-t border-sandy-500/20 pt-6 flex items-center justify-between text-xs text-sandy-400">
            <span>Powered by Next.js & Tailwind CSS v4</span>
            <span>&copy; SHLOKA-AFI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
