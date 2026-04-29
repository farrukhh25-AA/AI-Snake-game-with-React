import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen relative bg-black text-[#00ffff] flex flex-col pt-10 pb-24 md:pb-10 font-digital uppercase selection:bg-[#ff00ff] selection:text-black">
      <div className="crt-overlay" />
      <div className="scanline" />
      
      {/* Header */}
      <header className="w-full text-center mb-8 px-4 relative z-10 shrink-0">
        <h1 
          className="text-6xl md:text-7xl font-black tracking-widest text-[#00ffff] glitch-text drop-shadow-[0_0_10px_#00ffff]"
          data-text="SYS_OVERRIDE"
        >
          SYS_OVERRIDE
        </h1>
        <p className="mt-2 text-[#ff00ff] text-xl md:text-2xl tracking-[0.3em] font-bold">
          [ DATA FRAGMENTATION at 89% ]
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex w-full max-w-6xl mx-auto items-center justify-center relative z-10 px-4">
        <div className="w-full h-full flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-24 overflow-y-auto">
          {/* Game Window container */}
          <div className="flex flex-col items-center flex-1 max-w-lg w-full shrink-0 screen-tear">
            <SnakeGame />
          </div>

          {/* Side panel */}
          <div className="hidden xl:flex flex-col items-start justify-center flex-1 max-w-sm w-full shrink-0">
            <div className="w-full bg-black p-6 border-4 border-[#ff00ff] shadow-[8px_8px_0px_#00ffff] mb-8 relative">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white" />

              <h3 className="text-[#00ffff] text-3xl font-bold tracking-widest mb-4 flex items-center flex-wrap gap-2">
                <span className="w-4 h-4 bg-[#ff00ff] animate-ping" />
                TERMINAL_PROCESS
              </h3>
              <p className="text-white text-xl mb-4 leading-relaxed">
                WARNING: UNAUTHORIZED NEURAL LINK DETECTED. INGEST CORRUPTED DATA NODES TO PREVENT SYSTEM HALT.
              </p>
              <div className="text-[#00ffff] text-lg font-digital space-y-2 border-l-2 border-[#ff00ff] pl-3">
                <p>❯ INIT AUDIO_SYNTH // FAIL</p>
                <p>❯ OVERRIDING PROTOCOLS...</p>
                <p className="animate-pulse">❯ WAITING FOR KINETIC INPUT_</p>
              </div>
            </div>
            
            <MusicPlayer />
          </div>
        </div>
      </main>

      {/* Floating Bottom Player for Mobile/Tablet */}
      <div className="xl:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-center pb-safe">
        <MusicPlayer />
      </div>
    </div>
  );
}
