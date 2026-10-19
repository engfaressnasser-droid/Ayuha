import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Calendar, ArrowDown, Clock, Cake, Crown } from 'lucide-react';
import { UserSession } from './LoginGateway';

interface HeroSectionProps {
  partnerName: string;
  senderName: string;
  birthDate: string;
  anniversaryDate: string;
  headline: string;
  onOpenLetter: () => void;
  userSession?: UserSession | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  partnerName,
  senderName,
  birthDate = '2007-10-20',
  anniversaryDate,
  headline,
  onOpenLetter,
  userSession,
}) => {
  // Calculate love duration (since June 21)
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate birthday countdown (until next October 20)
  const [bdayCountdown, setBdayCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: false,
    turningAge: 19,
  });

  useEffect(() => {
    const loveStartDate = new Date(anniversaryDate || '2026-07-21T00:00:00').getTime();

    const updateLoveCounter = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, now - loveStartDate);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    const updateBirthdayCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Her birth year is 2007, birthday is October 20
      const birthYear = 2007;
      let nextBirthday = new Date(currentYear, 9, 20, 0, 0, 0); // Month is 0-indexed (9 = October)

      // If this year's birthday has completely ended (day after Oct 20), countdown to next year
      const endOfBday = new Date(currentYear, 9, 20, 23, 59, 59);
      if (now > endOfBday) {
        nextBirthday = new Date(currentYear + 1, 9, 20, 0, 0, 0);
      }

      // Check if today is the birthday (October 20)
      const isToday = now.getMonth() === 9 && now.getDate() === 20;

      const diff = nextBirthday.getTime() - now.getTime();
      const turningAge = nextBirthday.getFullYear() - birthYear;

      if (diff <= 0 || isToday) {
        setBdayCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isToday: true,
          turningAge: currentYear - birthYear,
        });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setBdayCountdown({
          days,
          hours,
          minutes,
          seconds,
          isToday: false,
          turningAge,
        });
      }
    };

    updateLoveCounter();
    updateBirthdayCountdown();

    const interval = setInterval(() => {
      updateLoveCounter();
      updateBirthdayCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [anniversaryDate, birthDate]);

  return (
    <section id="top" className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 pt-20 sm:pt-28 pb-20 overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-rose-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Personalized Welcome Banner for Ayweya */}
        {userSession?.role === 'viewer' && (
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-950/90 via-pink-950/80 to-rose-950/90 border border-rose-500/50 shadow-xl shadow-rose-950/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
            <Crown className="w-4 h-4 text-amber-300 animate-bounce" />
            <span className="text-xs sm:text-sm font-semibold text-pink-200">
              نورتي عالمك السري يا أيويه 🌸 كل سنة وأنتي ضحكة قلب فارس وعمره كله!
            </span>
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          </div>
        )}

        {/* Subtle romantic unboxed kicker */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-rose-400 text-xs sm:text-sm font-medium tracking-wider mb-6">
          <span>عيد ميلاد قمري</span>
          <span aria-hidden="true">·</span>
          <span>20 أكتوبر 2007</span>
          <span aria-hidden="true">·</span>
          <span>أول ما اتعرفنا على بعض 21 يوليو 2026</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>حكايتنا الحلوة</span>
          </span>
        </div>

        {/* Main Emotional Headline in Egyptian Arabic */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight max-w-3xl [text-wrap:balance]">
          <span>كل سنة وأنتي </span>
          <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 bg-clip-text text-transparent text-glow">
            أجمل حاجة في حياتي
          </span>
          <span className="block mt-2 text-rose-200">
            يا {partnerName || 'حبيبة قلبي'} ❤️
          </span>
        </h1>

        {/* Poetic Subtitle in Egyptian Arabic */}
        <p className="text-base sm:text-lg md:text-xl text-rose-200/80 font-poetry max-w-2xl mx-auto leading-relaxed mb-10 [text-wrap:balance]">
          النهاردة مش يوم عادي أبداً.. النهاردة بنحتفل بأجمل ضحكة وأطيب قلب في الدنيا، اليوم اللي اتولدت فيه أميرتي ونور عيني.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={onOpenLetter}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-900/40 hover:shadow-rose-700/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-current text-white animate-pulse" />
            <span>افتحي الجواب بتاعي ليكي 💌</span>
          </button>

          <a
            href="#gallery"
            className="flex items-center gap-2 px-6 py-3.5 bg-rose-950/30 hover:bg-rose-900/40 text-rose-200 text-sm font-semibold rounded-xl border border-rose-800/40 hover:border-rose-600/50 transition-all"
          >
            <span>شوفي ألبوم ذكرياتنا سوا</span>
          </a>
        </div>

        {/* ============================================================== */}
        {/* ATTRACTIVE BIRTHDAY COUNTDOWN TIMER (عد تنازلي جذاب لعيد الميلاد) */}
        {/* ============================================================== */}
        <div className="w-full max-w-2xl mb-8 bg-gradient-to-b from-[#1c0c2a]/90 via-[#160822]/90 to-[#10051a]/90 border border-rose-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl box-glow">
          <div className="flex items-center justify-between gap-2 border-b border-rose-800/40 pb-3 mb-5">
            <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs sm:text-sm">
              <Clock className="w-4 h-4 text-rose-400 animate-spin" />
              <span>العد التنازلي للحظة عيد ميلادك (20 أكتوبر)</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-700/30 text-[11px] text-pink-300 font-mono">
              <Cake className="w-3.5 h-3.5 text-amber-300" />
              <span>مواليد 20/10/2007</span>
            </div>
          </div>

          {!bdayCountdown.isToday ? (
            <>
              <p className="text-xs sm:text-sm text-rose-200/80 mb-5 font-poetry">
                فاضل قد إيه على اللحظة اللي هنطفي فيها الشمع ونحتفل بـ {bdayCountdown.turningAge} سنة من السكر؟ ✨
              </p>

              {/* Countdown Numbers Grid */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
                {/* Days */}
                <div className="flex flex-col items-center bg-black/40 border border-rose-800/30 rounded-2xl p-3 sm:p-4 shadow-inner">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tabular-nums tracking-tight text-glow">
                    {bdayCountdown.days}
                  </span>
                  <span className="text-[11px] sm:text-xs text-rose-300/80 font-medium mt-1">
                    أيام
                  </span>
                </div>

                {/* Hours */}
                <div className="flex flex-col items-center bg-black/40 border border-rose-800/30 rounded-2xl p-3 sm:p-4 shadow-inner">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-extrabold text-rose-200 tabular-nums tracking-tight text-glow">
                    {String(bdayCountdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] sm:text-xs text-rose-300/80 font-medium mt-1">
                    ساعات
                  </span>
                </div>

                {/* Minutes */}
                <div className="flex flex-col items-center bg-black/40 border border-rose-800/30 rounded-2xl p-3 sm:p-4 shadow-inner">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-extrabold text-pink-300 tabular-nums tracking-tight text-glow">
                    {String(bdayCountdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] sm:text-xs text-rose-300/80 font-medium mt-1">
                    دقائق
                  </span>
                </div>

                {/* Seconds */}
                <div className="flex flex-col items-center bg-black/40 border border-rose-500/40 rounded-2xl p-3 sm:p-4 shadow-inner ring-1 ring-rose-500/20">
                  <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-extrabold text-rose-400 tabular-nums tracking-tight animate-pulse text-glow">
                    {String(bdayCountdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] sm:text-xs text-rose-300/80 font-medium mt-1">
                    ثواني
                  </span>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-rose-400/70 font-poetry">
                بنعد الثواني واللحظات عشان نحتفل بأجمل يوم في السنة كلها ❤️
              </div>
            </>
          ) : (
            /* Celebration state if today is 20 October */
            <div className="py-4 text-center animate-bounce">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-rose-900">
                <Cake className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 text-glow">
                النهاردة 20 أكتوبر.. عيد ميلادك يا روحي! 🎉
              </h3>
              <p className="text-sm text-pink-200 font-poetry">
                كل سنة وأنتي أجمل بنت وأغلى حبيبة في الدنيا، تمت الـ {bdayCountdown.turningAge} سنة من الجمال والرقة!
              </p>
            </div>
          )}
        </div>

        {/* Meeting Date Metrics Strip (تاريخ ما اتعرفنا على بعض 21 يوليو 2026) */}
        <div className="w-full max-w-2xl bg-neutral-900/60 border border-rose-900/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-rose-300/90 text-xs sm:text-sm font-medium mb-4">
            <div className="flex items-center gap-1.5 text-rose-400">
              <Calendar className="w-4 h-4" />
              <span className="font-bold text-white">تاريخ ما اتعرفنا على بعض: 21 يوليو 2026</span>
            </div>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>منورين حياة بعض وبقالنا سوا:</span>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-white tabular-nums tracking-tight">
                {timeTogether.days}
              </span>
              <span className="text-[11px] sm:text-xs text-rose-300/60 mt-1">يوم</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-rose-200 tabular-nums tracking-tight">
                {String(timeTogether.hours).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs text-rose-300/60 mt-1">ساعة</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-rose-300 tabular-nums tracking-tight">
                {String(timeTogether.minutes).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs text-rose-300/60 mt-1">دقيقة</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-pink-400 tabular-nums tracking-tight">
                {String(timeTogether.seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs text-rose-300/60 mt-1">ثانية</span>
            </div>
          </div>
        </div>

        {/* Gentle scroll indicator */}
        <a
          href="#message"
          aria-label="انزلي للجواب"
          className="mt-12 text-rose-400/60 hover:text-rose-300 transition-colors flex flex-col items-center gap-2"
        >
          <span className="text-xs">انزلي لتحت عشان تقري الجواب الحلو</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
