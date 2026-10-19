import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, Volume2, VolumeX, Sparkles, X } from 'lucide-react';
import { romanticAudio } from '../utils/audioEngine';

interface MusicPlayerProps {
  customSongUrl?: string;
  customSongTitle?: string;
  onOpenCustomizer?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  customSongUrl,
  customSongTitle = 'أغنيتنا الحلوة اللي بنحبها',
  onOpenCustomizer,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [audioMode, setAudioMode] = useState<'synth' | 'audioElement'>('synth');
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (customSongUrl && customSongUrl.trim() !== '') {
      setAudioMode('audioElement');
    } else {
      setAudioMode('synth');
    }
  }, [customSongUrl]);

  const togglePlay = () => {
    setHasInteracted(true);
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    setIsPlaying(true);
    if (audioMode === 'audioElement' && audioRef.current) {
      audioRef.current.play().catch(() => {
        setAudioMode('synth');
        romanticAudio.startRomanticMelody();
      });
    } else {
      romanticAudio.startRomanticMelody();
    }
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    romanticAudio.stopRomanticMelody();
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    romanticAudio.setVolume(nextMuted ? 0 : volume);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  return (
    <>
      {/* Hidden audio element for custom track playback */}
      {customSongUrl && (
        <audio
          ref={audioRef}
          src={customSongUrl}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Responsive Music Bar in Navbar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'وقفي الأغنية' : 'شغلي الأغنية'}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all active:scale-95 cursor-pointer ${
            isPlaying
              ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 shadow-md shadow-rose-950/50'
              : 'bg-rose-950/30 border-rose-800/30 text-rose-300 hover:bg-rose-900/50'
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-600/40 text-rose-300'
          }`}>
            {isPlaying ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current translate-x-[-1px]" />
            )}
          </div>

          <div className="hidden sm:flex flex-col text-right leading-none">
            <span className="text-[11px] font-semibold text-rose-200 truncate max-w-[120px]">
              {customSongTitle}
            </span>
            <span className="text-[9px] text-rose-300/60 mt-0.5">
              {isPlaying ? 'شغالة الآن 🎶' : 'تشغيل'}
            </span>
          </div>

          {isPlaying && (
            <div className="flex items-end gap-0.5 h-2.5 w-3 mr-0.5">
              <span className="w-0.5 bg-rose-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-full" />
              <span className="w-0.5 bg-pink-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.2s] h-2/3" />
              <span className="w-0.5 bg-rose-300 rounded-full animate-[bounce_0.9s_ease-in-out_infinite_0.4s] h-4/5" />
            </div>
          )}
        </button>

        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          className="text-rose-300/70 hover:text-white p-1.5 rounded-full hover:bg-rose-950/40 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Floating Call-to-action on bottom via portal */}
      {!hasInteracted && !isPlaying && !bannerDismissed && typeof document !== 'undefined' && createPortal(
        <aside aria-label="دعوة تشغيل الأغنية" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92%] sm:w-auto">
          <div className="relative flex items-center gap-2 p-1 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-full shadow-2xl shadow-rose-950/90 border border-rose-300/40">
            <button
              onClick={() => {
                togglePlay();
                romanticAudio.playCelebrationChime();
              }}
              className="flex-1 flex items-center justify-center gap-2.5 px-4 py-2.5 text-white font-semibold text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
              <span>دوسي هنا عشان تشغلي أغنيتنا الحلوة 🎵</span>
              <Play className="w-3.5 h-3.5 fill-white" />
            </button>

            <button
              onClick={() => setBannerDismissed(true)}
              aria-label="إغلاق الإشعار"
              className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>,
        document.body
      )}
    </>
  );
};
