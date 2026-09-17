"use client";
import React, { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon, Command, Sparkles, FolderOpen, ArrowRight, User } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { activeUser } = useUser();
  const [theme, setTheme] = useState("dark");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const activeTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(activeTheme);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const mockSearchResults = [
    { type: "shloka", name: "अश्वगन्धा वातकफशामिनी (Caraka Samhitā)", href: "/workspace" },
    { type: "graph", name: "Ayurvedic Herbs Knowledge Graph Nodes", href: "/graph" },
    { type: "dataset", name: "Extract 50 Verses on Pippalī (JSON)", href: "/datasets" },
  ].filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header className="h-16 glass-panel border-b border-sandy-500/10 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
        {/* Title */}
        <div>
          <h1 className="text-lg font-bold font-serif tracking-wide">{title}</h1>
        </div>

        {/* Action Panel */}
        <div className="flex items-center space-x-6">
          {/* Search Trigger */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center space-x-2 bg-sandy-500/5 hover:bg-sandy-500/10 border border-sandy-500/10 px-4 py-1.5 rounded-xl text-sm text-[var(--foreground)] opacity-70 hover:opacity-100 transition-all duration-300 w-60 justify-between focus:outline-none"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-sandy-500" />
              <span>Search everywhere...</span>
            </div>
            <div className="flex items-center space-x-0.5 text-[10px] bg-sandy-500/15 px-1.5 py-0.5 rounded border border-sandy-500/10 font-sans">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </button>

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[var(--foreground)] hover:bg-sandy-500/10 transition-colors focus:outline-none"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5 text-sandy-800" />}
          </button>

          {/* Notification Alert Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-[var(--foreground)] hover:bg-sandy-500/10 transition-colors focus:outline-none"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gold-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[var(--background)]" />
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 glass-panel border border-sandy-500/10 rounded-2xl p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between border-b border-sandy-500/5 pb-2 mb-3">
                  <h4 className="font-semibold text-xs text-gold-500">Pipeline Activities</h4>
                  <button className="text-[10px] text-sandy-500 hover:text-gold-500">Clear all</button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-1.5 rounded-lg hover:bg-sandy-500/5 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-sage-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Ayurvedic pipeline run completed</p>
                      <p className="text-[10px] text-sandy-500">Ontological alignment match: 98%</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-1.5 rounded-lg hover:bg-sandy-500/5 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-gold-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Knowledge Graph Nodes compiled</p>
                      <p className="text-[10px] text-sandy-500">New nodes: 154 | Edges: 240</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-1.5 rounded-lg hover:bg-sandy-500/5 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Validation failure in Pippalī-Export</p>
                      <p className="text-[10px] text-rose-500/80">Entity mapping failed on 2 verses</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-sandy-500/10">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold leading-none">{activeUser?.name || "Loading..."}</p>
              <p className="text-[10px] text-sandy-500 mt-1">{activeUser?.organization || "---"}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-600 font-bold">
              {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette Dialog Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-xl glass-panel border border-sandy-500/15 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 py-3.5 border-b border-sandy-500/10">
              <Search className="w-5 h-5 text-gold-500 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search Sanskrit concepts, verses, nodes, datasets..."
                className="w-full bg-transparent text-[var(--foreground)] placeholder-sandy-500/60 text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => setShowSearch(false)}
                className="text-xs text-sandy-500 hover:text-gold-500 ml-3 shrink-0 border border-sandy-500/20 px-2 py-0.5 rounded"
              >
                ESC
              </button>
            </div>
            
            <div className="p-4 max-h-80 overflow-y-auto">
              {mockSearchResults.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="text-[10px] text-sandy-500 uppercase font-semibold tracking-wider px-2 mb-2">Search Results</div>
                  {mockSearchResults.map((res, i) => (
                    <a
                      key={i}
                      href={res.href}
                      onClick={() => setShowSearch(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-sandy-500/5 border border-transparent hover:border-sandy-500/10 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        {res.type === "shloka" && <Sparkles className="w-4 h-4 text-gold-500" />}
                        {res.type === "graph" && <FolderOpen className="w-4 h-4 text-sage-500" />}
                        {res.type === "dataset" && <ArrowRight className="w-4 h-4 text-rose-500" />}
                        <span className="text-sm">{res.name}</span>
                      </div>
                      <span className="text-xs text-sandy-500 opacity-0 group-hover:opacity-100 transition-opacity">Go to page &rarr;</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sandy-500 text-sm">
                  No records matching your search query. Try typing `अश्वगन्धा` or `Nodes`.
                </div>
              )}
            </div>

            <div className="p-3 bg-sandy-500/5 border-t border-sandy-500/10 flex items-center justify-between text-[10px] text-sandy-500">
              <div className="flex items-center space-x-3">
                <span>&uarr;&darr; Navigate</span>
                <span>&crarr; Select</span>
              </div>
              <span>Press ESC to exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
