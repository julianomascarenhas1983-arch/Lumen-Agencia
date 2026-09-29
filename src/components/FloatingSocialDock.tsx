import React, { useState, useRef, useEffect } from 'react';
import {
  Instagram,
  Linkedin,
  MessageCircle,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowUp,
  ExternalLink
} from 'lucide-react';

export const FloatingSocialDock: React.FC = () => {
  const [soundActive, setSoundActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleAmbientSound = () => {
    if (!soundActive) {
      // Start calm harmonic ambient chord (432Hz golden ratio tuned)
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 2.5); // Soft, gentle volume
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Warm sine frequency 1: 432 Hz
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(432, ctx.currentTime);

        // Sub harmonic sine frequency 2: 216 Hz
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(216, ctx.currentTime);

        // Fifth harmonic: 648 Hz at lower volume
        const fifthGain = ctx.createGain();
        fifthGain.gain.setValueAtTime(0.015, ctx.currentTime);
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(648, ctx.currentTime);
        osc3.connect(fifthGain);
        fifthGain.connect(masterGain);

        osc1.connect(masterGain);
        osc2.connect(masterGain);

        osc1.start();
        osc2.start();
        osc3.start();

        osc1Ref.current = osc1;
        osc2Ref.current = osc2;

        setSoundActive(true);
      } catch (err) {
        console.error('Audio could not start:', err);
      }
    } else {
      // Fade out
      if (gainNodeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        setTimeout(() => {
          try {
            audioCtxRef.current?.close();
          } catch {
            // ignore
          }
          audioCtxRef.current = null;
        }, 1300);
      }
      setSoundActive(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Canais Sociais e Experiência"
      className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-auto select-none"
    >
      {/* Floating Pill Dock */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#080C1D]/90 backdrop-blur-xl border border-[rgba(246,196,83,0.3)] shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(246,196,83,0.15)] transition-all">
        
        {/* Instagram */}
        <div className="relative group">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowTooltip('insta')}
            onMouseLeave={() => setShowTooltip(null)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#98A1BC] hover:text-[#E1306C] hover:bg-white/5 transition-all"
            aria-label="Instagram @lumen.ag"
          >
            <Instagram className="w-4 h-4" />
          </a>
          {showTooltip === 'insta' && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#070A17] border border-[#E1306C]/40 text-[#F3F1EA] text-[11px] font-mono whitespace-nowrap shadow-xl animate-fade-in pointer-events-none">
              @lumen.ag (+38k)
            </div>
          )}
        </div>

        {/* LinkedIn */}
        <div className="relative group">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowTooltip('linkedin')}
            onMouseLeave={() => setShowTooltip(null)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#98A1BC] hover:text-[#0077B5] hover:bg-white/5 transition-all"
            aria-label="LinkedIn Lumen"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          {showTooltip === 'linkedin' && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#070A17] border border-[#0077B5]/40 text-[#F3F1EA] text-[11px] font-mono whitespace-nowrap shadow-xl animate-fade-in pointer-events-none">
              LinkedIn Lumen (+19k)
            </div>
          )}
        </div>

        {/* Behance */}
        <div className="relative group">
          <a
            href="https://behance.net"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowTooltip('behance')}
            onMouseLeave={() => setShowTooltip(null)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#98A1BC] hover:text-[#1769FF] hover:bg-white/5 transition-all font-heading font-black text-xs"
            aria-label="Behance lumen-agency"
          >
            Bē
          </a>
          {showTooltip === 'behance' && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#070A17] border border-[#1769FF]/40 text-[#F3F1EA] text-[11px] font-mono whitespace-nowrap shadow-xl animate-fade-in pointer-events-none">
              Portfólio Behance
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-white/10" />

        {/* Ambient Sound / Harmonic Resonance Toggle */}
        <div className="relative group">
          <button
            onClick={toggleAmbientSound}
            onMouseEnter={() => setShowTooltip('sound')}
            onMouseLeave={() => setShowTooltip(null)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              soundActive
                ? 'bg-[#F6C453]/20 text-[#F6C453] shadow-[0_0_12px_rgba(246,196,83,0.3)]'
                : 'text-[#98A1BC] hover:text-[#F3F1EA] hover:bg-white/5'
            }`}
            title={soundActive ? 'Desativar som ambiente' : 'Ativar frequência harmônica 432Hz'}
            aria-label="Ativar som ambiente da luz"
          >
            {soundActive ? (
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-[#F6C453] animate-pulse" />
                <span className="w-0.5 h-2 bg-[#F6C453] animate-pulse delay-75" />
                <span className="w-0.5 h-3.5 bg-[#F6C453] animate-pulse delay-150" />
              </div>
            ) : (
              <VolumeX className="w-4 h-4 opacity-70" />
            )}
          </button>
          {showTooltip === 'sound' && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#070A17] border border-[#F6C453]/40 text-[#F6C453] text-[11px] font-mono whitespace-nowrap shadow-xl animate-fade-in pointer-events-none">
              {soundActive ? 'Frequência 432Hz (Tocando)' : 'Ativar Atmosfera Sonora'}
            </div>
          )}
        </div>

        {/* WhatsApp VIP Concierge Action */}
        <a
          href="https://wa.me/5511998421080?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20com%20um%20curador%20da%20Lumen."
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip('wpp')}
          onMouseLeave={() => setShowTooltip(null)}
          className="relative px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-[#070A17] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(37,211,102,0.4)] hover:scale-105"
          aria-label="Conversar no WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-[#070A17]" />
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#070A17] animate-ping" />
        </a>
        {showTooltip === 'wpp' && (
          <div className="absolute bottom-12 right-0 px-2.5 py-1 rounded bg-[#070A17] border border-[#25D366]/40 text-[#25D366] text-[11px] font-mono whitespace-nowrap shadow-xl animate-fade-in pointer-events-none">
            Curador Sênior Online
          </div>
        )}

      </div>
    </aside>
  );
};
