"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Folder, FolderPlus, Search, BookOpen, RefreshCw, ChevronRight, Hash, Globe, Clock } from "lucide-react";
import Header from "@/components/Header";
import GlassCard from "@/components/GlassCard";
import MagicBento from "@/components/MagicBento";
import Link from "next/link";

const API = "";

export default function CollectionsPage() {
  const [allShlokas, setAllShlokas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  const fetchShlokas = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/v1/shlokas?limit=200`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      const shlokas = [...(data.shlokas || [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setAllShlokas(shlokas);
      // Auto-select first source
      const sources = Array.from(new Set(shlokas.map((s: any) => s.source || "Uncategorized")));
      if (!activeSource && sources.length > 0) setActiveSource(sources[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeSource]);

  useEffect(() => {
    fetchShlokas();
  }, []);

  // Build folder groups from real source field
  const sources = Array.from(new Set(allShlokas.map((s: any) => s.source || "Uncategorized")));
  const folders = sources.map(src => ({
    name: src,
    count: allShlokas.filter(s => (s.source || "Uncategorized") === src).length,
  }));

  const activeShlokasRaw = allShlokas.filter(s => (s.source || "Uncategorized") === activeSource);
  const activeShlokas = activeShlokasRaw.filter(s =>
    !searchQuery ||
    s.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.translation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const timeAgo = (dt: string) => {
    const diff = Date.now() - new Date(dt).getTime();
    const h = Math.floor(diff / 3600000);
    if (h > 48) return `${Math.floor(h / 24)} days ago`;
    if (h > 0) return `${h}h ago`;
    return `${Math.floor(diff / 60000)}m ago`;
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Research Collections" />
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Folder list */}
        <div className="w-64 border-r border-sandy-500/10 flex flex-col bg-[#f7f3eb]/80 dark:bg-[#0f0d0a]/80 backdrop-blur-md">
          <div className="p-4 border-b border-sandy-500/10 bg-[#f7f3eb]/40 dark:bg-[#0f0d0a]/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-sm text-[var(--foreground)]">Collections</h3>
              <div className="flex items-center gap-1">
                <button onClick={fetchShlokas} className="p-1 rounded hover:bg-sandy-500/10 transition-colors" title="Refresh">
                  <RefreshCw className="w-3.5 h-3.5 text-[var(--foreground)]/70" />
                </button>
                <button onClick={() => setShowNewFolder(v => !v)} className="p-1 rounded hover:bg-sandy-500/10 transition-colors" title="New folder">
                  <FolderPlus className="w-3.5 h-3.5 text-gold-500" />
                </button>
              </div>
            </div>
            {showNewFolder && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Collection name..."
                  className="flex-1 bg-sandy-500/10 border border-sandy-500/20 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-gold-500/50 text-[var(--foreground)]"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && newFolderName.trim()) { setActiveSource(newFolderName.trim()); setNewFolderName(""); setShowNewFolder(false); }}}
                />
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="text-xs text-[var(--foreground)]/60 text-center py-8">Loading...</div>
            ) : folders.length === 0 ? (
              <div className="text-xs text-[var(--foreground)]/60 text-center py-8 px-4">
                No collections yet. Process shlokas in the Workspace first.
              </div>
            ) : (
              folders.map(f => (
                <button
                  key={f.name}
                  onClick={() => setActiveSource(f.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-xs ${activeSource === f.name ? "bg-gold-500/10 border border-gold-500/20 text-gold-600 dark:text-gold-400 font-bold" : "hover:bg-sandy-500/10 text-[var(--foreground)]/70 hover:text-[var(--foreground)]"}`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium truncate max-w-[120px]">{f.name || "Uncategorized"}</span>
                  </div>
                  <span className="text-[10px] font-bold opacity-60">{f.count}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Shloka list */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-sandy-500/10 flex items-center gap-3 bg-[#f7f3eb]/60 dark:bg-[#0f0d0a]/60 backdrop-blur-md">
            <Search className="w-4 h-4 text-[var(--foreground)]/50 shrink-0" />
            <input
              type="text"
              placeholder={`Search in "${activeSource || "collection"}"...`}
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder-[var(--foreground)]/30 text-[var(--foreground)] font-medium"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {activeSource && (
              <span className="text-xs text-[var(--foreground)]/60 font-semibold">{activeShlokas.length} result{activeShlokas.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!activeSource ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-gold-500/40 mx-auto" />
                  <p className="font-serif text-sandy-500">Select a collection to view shlokas</p>
                </div>
              </div>
            ) : activeShlokas.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-gold-500/40 mx-auto" />
                  <p className="font-serif text-sandy-500">{searchQuery ? "No matches found" : "No shlokas in this collection yet"}</p>
                  {!searchQuery && (
                    <Link href="/workspace" className="text-xs text-gold-500 hover:underline flex items-center justify-center gap-1">
                      Process a shloka <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <MagicBento 
                  textAutoHide={false}
                  cards={activeShlokas.map((s: any) => ({
                    title: <span className="font-serif leading-relaxed text-base">{s.text}</span>,
                    description: s.translation ? <span className="italic border-l-2 border-gold-500/30 pl-3 leading-relaxed opacity-80">{s.translation}</span> : "No translation",
                    label: (
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] text-gold-500">
                          <Clock className="w-3 h-3" /> {timeAgo(s.created_at)}
                        </span>
                        {(s.entities?.length || 0) > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-gold-600">
                            <Hash className="w-3 h-3" /> {s.entities.length}
                          </span>
                        )}
                      </div>
                    )
                  }))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}