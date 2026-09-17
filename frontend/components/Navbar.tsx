"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Menu, X, Landmark } from "lucide-react";
import CustomButton from "./CustomButton";

export default function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const activeTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent pt-0 pb-2">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
        {/* Left: Minimal Logo Icon */}
        <div className="flex items-center">
          <Link href="/about" className="text-[var(--foreground)] opacity-90 hover:opacity-100 transition-opacity">
            <img src="/logo.png" alt="Shloka AFI Logo" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain" />
          </Link>
        </div>
        
        {/* Center: Hero Page Sections */}
        <div className="hidden md:flex items-center space-x-10">
          <Link href="#capabilities" className="text-xs md:text-sm font-medium text-[var(--foreground)] opacity-80 hover:opacity-100 transition-opacity tracking-widest uppercase">Capabilities</Link>
          <Link href="#architecture" className="text-xs md:text-sm font-medium text-[var(--foreground)] opacity-80 hover:opacity-100 transition-opacity tracking-widest uppercase">Architecture</Link>
          <Link href="#stack" className="text-xs md:text-sm font-medium text-[var(--foreground)] opacity-80 hover:opacity-100 transition-opacity tracking-widest uppercase">Tech Stack</Link>
          <Link href="#workflow" className="text-xs md:text-sm font-medium text-[var(--foreground)] opacity-80 hover:opacity-100 transition-opacity tracking-widest uppercase">Workflow</Link>
        </div>

        {/* Right: Sign In Pill Button & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <Link href="/login" className="inline-flex items-center justify-center px-6 py-2.5 bg-[var(--foreground)] text-[var(--background)] text-xs font-bold tracking-widest uppercase rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
              Sign In &rarr;
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--background)] border-b border-[var(--foreground)]/10 px-6 pt-4 pb-8 space-y-6 absolute top-full left-0 w-full shadow-lg">
          <Link
            href="#capabilities"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] opacity-80 hover:opacity-100 tracking-widest uppercase text-center"
          >
            Capabilities
          </Link>
          <Link
            href="#architecture"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] opacity-80 hover:opacity-100 tracking-widest uppercase text-center"
          >
            Architecture
          </Link>
          <Link
            href="#stack"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] opacity-80 hover:opacity-100 tracking-widest uppercase text-center"
          >
            Tech Stack
          </Link>
          <Link
            href="#workflow"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-[var(--foreground)] opacity-80 hover:opacity-100 tracking-widest uppercase text-center"
          >
            Workflow
          </Link>
          <div className="flex justify-center pt-4">
            <Link href="/login" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center px-8 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm font-bold tracking-widest uppercase rounded-full">
              Sign In &rarr;
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
