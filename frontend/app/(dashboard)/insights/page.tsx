"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Brain, Cpu, BarChart2, TrendingUp, Tag, BookOpen, RefreshCw, Leaf, Zap, Activity, ArrowLeft, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import GlassCard from "@/components/GlassCard";

const API_BASE = "";

const entityStyle: Record<string, { badge: string; pill: string; label: string }> = {
  Herb:     { badge: "bg-gold-500/20 border border-gold-500/40 text-gold-600",      pill: "bg-gold-500/10 text-gold-600 border-gold-500/30",    label: "Herb (Dravya)" },
  Dosha:    { badge: "bg-sky-500/20 border border-sky-500/40 text-sky-600",          pill: "bg-sky-500/10 text-sky-600 border-sky-500/30",       label: "Dosha" },
  Disease:  { badge: "bg-rose-500/20 border border-rose-500/40 text-rose-600",       pill: "bg-rose-500/10 text-rose-600 border-rose-500/30",    label: "Disease (Roga)" },
  Karma:    { badge: "bg-sage-500/20 border border-sage-500/40 text-sage-600",       pill: "bg-sage-500/10 text-sage-600 border-sage-500/30",    label: "Action (Karma)" },
  Rasa:     { badge: "bg-purple-500/20 border border-purple-500/40 text-purple-600", pill: "bg-purple-500/10 text-purple-600 border-purple-500/30", label: "Taste (Rasa)" },
};

function entityBadge(type: string) {
  return entityStyle[type]?.badge || "bg-sandy-500/10 border border-sandy-500/20 text-sandy-600";
}

function AnnotatedText({ text, entities }: { text: string; entities: any[] }) {
  if (!entities || entities.length === 0 || !text) {
    return React.createElement("p", { className: "leading-loose text-base font-serif tracking-wide" }, text);
  }
  const matches: { start: number; end: number; entity: any }[] = [];
  const sorted = [...entities].sort((a, b) => (b.name?.length || 0) - (a.name?.length || 0));
  sorted.forEach((ent) => {
    if (!ent.name) return;
    const idx = text.toLowerCase().indexOf(ent.name.toLowerCase());
    if (idx !== -1 && !matches.some((m) => idx >= m.start && idx < m.end)) {
      let endIdx = idx + ent.name.length;
      // Extend endIdx to include any trailing Devanagari combining marks (vowels, halant, anusvara, visarga)
      while (endIdx < text.length && /[\u0900-\u0903\u093A-\u094F\u0951-\u0957\u0962-\u0963]/.test(text[endIdx])) {
        endIdx++;
      }
      matches.push({ start: idx, end: endIdx, entity: ent });
    }
  });
  matches.sort((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start > cursor) parts.push(React.createElement("span", { key: "t" + i }, text.slice(cursor, m.start)));
    const style = entityStyle[m.entity.type];
    parts.push(
      React.createElement("mark", { key: "e" + i, className: "px-1 py-0.5 rounded font-semibold " + (style?.badge || "bg-sandy-500/10"), title: style?.label || m.entity.type }, text.slice(m.start, m.end))
    );
    cursor = m.end;
  });
  if (cursor < text.length) parts.push(React.createElement("span", { key: "end" }, text.slice(cursor)));
  return React.createElement("p", { className: "leading-loose text-base font-serif tracking-wide" }, parts.length > 0 ? parts : text);
}

function strengthBadge(type: string) {
  if (["TREATS", "CURES"].includes(type)) return { label: "Strong", cls: "bg-sage-500/15 text-sage-600 border-sage-500/30" };
  if (["BALANCES", "PACIFIES"].includes(type)) return { label: "Moderate", cls: "bg-gold-500/15 text-gold-600 border-gold-500/30" };
  return { label: "Inferred", cls: "bg-sandy-500/10 text-sandy-500 border-sandy-500/20" };
}

export default function InsightsCenter() {
  const router = useRouter();
  const { data: session } = useSession();
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"session" | "db">("session");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async (forceDb = false) => {
    // Step 1: Try localStorage first (most recent session data) unless forced
    if (!forceDb) {
      try {
        const stored = localStorage.getItem("shloka_insight_data");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.original_text) {
            setPipelineData(parsed);
            setSource("session");
            setLastUpdated(new Date(parsed.created_at || Date.now()));
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("localStorage read failed:", e);
      }
    }

    // Step 2: Fallback to DB (get newest, or random if forced)
    if (!(session as any)?.accessToken) return;

    try {
      const res = await fetch(API_BASE + "/api/v1/shlokas?limit=200", {
        headers: {
          "Authorization": `Bearer ${(session as any).accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.shlokas && data.shlokas.length > 0) {
          const processedShlokas = data.shlokas.filter((s: any) => s.entities && s.entities.length > 0);
          const shlokasToUse = processedShlokas.length > 0 ? processedShlokas : data.shlokas;
          
          let selected;
          if (forceDb) {
            // Pick a random shloka for discovery
            selected = shlokasToUse[Math.floor(Math.random() * shlokasToUse.length)];
          } else {
            // Default to newest
            selected = [...shlokasToUse].sort((a: any, b: any) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0];
          }

          if (selected.entities && selected.entities.length > 0) {
            // Normalize old format (term/category) to new (name/type)
            const normalizedEntities = selected.entities.map((e: any) => ({
              name: e.name || e.term || "",
              type: e.type || (e.category === "herb" ? "Herb" : e.category === "dosha" ? "Dosha" : e.category === "roga" ? "Disease" : "Unknown"),
              confidence: e.confidence || 0.85,
              definition: e.definition || "",
            }));
            setPipelineData({ ...selected, entities: normalizedEntities });
          } else {
            setPipelineData(selected);
          }
          setSource("db");
          setLastUpdated(new Date(selected.created_at));
        }
      }
    } catch (e) {
      console.error("DB fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if ((session as any)?.accessToken) {
      loadData();
    }
  }, [loadData, (session as any)?.accessToken]);

  const entities: any[] = pipelineData?.entities || [];
  const relationships: any[] = pipelineData?.relationships || [];
  const herbEntities    = entities.filter((e: any) => e.type === "Herb");
  const doshaEntities   = entities.filter((e: any) => e.type === "Dosha");
  const diseaseEntities = entities.filter((e: any) => e.type === "Disease");
  const karmaEntities   = entities.filter((e: any) => e.type === "Karma");
  const rasaEntities    = entities.filter((e: any) => e.type === "Rasa");
  const avgConf = entities.length > 0 ? entities.reduce((s: number, e: any) => s + (e.confidence || 0.85), 0) / entities.length : 0.85;

  if (loading) return (
    <div className="flex-1 flex flex-col">
      <Header title="AI Insights Center" />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg opacity-70">Loading insights...</p>
        </div>
      </div>
    </div>
  );

  if (!pipelineData) return (
    <div className="flex-1 flex flex-col">
      <Header title="AI Insights Center" />
      <div className="flex-1 flex items-center justify-center p-8">
        <GlassCard className="max-w-md w-full text-center space-y-6 py-12">
          <Brain className="w-12 h-12 text-gold-500 mx-auto opacity-60" />
          <h3 className="font-serif text-xl font-bold">No Shloka Processed Yet</h3>
          <p className="text-sandy-500 text-sm">Process a shloka in the Workspace first, then click Deep AI Insights.</p>
          <button onClick={() => router.push("/workspace")} className="mx-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-[#1a1208] font-bold text-sm hover:bg-gold-400 transition-all">
            <ArrowLeft className="w-4 h-4" /> Go to Workspace
          </button>
        </GlassCard>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header title="AI Insights Center" />
      <div className="flex-1 p-6 overflow-y-auto space-y-8 max-w-[1400px] w-full mx-auto font-sans">

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold">Shloka Deep Analysis</h2>
            <p className="text-xs text-sandy-500 mt-1">
              {source === "session" ? "Current session result" : "From database"} {lastUpdated ? "- " + lastUpdated.toLocaleTimeString() : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/workspace")} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sandy-500/20 text-sm font-semibold hover:bg-sandy-500/10 transition-all">
              <ArrowLeft className="w-4 h-4" /> Workspace
            </button>
            <button onClick={() => { setLoading(true); loadData(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-[#1a1208] font-bold text-sm hover:bg-gold-400 transition-all">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        <GlassCard>
          <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold">Semantic Text Annotation</h3>
              <p className="text-xs text-sandy-500 mt-1">Detected entities highlighted in the original shloka</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px]">
              {Object.entries(entityStyle).map(([type, s]) => (
                <span key={type} className={"px-2 py-1 rounded border font-semibold " + s.pill}>{s.label}</span>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-xl border border-sandy-500/10 bg-sandy-500/5 mb-4">
            <p className="text-[10px] text-sandy-500 uppercase font-semibold mb-3 tracking-widest">Original Shloka</p>
            <AnnotatedText text={pipelineData.original_text || pipelineData.text || ""} entities={entities} />
          </div>
          {(pipelineData.translation) && (
            <div className="p-5 rounded-xl border border-gold-500/15 bg-gold-500/5 mb-4">
              <p className="text-[10px] text-sandy-500 uppercase font-semibold mb-2 tracking-widest">English Translation</p>
              <p className="text-sm leading-relaxed opacity-90">{pipelineData.translation}</p>
            </div>
          )}
          {entities.length > 0 && (
            <div>
              <p className="text-[10px] text-sandy-500 uppercase font-semibold mb-3 tracking-widest">All Detected Entities ({entities.length})</p>
              <div className="flex flex-wrap gap-2">
                {entities.map((e: any, i: number) => (
                  <span key={i} className={"px-3 py-1 rounded-full text-xs font-semibold border " + entityBadge(e.type)}>
                    {e.name} <span className="opacity-60 text-[10px]">({e.type})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {entities.length === 0 && (
            <p className="text-xs text-sandy-500 italic mt-2">No entities detected in this shloka.</p>
          )}
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <GlassCard>
              <h3 className="font-serif text-lg font-bold mb-5">Extracted Ontology Relationships</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-sandy-500/15 text-sandy-500 text-[10px] uppercase tracking-widest">
                      <th className="py-3 pr-4">Subject</th>
                      <th className="py-3 pr-4">Predicate</th>
                      <th className="py-3 pr-4">Object</th>
                      <th className="py-3 pr-4">Strength</th>
                      <th className="py-3 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandy-500/10">
                    {relationships.length > 0 ? relationships.map((rel: any, i: number) => {
                      const str = strengthBadge(rel.type || rel.rel || "");
                      const conf = rel.confidence ? (rel.confidence * 100).toFixed(1) : "85.0";
                      return (
                        <tr key={i} className="hover:bg-sandy-500/5 transition-colors">
                          <td className="py-3 pr-4 font-semibold text-gold-600 font-serif">{rel.source || rel.start || "-"}</td>
                          <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded bg-sandy-500/10 border border-sandy-500/20 font-mono text-[10px] font-bold">{rel.type || rel.rel || "RELATED_TO"}</span></td>
                          <td className="py-3 pr-4 font-semibold">{rel.target || rel.end || "-"}</td>
                          <td className="py-3 pr-4"><span className={"px-2 py-0.5 rounded border text-[10px] font-semibold " + str.cls}>{str.label}</span></td>
                          <td className="py-3 text-right font-bold text-sage-500">{conf}%</td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={5} className="py-8 text-center text-sandy-500">
                        <AlertCircle className="w-5 h-5 mx-auto mb-2 opacity-50" />
                        No relationships detected for this shloka.
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-serif text-lg font-bold mb-5 flex items-center gap-2"><Brain className="w-5 h-5 text-gold-500" />AI Pipeline Recommendations</h3>
              <div className="space-y-4 text-xs">
                {herbEntities.length > 0 && (
                  <div className="p-4 rounded-xl border border-gold-500/15 bg-gold-500/5 flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                    <div><h4 className="font-semibold text-sm mb-1">Key Herbs Identified</h4>
                    <p className="text-sandy-500 leading-relaxed">The verse references <strong>{herbEntities.map((e: any) => e.name).join(", ")}</strong>. Cross-reference with Charaka Samhita for complete Panchakarma protocols.</p></div>
                  </div>
                )}
                {doshaEntities.length > 0 && (
                  <div className="p-4 rounded-xl border border-sky-500/15 bg-sky-500/5 flex items-start gap-3">
                    <Activity className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <div><h4 className="font-semibold text-sm mb-1">Dosha Interactions</h4>
                    <p className="text-sandy-500 leading-relaxed">Detected <strong>{doshaEntities.map((e: any) => e.name).join(", ")}</strong> imbalance context. {relationships.filter((r: any) => r.type === "BALANCES").length > 0 ? "Found " + relationships.filter((r: any) => r.type === "BALANCES").length + " balancing relationship(s)." : "Recommend further dosha-herb analysis."}</p></div>
                  </div>
                )}
                {diseaseEntities.length > 0 && (
                  <div className="p-4 rounded-xl border border-rose-500/15 bg-rose-500/5 flex items-start gap-3">
                    <Zap className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div><h4 className="font-semibold text-sm mb-1">Therapeutic Targets</h4>
                    <p className="text-sandy-500 leading-relaxed">Conditions: <strong>{diseaseEntities.map((e: any) => e.name).join(", ")}</strong>. Map to modern ICD codes for clinical correlation.</p></div>
                  </div>
                )}
                {entities.length === 0 && (
                  <div className="p-4 rounded-xl border border-sandy-500/15 bg-sandy-500/5 flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-sandy-500 shrink-0 mt-0.5" />
                    <div><h4 className="font-semibold text-sm mb-1">No entities extracted</h4>
                    <p className="text-sandy-500 leading-relaxed">Try a verse with explicit herb names, doshas, or therapeutic actions.</p></div>
                  </div>
                )}
                <div className="p-4 rounded-xl border border-sandy-500/10 bg-sandy-500/5 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-sage-500 shrink-0 mt-0.5" />
                  <div><h4 className="font-semibold text-sm mb-1">Ontology Expansion</h4>
                  <p className="text-sandy-500 leading-relaxed">Extracted <strong>{entities.length}</strong> {entities.length !== 1 ? "entities" : "entity"} and <strong>{relationships.length}</strong> {relationships.length !== 1 ? "relationships" : "relationship"}. {relationships.length > 0 ? "Written to Knowledge Graph." : "Process more shlokas to build richer network."}</p></div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-8">
            <GlassCard>
              <h3 className="font-serif text-base font-bold mb-5 flex items-center gap-2"><Tag className="w-4 h-4 text-gold-500" />Entity Breakdown</h3>
              <div className="space-y-4 text-xs">
                {[
                  { label: "Herbs (Dravya)", count: herbEntities.length, color: "bg-gold-500" },
                  { label: "Doshas", count: doshaEntities.length, color: "bg-sky-500" },
                  { label: "Diseases (Roga)", count: diseaseEntities.length, color: "bg-rose-500" },
                  { label: "Actions (Karma)", count: karmaEntities.length, color: "bg-sage-500" },
                  { label: "Tastes (Rasa)", count: rasaEntities.length, color: "bg-purple-500" },
                ].map(({ label, count, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1.5"><span className="font-medium">{label}</span><span className="font-bold">{count}</span></div>
                    <div className="h-1.5 w-full bg-sandy-500/15 rounded-full overflow-hidden">
                      <div className={"h-full " + color + " rounded-full transition-all duration-700"} style={{ width: (entities.length > 0 ? (count / entities.length) * 100 : 0) + "%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="text-xs">
              <h3 className="font-serif text-base font-bold mb-5 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-gold-500" />Confidence Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: "Entity Detection", value: avgConf },
                  { label: "Relationship Mapping", value: relationships.length > 0 ? avgConf * 0.95 : 0 },
                  { label: "Translation Quality", value: pipelineData.translation ? avgConf * 0.9 : 0 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1.5"><span className="font-medium">{label}</span><span className="font-bold font-mono text-sage-500">{(value * 100).toFixed(1)}%</span></div>
                    <div className="h-1.5 w-full bg-sandy-500/15 rounded-full overflow-hidden">
                      <div className="h-full bg-sage-500 rounded-full transition-all duration-700" style={{ width: (value * 100) + "%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="text-xs">
              <h3 className="font-serif text-base font-bold mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-gold-500" />Record Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sandy-500">Source</span>
                  <span className={"px-2 py-0.5 rounded border text-[10px] font-semibold " + (source === "session" ? "bg-sage-500/10 text-sage-600 border-sage-500/30" : "bg-sandy-500/10 text-sandy-500 border-sandy-500/20")}>{source === "session" ? "Current Session" : "Database"}</span>
                </div>
                <div className="flex justify-between"><span className="text-sandy-500">Total Entities</span><span className="font-bold">{entities.length}</span></div>
                <div className="flex justify-between"><span className="text-sandy-500">Relationships</span><span className="font-bold">{relationships.length}</span></div>
                {pipelineData.created_at && (
                  <div className="flex justify-between"><span className="text-sandy-500">Processed At</span><span>{new Date(pipelineData.created_at).toLocaleString()}</span></div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}