"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ParticleCard, GlobalSpotlight } from "@/components/MagicBento";
import {
  FileSpreadsheet,
  Languages,
  BrainCircuit,
  Bookmark,
  Network,
  Settings,
  Orbit,
  Landmark,
  User,
  LogOut,
  Sparkles
} from "lucide-react";
import { useUser } from "@/context/UserContext";

const navItems = [
  { name: "Shloka Workspace", path: "/workspace", icon: FileSpreadsheet },
  { name: "AI Insights Center", path: "/insights", icon: BrainCircuit },
  { name: "Collections", path: "/collections", icon: Bookmark },
  { name: "Knowledge Graph", path: "/graph", icon: Network },
  { name: "VR Pathshala", path: "/vr-room", icon: Orbit },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { activeUser } = useUser();
  const gridRef = useRef<HTMLElement>(null);

  return (
    <aside className="w-64 fixed inset-y-0 left-0 glass-panel border-r border-sandy-500/10 flex flex-col z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-sandy-500/10">
        <Link href="/about" className="flex items-center space-x-3">
          <img src="/logo.png" alt="Shloka AFI Logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col">
            <span className="font-serif text-base font-bold tracking-wider leading-none text-[var(--foreground)]">SHLOKA-AFI</span>
            <span className="text-[9px] tracking-widest uppercase text-sandy-500 font-sans">AI KNOWLEDGE ENGINE</span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav ref={gridRef} className="flex-1 px-4 py-6 space-y-2 overflow-y-auto bento-section">
        <GlobalSpotlight 
          gridRef={gridRef} 
          targetClass=".magic-sidebar-item" 
          spotlightRadius={200} 
          glowColor="229, 164, 59" 
        />
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <ParticleCard
              key={item.path}
              className="magic-sidebar-item magic-bento-card--border-glow rounded-xl"
              enableTilt={true}
              clickEffect={true}
              enableMagnetism={true}
              glowColor="229, 164, 59"
              style={{ '--glow-color': '229, 164, 59', '--glow-intensity': '0', '--glow-x': '50%', '--glow-y': '50%', '--glow-radius': '200px' } as React.CSSProperties}
            >
              <Link
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative z-10 ${
                  isActive
                    ? "bg-gradient-to-r from-gold-500/20 to-sandy-500/5 text-gold-500 border-l-2 border-gold-500 shadow-sm shadow-gold-500/5"
                    : "text-[var(--foreground)] opacity-70 hover:opacity-100 hover:bg-sandy-500/5"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-gold-500" : "text-[var(--foreground)] opacity-80"}`} />
                <span>{item.name}</span>
              </Link>
            </ParticleCard>
          );
        })}
      </nav>

      {/* Quick AI Assist Link */}
      <div className="px-4 mb-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-500/10 to-sandy-500/5 border border-gold-500/20 flex flex-col space-y-2 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10">
            <Sparkles className="w-16 h-16 text-gold-500" />
          </div>
          <h4 className="text-xs font-semibold text-gold-500 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ayurveda Agent v1.0</span>
          </h4>
          <p className="text-[10px] text-[var(--foreground)] opacity-70 leading-normal">
            Ready to parse complex Caraka Samhitā verses.
          </p>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-sandy-500/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 font-bold">
            {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="flex flex-col max-w-[120px]">
            <span className="text-xs font-semibold leading-tight truncate">{activeUser?.name || "Loading..."}</span>
            <span className="text-[9px] text-sandy-500 font-sans tracking-wide truncate">{activeUser?.organization || "---"}</span>
          </div>
        </div>
        <button
          onClick={async () => {
            await signOut({ redirect: false });
            window.location.href = "/login";
          }}
          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
