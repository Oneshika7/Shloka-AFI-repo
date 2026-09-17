"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Database,
  Loader2,
  Brain,
  ArrowRight,
  Check,
  Type,
  Image as ImageIcon,
  Network,
  FileUp
} from "lucide-react";
import Header from "@/components/Header";
import GlassCard from "@/components/GlassCard";
import CustomButton from "@/components/CustomButton";
import OntologyViewer from "@/components/workspace/OntologyViewer";
import PixelCard from "@/components/PixelCard";

type WizardMode = "SELECTION" | "TEXT_INPUT" | "IMAGE_UPLOAD" | "BULK_UPLOAD" | "REVIEW_TRANSCRIPTION" | "ANALYZING";

export default function WorkspacePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [wizardMode, setWizardMode] = useState<WizardMode>("SELECTION");
  const [inputText, setInputText] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [graphSaved, setGraphSaved] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [currentShlokaId, setCurrentShlokaId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem("workspaceState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setWizardMode(parsed.wizardMode || "SELECTION");
        setInputText(parsed.inputText || "");
        setFileName(parsed.fileName || null);
        setImageBase64(parsed.imageBase64 || null);
        setGraphSaved(parsed.graphSaved || false);
        setProcessed(parsed.processed || false);
        setAnalysisData(parsed.analysisData || null);
        setCurrentShlokaId(parsed.currentShlokaId || null);
        setActiveStep(parsed.activeStep || 0);
        
        if (parsed.processed) {
            setWizardMode("ANALYZING");
        }
      } catch (e) {
        console.error("Failed to parse workspace state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state on change
  useEffect(() => {
    if (!isLoaded) return;
    const stateToSave = {
      wizardMode,
      inputText,
      fileName,
      imageBase64,
      graphSaved,
      processed,
      analysisData,
      currentShlokaId,
      activeStep
    };
    sessionStorage.setItem("workspaceState", JSON.stringify(stateToSave));
  }, [wizardMode, inputText, fileName, imageBase64, graphSaved, processed, analysisData, currentShlokaId, activeStep, isLoaded]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept if typing in text inputs unless it's a direct image paste
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        if (!e.clipboardData?.items || Array.from(e.clipboardData.items).every(item => item.type.indexOf("image") === -1)) {
          return;
        }
      }
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setFileName("pasted_image.png");
            setUploadProgress(10);
            setWizardMode("IMAGE_UPLOAD");
            
            const reader = new FileReader();
            reader.onload = async () => {
              const base64 = reader.result as string;
              setImageBase64(base64);
              setUploadProgress(50);
              
              try {
                const response = await fetch("http://localhost:8002/api/v1/transcribe", {
                  method: "POST",
                  headers: { 
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                  },
                  body: JSON.stringify({ image_base64: base64 })
                });
                
                if (!response.ok) throw new Error("Transcription failed");
                
                const data = await response.json();
                setInputText(data.text || "");
                setUploadProgress(100);
                setWizardMode("REVIEW_TRANSCRIPTION");
              } catch (err: any) {
                setError(err.message);
                setWizardMode("SELECTION");
              }
            };
            reader.readAsDataURL(file);
          }
          break; // Stop after first image
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadProgress(10);
    setWizardMode("IMAGE_UPLOAD");
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setImageBase64(base64);
      setUploadProgress(50);
      
      try {
        const response = await fetch("http://localhost:8002/api/v1/transcribe", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ image_base64: base64 })
        });
        
        if (!response.ok) throw new Error("Transcription failed");
        
        const data = await response.json();
        setInputText(data.text || "");
        setUploadProgress(100);
        setWizardMode("REVIEW_TRANSCRIPTION");
      } catch (err: any) {
        setError(err.message);
        setWizardMode("SELECTION");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadProgress(10);
    setWizardMode("BULK_UPLOAD");
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("http://localhost:8002/api/v1/bulk-upload", {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData
      });
      
      if (!response.ok) throw new Error("Bulk upload failed");
      
      const data = await response.json();
      setUploadProgress(100);
      alert(`Success! ${data.message}`);
      setWizardMode("SELECTION");
    } catch (err: any) {
      setError(err.message);
      setWizardMode("SELECTION");
    }
  };
  const handleUnifiedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.csv') || file.name.toLowerCase().endsWith('.pdf')) {
      return handleBulkUpload(e);
    } else {
      return handleFileUpload(e);
    }
  };

  const startProcessing = async () => {
    if (!inputText) {
        setError("Please enter a shloka to analyze.");
        return;
    }
    
    setWizardMode("ANALYZING");
    setProcessing(true);
    setProcessed(false);
    setError(null);
    setAnalysisData(null);
    setCurrentShlokaId(null);
    setActiveStep(1);

    try {
        setTimeout(() => setActiveStep(2), 500);
        
        const payload: any = {
            text: inputText,
            source: fileName || "manual_entry"
        };

        const response = await fetch("http://localhost:8002/api/v1/pipeline", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Pipeline failed: ${response.statusText}`);
        }

        const data = await response.json();
        
        setActiveStep(3);
        setTimeout(() => {
            setActiveStep(4);
            setTimeout(() => {
                const analysisPayload = data.full_analysis || data;
                const shlokaId = data.shloka_id || "session";
                const insightData = {
                    shloka_id:     shlokaId,
                    original_text: data.original_text || inputText,
                    translation:   analysisPayload.translation || data.translation || "",
                    entities:      data.entities || [],
                    relationships: data.relationships || [],
                    created_at:    new Date().toISOString(),
                };
                localStorage.setItem("shloka_insight_data", JSON.stringify(insightData));
                setAnalysisData(analysisPayload);
                setCurrentShlokaId(shlokaId);
                setProcessed(true);
                setProcessing(false);
            }, 400);
        }, 400);

    } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred during analysis.");
        setProcessing(false);
        setActiveStep(0);
        setWizardMode("TEXT_INPUT");
    }
  };

  const resetWorkspace = () => {
    setInputText("");
    setFileName(null);
    setUploadProgress(null);
    setImageBase64(null);
    setProcessed(false);
    setProcessing(false);
    setActiveStep(0);
    setAnalysisData(null);
    setCurrentShlokaId(null);
    setError(null);
    setGraphSaved(false);
    setWizardMode("SELECTION");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header title="Shloka Workspace" />

      <div className="flex-1 p-8 overflow-y-auto w-full mx-auto font-sans">
        <div className={wizardMode !== "ANALYZING" ? "max-w-4xl mx-auto mt-20" : "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"}>
          
          {/* Left Side: Wizard */}
          <div className={wizardMode !== "ANALYZING" ? "space-y-6" : "lg:col-span-3 space-y-6 sticky top-0"}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-gold-500">
                  {wizardMode === "SELECTION" && "Select Input Method"}
                  {wizardMode === "TEXT_INPUT" && "Paste Text"}
                  {wizardMode === "IMAGE_UPLOAD" && "Scanning Image..."}
                  {wizardMode === "REVIEW_TRANSCRIPTION" && "Review Transcription"}
                  {wizardMode === "ANALYZING" && "Processing Shloka..."}
                </h3>
                {wizardMode !== "SELECTION" && wizardMode !== "ANALYZING" && (
                  <button onClick={resetWorkspace} className="text-xs text-sandy-500 hover:text-gold-500 flex items-center transition-colors">
                    <RotateCcw className="w-3 h-3 mr-1" /> Start Over
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* STEP 1: SELECTION */}
                {wizardMode === "SELECTION" && (
                  <div className="grid grid-cols-2 gap-4">
                    <PixelCard variant="gold" className="w-full h-full rounded-xl">
                      <div 
                        onClick={() => setWizardMode("TEXT_INPUT")}
                        className="flex flex-col w-full h-full items-center justify-center p-8 border border-sandy-500/20 hover:border-gold-500/50 hover:bg-gold-500/5 rounded-xl cursor-pointer transition-all group"
                      >
                        <Type className="w-10 h-10 text-gold-500 mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-serif text-lg font-bold">Text Input</span>
                        <span className="text-xs text-center text-sandy-500 mt-2">Paste Devanagari or Romanized text directly</span>
                      </div>
                    </PixelCard>
                    
                    <PixelCard variant="gold" className="w-full h-full rounded-xl">
                      <div className="relative flex flex-col w-full h-full items-center justify-center p-8 border border-sandy-500/20 hover:border-gold-500/50 hover:bg-gold-500/5 rounded-xl cursor-pointer transition-all group overflow-hidden">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,.csv,.pdf"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          onChange={handleUnifiedUpload}
                        />
                        <FileUp className="w-10 h-10 text-gold-500 mb-4 group-hover:scale-110 transition-transform" />
                        <span className="font-serif text-lg font-bold">Upload</span>
                        <span className="text-xs text-center text-sandy-500 mt-2">Upload Image, CSV, or PDF</span>
                      </div>
                    </PixelCard>
                  </div>
                )}

                {/* STEP 2: IMAGE UPLOADING (LOADING STATE) */}
                {wizardMode === "IMAGE_UPLOAD" && (
                  <div className="flex flex-col items-center justify-center py-10 opacity-70">
                    <Loader2 className="w-10 h-10 text-gold-500 animate-spin mb-4" />
                    <p className="font-serif text-sm animate-pulse">Extracting text with Vision AI...</p>
                    {uploadProgress && <div className="w-full bg-sandy-500/20 rounded-full h-1.5 mt-4 overflow-hidden">
                      <div className="bg-gold-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>}
                  </div>
                )}

                {/* BULK UPLOAD (LOADING STATE) */}
                {wizardMode === "BULK_UPLOAD" && (
                  <div className="flex flex-col items-center justify-center py-10 opacity-70">
                    <Loader2 className="w-10 h-10 text-gold-500 animate-spin mb-4" />
                    <p className="font-serif text-sm animate-pulse">Processing bulk file...</p>
                    {uploadProgress && <div className="w-full bg-sandy-500/20 rounded-full h-1.5 mt-4 overflow-hidden">
                      <div className="bg-gold-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>}
                  </div>
                )}

                {/* STEP 3 & 4: TEXT INPUT OR REVIEW TRANSCRIPTION */}
                {(wizardMode === "TEXT_INPUT" || wizardMode === "REVIEW_TRANSCRIPTION") && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {wizardMode === "REVIEW_TRANSCRIPTION" && (
                      <p className="text-xs text-sage-400 bg-sage-500/10 p-2 rounded-lg border border-sage-500/20">
                        <CheckCircle2 className="w-3 h-3 inline mr-1 mb-0.5" />
                        Transcription complete. Please review and edit any OCR errors below before analyzing.
                      </p>
                    )}
                    <textarea
                      rows={8}
                      className="w-full bg-sandy-500/5 hover:bg-sandy-500/10 border border-sandy-500/10 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 rounded-xl p-4 text-sm font-serif leading-relaxed text-[var(--foreground)] focus:outline-none transition-all"
                      placeholder="Enter Devanagari or Romanized text here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    <CustomButton
                      variant="primary"
                      disabled={!inputText}
                      onClick={startProcessing}
                      icon={<Play className="w-4 h-4" />}
                      className="w-full"
                    >
                      Analyze Shloka
                    </CustomButton>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Pipeline Status Component */}
            {(processing || processed) && (
              <GlassCard className="animate-in fade-in slide-in-from-top-4">
                <h3 className="font-serif text-lg font-bold mb-4">Pipeline Status</h3>
                
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {activeStep > 1 ? (
                        <CheckCircle2 className="w-4 h-4 text-sage-500" />
                      ) : activeStep === 1 ? (
                        <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-gold-500 block animate-spin" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-sandy-500 opacity-60" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">Connecting to P1 Server</h4>
                      <p className="text-[10px] text-sandy-500">Initializing LLM RAG Pipeline</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {activeStep > 2 ? (
                        <CheckCircle2 className="w-4 h-4 text-sage-500" />
                      ) : activeStep === 2 ? (
                        <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-gold-500 block animate-spin" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-sandy-500 opacity-60" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">Ontology Extraction</h4>
                      <p className="text-[10px] text-sandy-500">Extracting Rasa Panchaka, Doshas, and Actions</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {activeStep > 3 ? (
                        <CheckCircle2 className="w-4 h-4 text-sage-500" />
                      ) : activeStep === 3 ? (
                        <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-gold-500 block animate-spin" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-sandy-500 opacity-60" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">Knowledge Graph Mapping</h4>
                      <p className="text-[10px] text-sandy-500">Writing entities and relationships to Neo4j</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right Side: Extracted Metadata */}
          {wizardMode === "ANALYZING" && (
          <div className="lg:col-span-9">
            {processed && analysisData ? (
                <div className="animate-in fade-in slide-in-from-right-8">
                  <div className="flex justify-between items-center mb-6 px-1">
                    <h2 className="font-serif text-2xl font-bold">Analysis Results</h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={resetWorkspace}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sandy-500/20 hover:bg-sandy-500/10 text-sm font-semibold transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Translate Another
                      </button>
                      <button
                        onClick={() => {
                          if (currentShlokaId) {
                            router.push(`/graph?shloka_id=${encodeURIComponent(currentShlokaId)}`);
                          } else {
                            router.push("/graph");
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sage-600 hover:bg-sage-500 text-white font-bold text-sm font-serif transition-all duration-200 shadow-lg hover:shadow-sage-500/30 hover:scale-105 active:scale-95"
                      >
                        <Network className="w-4 h-4" />
                        Visualize Graph
                      </button>
                      <button
                        onClick={() => router.push("/insights")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-[#1a1208] font-bold text-sm font-serif transition-all duration-200 shadow-lg hover:shadow-gold-500/30 hover:scale-105 active:scale-95"
                      >
                        <Brain className="w-4 h-4" />
                        Deep AI Insights
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <OntologyViewer data={analysisData} renderSection="translation" />
                </div>
            ) : processing ? (
                <div className="flex flex-col items-center justify-center h-[600px] opacity-60 animate-in fade-in">
                    <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                    <p className="font-serif text-lg animate-pulse">Analyzing text via LLM Pipeline...</p>
                    <p className="text-sm text-sandy-500 mt-2">This may take 10-30 seconds depending on the model.</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-sandy-500/20 rounded-2xl bg-sandy-500/5 animate-in fade-in">
                    <div className="w-16 h-16 rounded-full bg-sandy-500/10 flex items-center justify-center mb-4">
                        <Database className="w-8 h-8 text-gold-500/50" />
                    </div>
                    <p className="font-serif text-lg text-sandy-500">No analysis active</p>
                    <p className="text-sm text-[var(--foreground)] opacity-50 mt-2">Submit text to begin extracting ontological metadata</p>
                </div>
            )}
          </div>
          )}

        </div>

        {/* Full-width Details Section (Ingredients onwards) */}
        {wizardMode === "ANALYZING" && processed && analysisData && (
          <div className="mt-8">
            <OntologyViewer data={analysisData} renderSection="details" />
          </div>
        )}
      </div>
    </div>
  );
}
