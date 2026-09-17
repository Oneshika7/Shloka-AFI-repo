"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import CustomButton from "@/components/CustomButton";

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    sessionStorage.removeItem("workspaceState");
    
    // Animate progress to 100 over 2.5 seconds
    const duration = 2500;
    const intervalTime = 25; // Update every 25ms
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.floor((currentStep / totalSteps) * 100), 100);
      setProgress(nextProgress);
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
      }
    }, intervalTime);

    // Redirect to the actual landing page shortly after hitting 100%
    const timer = setTimeout(() => {
      router.push("/about");
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center space-y-6 text-center"
      >
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-40 h-40 md:w-48 md:h-48"
        >
          <img src="/logo.png" alt="Shloka AFI Logo" className="w-full h-full object-contain" />
        </motion.div>



        {/* Dynamic Action Area (Loading) */}
        <div className="h-16 flex items-center justify-center mt-8">
          <AnimatePresence>
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex flex-col items-center justify-center w-full"
            >
              <div className="flex flex-col items-center space-y-2 mt-4">
                <div className="text-gold-500 font-serif text-2xl tracking-widest tabular-nums">
                  {progress}%
                </div>
                {/* Progress Bar Track */}
                <div className="w-48 h-0.5 bg-white/10 overflow-hidden relative rounded-full">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-500/50 to-gold-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.05 }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}