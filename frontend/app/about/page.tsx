"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Database,
  Brain,
  Network,
  Languages,
  Cpu,
  FileText,
  Search,
  CheckCircle,
  Landmark,
  Layers,
  ShieldCheck,
  Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import CustomButton from "@/components/CustomButton";

export default function LandingPage() {
  React.useEffect(() => {
    sessionStorage.removeItem("workspaceState");
  }, []);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[var(--background)] shloka-grid-bg">
      <Navbar />

      {/* Floating Sanskrit Decorative Elements */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-100px] w-[600px] h-[600px] rounded-full bg-sage-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-[20%] w-[400px] h-[400px] rounded-full bg-rose-500/5 blur-[90px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full aspect-video flex flex-col items-center justify-between text-center overflow-hidden bg-black">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover object-center"
          >
            <source src="/hero_bg.mp4" type="video/mp4" />
          </video>
          {/* Subtle bottom gradient only behind text for legibility, no full-screen tint */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Spacer for Navbar */}
        <div className="h-24 w-full relative z-10"></div>

        {/* Huge Centered Logo */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-4 mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-48 h-48 md:w-56 md:h-56 lg:w-72 lg:h-72"
          >
            <img src="/logo.png" alt="Shloka AFI Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </motion.div>
        </div>

        {/* Bottom Typography & CTA */}
        <div className="relative z-10 w-full px-4 pb-12 md:pb-16 max-w-5xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-normal font-serif tracking-[0.2em] text-white/90 mb-4 leading-[1.4] uppercase text-center"
            style={{ textShadow: "0 2px 15px rgba(0,0,0,0.8)" }}
          >
            Sanskrit & Ayurvedic<br />Knowledge Intelligence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="text-[9px] sm:text-[10px] md:text-[11px] text-white/80 max-w-md font-sans font-light tracking-[0.25em] leading-relaxed mb-8 uppercase text-center"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.8)" }}
          >
            Indulge in unparalleled analytical precision where ancient wisdom meets next-generation artificial intelligence.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          >
            <Link href="/workspace">
              <CustomButton variant="primary" size="lg" className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 uppercase tracking-widest text-xs px-8 py-3 rounded-full shadow-2xl">
                Enter Workspace &rarr;
              </CustomButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="capabilities" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-sandy-500/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-4">Core Platform Capabilities</h2>
          <p className="text-sm sm:text-base text-[var(--foreground)] opacity-70">
            A comprehensive framework configured to extract, align, structure, and export rich Ayurvedic ontology graphs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif">Advanced Transliteration</h3>
            <p className="text-sm text-[var(--foreground)] opacity-70 leading-relaxed">
              Dynamically maps Devanagari Sanskrit verses to IAST, Harvard-Kyoto, and SLP1 transliteration schemes automatically.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sage-500/10 border border-sage-500/20 flex items-center justify-center text-sage-500">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif">Ontological Entity Extraction</h3>
            <p className="text-sm text-[var(--foreground)] opacity-70 leading-relaxed">
              Detects Dravya (Substances), Guna (Attributes), Rasa (Tastes), Virya (Potency), and Karma (Actions) automatically.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif">Knowledge Graph Mapping</h3>
            <p className="text-sm text-[var(--foreground)] opacity-70 leading-relaxed">
              Structures extracted shlokas into RDF/Neo4j graph triplets aligned with standard Ayurvedic ontologies and vocabularies.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* System Architecture Section */}
      <section id="architecture" className="py-20 md:py-28 bg-sandy-500/5 w-full border-t border-b border-sandy-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-2 block">System Architecture</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-6">Designed for Vedic Ontology Intelligence</h2>
              <p className="text-sm sm:text-base text-[var(--foreground)] opacity-70 mb-8 leading-relaxed">
                SHLOKA-AFI combines custom Sanskrit NLP models with semantic web ontologies. Our multi-agent system takes unstructured Sanskrit texts, aligns them with Ayurvedic glossaries, formats them for fine-tuning LLMs, and maps their relationships inside an interactive knowledge graph.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-sage-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold">Ayurvedic Dictionary Synset Matching</h4>
                    <p className="text-xs text-[var(--foreground)] opacity-65">Re-checks terms with Caraka, Susruta, and Astanga Hrdaya datasets.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-sage-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold">Fine-tuning dataset generation</h4>
                    <p className="text-xs text-[var(--foreground)] opacity-65">Exports high-fidelity prompt-response datasets in JSON-L format.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Sacred Geometry Decorative Drawing */}
              <div className="w-full aspect-square glass-panel border border-gold-500/10 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden bg-sandy-900/10">
                <div className="absolute w-[80%] h-[80%] rounded-full border border-gold-500/15 animate-spin" style={{ animationDuration: '60s' }} />
                <div className="absolute w-[60%] h-[60%] rounded-full border border-sage-500/10 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
                <div className="absolute w-[40%] h-[40%] rotate-45 border border-gold-500/20" />
                <div className="absolute w-[40%] h-[40%] -rotate-45 border border-gold-500/20" />
                <div className="z-10 flex flex-col items-center justify-center text-center space-y-4 p-4 rounded-xl glass-panel border-gold-500/30 w-48 shadow-lg">
                  <Cpu className="w-8 h-8 text-gold-500" />
                  <span className="text-xs font-serif font-semibold tracking-wide">AFI Engine Core</span>
                  <span className="text-[10px] text-sandy-500">Ontology Layer v1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Workflow */}
      <section id="stack" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Tech Stack */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">Technology Stack</h2>
            <p className="text-sm text-[var(--foreground)] opacity-70">
              Built using cutting edge framework solutions for semantic translation and machine learning export pipelines.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-sandy-500/10 bg-sandy-500/5 flex flex-col space-y-1">
                <span className="text-xs font-semibold">Next.js 16</span>
                <span className="text-[10px] text-sandy-500">App Router Shell</span>
              </div>
              <div className="p-4 rounded-xl border border-sandy-500/10 bg-sandy-500/5 flex flex-col space-y-1">
                <span className="text-xs font-semibold">Tailwind CSS 4</span>
                <span className="text-[10px] text-sandy-500">Dynamic theme engine</span>
              </div>
              <div className="p-4 rounded-xl border border-sandy-500/10 bg-sandy-500/5 flex flex-col space-y-1">
                <span className="text-xs font-semibold">Framer Motion</span>
                <span className="text-[10px] text-sandy-500">Physics interactions</span>
              </div>
              <div className="p-4 rounded-xl border border-sandy-500/10 bg-sandy-500/5 flex flex-col space-y-1">
                <span className="text-xs font-semibold">Neo4j (Target)</span>
                <span className="text-[10px] text-sandy-500">Knowledge Triplets</span>
              </div>
            </div>
          </div>

          {/* Processing Workflow Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">Ontology Processing Workflow</h2>
            <div className="space-y-6 relative border-l border-sandy-500/25 pl-6 ml-4">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-gold-500 border-4 border-[var(--background)]" />
                <h4 className="font-semibold text-sm">Step 1: Text Ingestion & Transliteration</h4>
                <p className="text-xs text-[var(--foreground)] opacity-70 mt-1">
                  Upload PDF manuscripts, scan documents, or paste Sanskrit verses directly. The engine automatically translates scripts and formats unicode characters.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-sage-500 border-4 border-[var(--background)]" />
                <h4 className="font-semibold text-sm">Step 2: AI Entity Extraction & Alignment</h4>
                <p className="text-xs text-[var(--foreground)] opacity-70 mt-1">
                  AI scans Sanskrit terms and validates them against the Dhanvantari Nighantu and custom Ayurvedic databases, identifying botanical and medical concepts.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-rose-500 border-4 border-[var(--background)]" />
                <h4 className="font-semibold text-sm">Step 3: Graph Compilation & Dataset Export</h4>
                <p className="text-xs text-[var(--foreground)] opacity-70 mt-1">
                  Compounds, dosas, and actions are structured into logical nodes. Export clean datasets to fine-tune AI models or push relations directly into Neo4j.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-sandy-500/10 py-10 bg-sandy-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Landmark className="w-6 h-6 text-gold-500" />
            <span className="font-serif font-bold text-sm tracking-wider text-[var(--foreground)]">SHLOKA-AFI</span>
            <span className="text-[10px] text-sandy-500 font-sans">| Ayurvedic NLP Platform</span>
          </div>
          <div className="flex space-x-6 text-xs text-sandy-500">
            <Link href="/" className="hover:text-gold-500 transition-colors">Documentation</Link>
            <Link href="/dashboard" className="hover:text-gold-500 transition-colors">API Portal</Link>
            <Link href="/" className="hover:text-gold-500 transition-colors">Privacy Policy</Link>
          </div>
          <p className="text-xs text-sandy-500">
            &copy; {new Date().getFullYear()} SHLOKA-AFI. Built for Sanskrit & Ayurvedic Heritage Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
