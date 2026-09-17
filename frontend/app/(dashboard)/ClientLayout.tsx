"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import Galaxy from "@/components/Galaxy";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showGalaxy = pathname.startsWith("/collections") || pathname.startsWith("/graph");

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Primary Workspace Viewport */}
      <div className="flex-1 pl-64 flex flex-col min-w-0 relative">
        {showGalaxy ? (
          <>
            <div className="fixed inset-y-0 right-0 left-64 pointer-events-none z-0 animate-in fade-in duration-1000 theme-conditional-galaxy">
              <Galaxy 
                hueShift={40}
                saturation={1.0}
                glowIntensity={0.15}
                density={1.2}
                mouseInteraction={false}
                transparent={true}
              />
            </div>
            <div className="fixed inset-y-0 right-0 left-64 pointer-events-none z-0 theme-conditional-video">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover theme-video-element blur-[2px]"
              >
                <source src="/bg-video.mp4" type="video/mp4" />
              </video>
            </div>
          </>
        ) : (
          <div className="fixed inset-y-0 right-0 left-64 pointer-events-none z-0 theme-video-container">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover theme-video-element blur-[2px]"
            >
              <source src="/bg-video.mp4" type="video/mp4" />
            </video>
          </div>
        )}

        <main className="flex-1 flex flex-col overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
