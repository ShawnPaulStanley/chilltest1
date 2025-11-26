import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, Wind, Coffee, Flame, Keyboard, Volume2, VolumeX } from 'lucide-react';
import { AmbientSound } from '../types';

// Helper to create noise buffers
const createNoiseBuffer = (ctx: AudioContext, type: 'white' | 'pink' | 'brown') => {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
  } else if (type === 'brown') {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
  }
  return buffer;
};

export const AmbientMixer: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<{ [key: string]: { source: AudioBufferSourceNode | MediaElementAudioSourceNode; gain: GainNode; element?: HTMLAudioElement } }>({});

  const [masterMute, setMasterMute] = useState(false);
  const [sounds, setSounds] = useState<AmbientSound[]>([
    { id: 'rain', name: 'Rain', icon: CloudRain, volume: 0, isPlaying: false, type: 'noise', noiseType: 'pink' },
    { id: 'wind', name: 'Wind', icon: Wind, volume: 0, isPlaying: false, type: 'noise', noiseType: 'brown' },
    { id: 'coffee', name: 'Cafe', icon: Coffee, volume: 0, isPlaying: false, type: 'url', src: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_7306231908.mp3' }, // Public domain placeholder
    { id: 'fire', name: 'Fire', icon: Flame, volume: 0, isPlaying: false, type: 'url', src: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_659020464e.mp3' }, // Public domain placeholder
  ]);

  // Initialize Audio Context on first user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const toggleSound = (id: string) => {
    initAudio();
    const sound = sounds.find(s => s.id === id);
    if (!sound) return;

    if (sound.isPlaying) {
      // Stop
      const node = sourcesRef.current[id];
      if (node) {
        if (sound.type === 'noise') {
            (node.source as AudioBufferSourceNode).stop();
            node.source.disconnect();
        } else {
             if (node.element) {
                 node.element.pause();
             }
        }
        node.gain.disconnect();
        delete sourcesRef.current[id];
      }
    } else {
      // Play
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      const gainNode = ctx.createGain();
      gainNode.gain.value = sound.volume / 100;
      gainNode.connect(ctx.destination);

      if (sound.type === 'noise' && sound.noiseType) {
        const buffer = createNoiseBuffer(ctx, sound.noiseType);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gainNode);
        source.start();
        sourcesRef.current[id] = { source, gain: gainNode };
      } else if (sound.type === 'url' && sound.src) {
        const audio = new Audio(sound.src);
        audio.loop = true;
        audio.crossOrigin = "anonymous";
        // Note: In a real app, use createMediaElementSource, but here keeping it simple 
        // to avoid cross-origin tainted issues with some CDN assets in standard React contexts.
        // We will control volume directly on the element for URL based to be safe against CORS.
        audio.volume = sound.volume / 100;
        audio.play().catch(e => console.warn("Audio play failed", e));
        
        // Mocking the structure for consistent storage, though we control volume on element directly for CORS safety
        sourcesRef.current[id] = { source: {} as any, gain: gainNode, element: audio };
      }
    }

    setSounds(prev => prev.map(s => s.id === id ? { ...s, isPlaying: !s.isPlaying, volume: s.isPlaying ? 0 : 50 } : s));
  };

  const updateVolume = (id: string, vol: number) => {
    setSounds(prev => prev.map(s => s.id === id ? { ...s, volume: vol } : s));
    
    // Update live volume
    const sound = sounds.find(s => s.id === id);
    if (sourcesRef.current[id]) {
      const node = sourcesRef.current[id];
      if (sound?.type === 'noise') {
          node.gain.gain.setTargetAtTime(vol / 100, audioContextRef.current!.currentTime, 0.1);
      } else if (node.element) {
          node.element.volume = vol / 100;
      }
    }
  };

  return (
    <div className="bg-white/80 dark:bg-pastel-darkCard/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-hand text-2xl text-pastel-text dark:text-pastel-darkText">Ambient Mixer</h3>
        <button onClick={() => setMasterMute(!masterMute)} className="text-pastel-text dark:text-pastel-darkText opacity-60 hover:opacity-100">
          {masterMute ? <VolumeX /> : <Volume2 />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sounds.map(sound => (
          <div key={sound.id} className="flex flex-col items-center gap-2">
            <button
              onClick={() => toggleSound(sound.id)}
              className={`p-4 rounded-full transition-all duration-300 ${
                sound.isPlaying 
                  ? 'bg-pastel-lavender dark:bg-indigo-900 text-pastel-text dark:text-white shadow-inner scale-95' 
                  : 'bg-pastel-cream dark:bg-gray-800 text-gray-400 hover:bg-white hover:shadow-md'
              }`}
            >
              <sound.icon size={24} />
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={sound.isPlaying ? sound.volume : 0}
              onChange={(e) => updateVolume(sound.id, parseInt(e.target.value))}
              disabled={!sound.isPlaying}
              className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pastel-lavender"
            />
            <span className="text-xs font-sans text-gray-500">{sound.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};