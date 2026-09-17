"use client";
import React, { useState, useEffect, useRef } from "react";
import { User, Sliders, Save, Sun, Moon, Monitor, Check, Upload, BookOpen, RefreshCw, FileText } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Header from "@/components/Header";
import GlassCard from "@/components/GlassCard";
import CustomButton from "@/components/CustomButton";

const API = "";

export default function SettingsPage() {
  const { activeUser, users, switchUser, refreshUsers, loading: userLoading } = useUser();

  const [theme, setTheme] = useState("dark");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [saved, setSaved] = useState(false);

  // Dictionary state
  const [dictInfo, setDictInfo] = useState<{ count: number; lastUpdated: string } | null>(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictUploading, setDictUploading] = useState(false);
  const [dictSuccess, setDictSuccess] = useState(false);
  const [dictError, setDictError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeUser) {
      setName(activeUser.name || "");
      setEmail(activeUser.email || "");
      setOrg(activeUser.organization || "");
      setTheme(activeUser.theme || "dark");
    }
  }, [activeUser]);

  useEffect(() => {
    // Load dictionary info
    fetchDictInfo();
  }, []);

  const fetchDictInfo = async () => {
    setDictLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/dictionary`);
      if (res.ok) {
        const data = await res.json();
        setDictInfo({ count: data.count || 0, lastUpdated: data.last_updated || "Unknown" });
      }
    } catch (e) {
      console.warn("Dictionary fetch failed:", e);
    } finally {
      setDictLoading(false);
    }
  };

  const changeTheme = async (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (activeUser) {
      await fetch(`${API}/api/v1/users/${activeUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization: org, theme: newTheme }),
      });
      refreshUsers();
    }
  };

  const saveProfile = async () => {
    if (!activeUser) return;
    try {
      await fetch(`${API}/api/v1/users/${activeUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization: org, theme }),
      });
      setSaved(true);
      refreshUsers();
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  const handleDictUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDictUploading(true);
    setDictError(null);
    setDictSuccess(false);
    try {
      const text = await file.text();
      let parsed: any;
      if (file.name.endsWith(".json")) {
        parsed = JSON.parse(text);
      } else if (file.name.endsWith(".csv")) {
        // Basic CSV parse: first line = headers
        const lines = text.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
        parsed = lines.slice(1).map(line => {
          const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
          const obj: any = {};
          headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
          return obj;
        });
      } else {
        throw new Error("Only JSON or CSV files are supported.");
      }
      const res = await fetch(`${API}/api/v1/dictionary/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dictionary: parsed }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }
      setDictSuccess(true);
      await fetchDictInfo();
      setTimeout(() => setDictSuccess(false), 3000);
    } catch (err: any) {
      setDictError(err.message || "Upload failed");
    } finally {
      setDictUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const themes = [
    { id: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { id: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    { id: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Settings" />
      <div className="flex-1 p-8 space-y-8 max-w-3xl w-full mx-auto overflow-y-auto font-sans">


        {/* Profile */}
        <GlassCard>
          <h3 className="font-serif text-lg font-bold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-gold-500" /> Researcher Profile
          </h3>
          <div className="space-y-4">
            {[
              { label: "Full Name", value: name, set: setName },
              { label: "Email Address", value: email, set: setEmail },
              { label: "Organization", value: org, set: setOrg },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-1.5">{label}</label>
                <input
                  className="w-full bg-sandy-500/5 border border-sandy-500/10 focus:border-gold-500/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
                  value={value}
                  onChange={e => set(e.target.value)}
                />
              </div>
            ))}
            <div className="pt-2">
              <button
                onClick={saveProfile}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${saved ? "bg-sage-500/20 text-sage-500 border border-sage-500/30" : "bg-gold-500 text-[#1a1208] hover:bg-gold-400"}`}
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Theme */}
        <GlassCard>
          <h3 className="font-serif text-lg font-bold mb-6 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-gold-500" /> Appearance
          </h3>
          <div className="flex gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-semibold transition-all ${theme === t.id ? "border-gold-500/50 bg-gold-500/10 text-gold-600" : "border-sandy-500/15 hover:bg-sandy-500/10 text-sandy-500"}`}
              >
                {t.icon}
                {t.label}
                {theme === t.id && <Check className="w-3.5 h-3.5 text-gold-500" />}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Dictionary Upload */}
        <GlassCard>
          <h3 className="font-serif text-lg font-bold mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold-500" /> Certified Ayurvedic Dictionary
          </h3>
          <p className="text-xs text-sandy-500 mb-6">
            Upload your certified dictionary (JSON or CSV) to use as the authoritative source for shloka transliteration and term grounding. The LLM will prefer these definitions over its training data.
          </p>

          {/* Current dictionary info */}
          <div className="p-4 rounded-xl border border-sandy-500/10 bg-sandy-500/5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-sandy-500 uppercase tracking-widest">Current Dictionary</span>
              <button onClick={fetchDictInfo} className="p-1 rounded hover:bg-sandy-500/10 transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 text-sandy-500 ${dictLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
            {dictLoading ? (
              <p className="text-xs text-sandy-500">Loading...</p>
            ) : dictInfo ? (
              <div className="flex items-center gap-6 text-xs">
                <div><p className="font-bold text-gold-600 text-lg">{dictInfo.count}</p><p className="text-sandy-500">Terms</p></div>
                <div><p className="font-semibold">{dictInfo.lastUpdated}</p><p className="text-sandy-500">Last Updated</p></div>
              </div>
            ) : (
              <p className="text-xs text-sandy-500">No dictionary info available. Backend may be offline.</p>
            )}
          </div>

          {/* Upload area */}
          <div className="border-2 border-dashed border-sandy-500/20 hover:border-gold-500/40 rounded-xl p-8 text-center transition-all relative cursor-pointer group hover:bg-gold-500/5">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleDictUpload}
              disabled={dictUploading}
            />
            {dictUploading ? (
              <div className="space-y-2">
                <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
                <p className="text-sm font-semibold">Uploading and processing...</p>
              </div>
            ) : dictSuccess ? (
              <div className="space-y-2">
                <Check className="w-8 h-8 text-sage-500 mx-auto" />
                <p className="text-sm font-semibold text-sage-500">Dictionary updated successfully!</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-gold-500/60 mx-auto group-hover:text-gold-500 transition-colors" />
                <p className="text-sm font-semibold">Drop your dictionary file here</p>
                <p className="text-xs text-sandy-500">Supports JSON or CSV format</p>
              </div>
            )}
          </div>

          {dictError && (
            <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {dictError}
            </div>
          )}

          {/* Format guide */}
          <div className="mt-5">
            <p className="text-xs font-semibold text-sandy-500 uppercase tracking-widest mb-2">Expected JSON Format</p>
            <pre className="text-[10px] bg-sandy-500/5 border border-sandy-500/10 rounded-xl p-4 overflow-x-auto text-sandy-400 leading-relaxed">{`[
  {
    "term": "Ashwagandha",
    "devanagari": "अश्वगन्धा",
    "transliteration": "Aśvagandha",
    "category": "dravya",
    "definition": "Withania somnifera...",
    "botanical_name": "Withania somnifera"
  }
]`}</pre>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}