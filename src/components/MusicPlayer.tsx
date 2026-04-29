import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_0x00A1 // SYNTH",
    artist: "CORRUPTED_SECTOR_1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "NULL_PTR_EXCEPTION",
    artist: "ROGUE_PROCESS_9",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "GLITCH_WAVEFORM",
    artist: "VOID_RESONANCE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  }, []);

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleEnded = () => playNext();

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-sm border-4 border-[#00ffff] bg-black p-4 shadow-[8px_8px_0_#ff00ff] relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Decorative glitch background stripe */}
      <div className="absolute top-0 right-0 w-24 h-[200%] bg-[#ff00ff] opacity-10 -rotate-45 pointer-events-none transform translate-x-12 -translate-y-12" />

      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="h-14 w-14 border-2 border-[#00ffff] bg-black flex items-center justify-center overflow-hidden">
          {isPlaying ? (
            <div className="w-full h-full bg-[#ff00ff] flex flex-col justify-between p-2">
              <span className="block w-full h-[3px] bg-black animate-pulse" />
              <span className="block w-full h-[5px] bg-[#00ffff] animate-ping" />
              <span className="block w-full h-[2px] bg-black animate-pulse" />
            </div>
          ) : (
            <div className="w-full h-full bg-[#00ffff] opacity-30" />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.div 
            key={currentTrackIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-[#00ffff] text-xl font-bold truncate">
              {currentTrack.title}
            </span>
            <span className="text-[#ff00ff] text-sm truncate">
              {currentTrack.artist}
            </span>
          </motion.div>
        </div>
        <button 
          onClick={toggleMute}
          className="text-[#00ffff] hover:text-[#ff00ff] hover:scale-110 transition-transform outline-none"
        >
          {isMuted ? <VolumeX strokeWidth={3} className="h-6 w-6" /> : <Volume2 strokeWidth={3} className="h-6 w-6" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-4 w-full bg-[#000] border-2 border-[#ff00ff] mb-4 relative">
        <div 
          className="h-full bg-[#00ffff] transition-all duration-75 relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 w-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,black_5px,black_10px)] opacity-30" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 relative z-10">
        <button 
          onClick={playPrev}
          className="text-[#00ffff] hover:text-[#ff00ff] active:scale-90 transition-transform outline-none"
        >
          <SkipBack strokeWidth={3} className="h-8 w-8" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="h-16 w-16 flex items-center justify-center border-4 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none outline-none focus:border-[#ff00ff]"
        >
          {isPlaying ? (
            <Pause strokeWidth={4} className="h-8 w-8 drop-shadow-[2px_2px_0_#ff00ff]" />
          ) : (
            <Play strokeWidth={4} className="h-8 w-8 ml-1 drop-shadow-[2px_2px_0_#ff00ff]" />
          )}
        </button>

        <button 
          onClick={playNext}
          className="text-[#00ffff] hover:text-[#ff00ff] active:scale-90 transition-transform outline-none"
        >
          <SkipForward strokeWidth={3} className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
