import React, { useState } from 'react';
import { Heart, Sparkles, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { romanticAudio } from '../utils/audioEngine';

export interface UserSession {
  name: string;
  displayName: string;
  role: 'admin' | 'viewer';
}

interface LoginGatewayProps {
  onLogin: (session: UserSession) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({ onLogin }) => {
  const [inputName, setInputName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Normalize Arabic letters and English strings for forgiving, friendly matching
  const normalize = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, ''); // strip Arabic vowels/diacritics
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const raw = inputName.trim();
    if (!raw) {
      setErrorMessage('اكتبي اسمك يا قمر الأول عشان المفاجأة تنور بيكي 💕');
      return;
    }

    const norm = normalize(raw);

    // 1. Check for Faress (Admin / Creator)
    const isFaress =
      norm === 'faress' ||
      norm === 'fares' ||
      norm === 'فارس' ||
      norm.includes('faress') ||
      norm.includes('fares') ||
      norm.includes('فارس');

    if (isFaress) {
      setIsSubmitting(true);
      romanticAudio.playCelebrationChime();
      setTimeout(() => {
        onLogin({
          name: 'Faress',
          displayName: 'فارس (حبيبك)',
          role: 'admin',
        });
      }, 350);
      return;
    }

    // 2. Check for ايويه (The Birthday Queen / Read-Only Viewer)
    // Matches: ايويه, أيويه, إيويه, آيويه, ايوه, ايه, آية, aya, ayweya, ayota, etc.
    const isAyweya =
      norm === 'ايويه' ||
      norm === 'ايوه' ||
      norm === 'ايه' ||
      norm === 'ايويا' ||
      norm.startsWith('ايو') ||
      norm === 'aya' ||
      norm === 'ayweya' ||
      norm === 'ayoya' ||
      norm === 'ayota';

    if (isAyweya) {
      setIsSubmitting(true);
      romanticAudio.playCelebrationChime();
      setTimeout(() => {
        onLogin({
          name: 'ايويه',
          displayName: 'ايويه (ملكة اليوم 👑)',
          role: 'viewer',
        });
      }, 350);
      return;
    }

    // 3. Any other name: gentle private prompt with sweet dallaa
    setErrorMessage('يا عيوني الاسم ده مش متسجل في قلبي.. اتأكدي إنك كتبتي اسمك صح يا قمر 🥺💖');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#0b0612] text-[#fce7f3]">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-rose-600/18 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-pink-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Decorative floating cute mini elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[12%] left-[18%] text-rose-400/35 text-2xl animate-pulse">💖</span>
        <span className="absolute top-[22%] right-[20%] text-pink-300/30 text-3xl animate-bounce">✨</span>
        <span className="absolute bottom-[22%] left-[22%] text-rose-300/35 text-2xl animate-pulse">🌸</span>
        <span className="absolute bottom-[28%] right-[16%] text-purple-300/30 text-2xl animate-bounce">🎀</span>
        <span className="absolute top-[48%] left-[8%] text-pink-400/20 text-xl">🍭</span>
        <span className="absolute top-[60%] right-[10%] text-amber-300/25 text-xl">👑</span>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Main Card */}
        <div className="bg-[#140a1e]/90 border border-rose-700/50 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-rose-950/90 backdrop-blur-xl text-center relative overflow-hidden box-glow">
          {/* Subtle top shimmer bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-75" />

          {/* Top Heart Badge with Cute Sparkles */}
          <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 bg-rose-500/25 rounded-full blur-md animate-pulse" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-500 border border-rose-300/50 flex items-center justify-center shadow-lg shadow-rose-900/60">
              <Heart className="w-8 h-8 text-white fill-white/95 animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center text-amber-950 shadow">
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Heading with Dal'aa */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/50 text-rose-300 text-xs font-semibold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" />
              <span>مفاجأة مخصوص لست البنات ودلوعتي 👑</span>
              <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              بوابة حكايتنا وسر فرحتنا 💌
            </h1>
            <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed font-poetry">
              المكان ده معمول بحب ومتقفل بمفتاح سري في قلبي لأغلى بنوتة في الدنيا..
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
            <div>
              <label htmlFor="loginName" className="block text-xs sm:text-sm font-semibold text-rose-300 mb-2.5 flex items-center justify-between">
                <span>اكتبي اسمك يا روح قلبي: 💕</span>
                <span className="text-[11px] text-pink-400/70 font-normal">✨ مستني ضحكتك</span>
              </label>
              <div className="relative">
                <input
                  id="loginName"
                  type="text"
                  autoFocus
                  value={inputName}
                  onChange={(e) => {
                    setInputName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="اكتبي اسمك يا حتة السكر... 🌸"
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-900/90 border border-rose-800/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 text-sm sm:text-base text-white placeholder:text-rose-400/50 text-center font-medium focus:outline-none transition-all shadow-inner hover:border-rose-600/70"
                />
              </div>
            </div>

            {/* Error / Hint Notification with Dal'aa */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-700/60 text-rose-200 text-xs leading-relaxed animate-in fade-in duration-200 text-right">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-950/70 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>ثواني يا روحي.. البوابة بتفتح بحب! ✨</span>
              ) : (
                <>
                  <span>افتحي مفاجأتك يا عيوني 💖</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Sweet Romantic Footer */}
          <div className="mt-6 pt-5 border-t border-rose-950/70 text-[11px] sm:text-xs text-rose-300/75 flex flex-col gap-1 items-center font-poetry">
            <span>🎂 لأغلى وأحلى صدفة حصلت في عمري كلها</span>
            <span className="text-[10px] text-rose-400/60 font-sans tracking-wide">20 أكتوبر 2007 · 21 يوليو 2026 💍</span>
          </div>
        </div>
      </div>
    </div>
  );
};
