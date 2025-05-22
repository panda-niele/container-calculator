import { create } from "zustand";

interface AudioState {
  // Control functions - simplified as sound is disabled
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
}

// Simplified audio store with no actual sound functionality
export const useAudio = create<AudioState>(() => ({
  // No-op functions that do nothing
  toggleMute: () => {
    // Does nothing - sound is always off
  },
  
  playHit: () => {
    // Does nothing - sound is disabled
  },
  
  playSuccess: () => {
    // Does nothing - sound is disabled
  }
}));
