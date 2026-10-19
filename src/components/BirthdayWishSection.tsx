import React, { useState } from 'react';
import { Flame, Sparkles, RefreshCw, Gift, Heart } from 'lucide-react';
import { romanticAudio } from '../utils/audioEngine';

interface BirthdayWishSectionProps {
  partnerName: string;
}

export const BirthdayWishSection: React.FC<BirthdayWishSectionProps> = ({
  partnerName,
}) => {
  const [isBlown, setIsBlown] = useState<boolean>(false);
  const [showWishLetter, setShowWishLetter] = useState<boolean>(false);

  const handleBlowCandle = () => {
    if (isBlown) return;
    setIsBlown(true);
    romanticAudio.playCelebrationChime();
    setTimeout(() => {
      setShowWishLetter(true);
    }, 600);
  };

  const handleRelight = () => {
    setIsBlown(false);
    setShowWishLetter(false);
  };

  return (
    <section id="wish" className="relative py-24 px-6 max-w-4xl mx-auto text-center">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 text-rose-400 text-xs sm:text-sm font-medium tracking-wider mb-2">
          <span>احتفالنا بسنتك الجديدة</span>
          <span aria-hidden="true">·</span>
          <span>أمنيات من كل القلب</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          طفي الشمعة واتمني أمنية من قلبك
        </h2>
        <p className="text-sm text-rose-300/70 mt-2 max-w-md mx-auto">
          غمضي عينيكي الحلوين، اتمني كل اللي نفسك فيه، ودوسي على الشمعة عشان تطفيها يا روحي!
        </p>
      </div>

      {/* Interactive Birthday Cake and Candle */}
      <div className="relative max-w-md mx-auto bg-gradient-to-b from-[#180d24] to-[#100619] border border-rose-800/40 rounded-3xl p-8 sm:p-12 shadow-2xl box-glow flex flex-col items-center">
        {/* Candle Setup */}
        <div className="relative mb-6 flex flex-col items-center">
          {/* Flame or Smoke */}
          {!isBlown ? (
            <div
              onClick={handleBlowCandle}
              title="دوسي هنا عشان تطفي الشمعة"
              className="cursor-pointer group flex flex-col items-center"
            >
              {/* Flame glow */}
              <div className="w-8 h-10 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white animate-pulse shadow-lg shadow-amber-400/80 group-hover:scale-125 transition-transform" />
              <div className="w-1.5 h-4 bg-neutral-300 rounded-t-sm" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-xs text-rose-300/60 font-mono italic animate-pulse mb-1">
                💨 انطفت الشمعة ودعوتك طلعت للسما يا قلبي
              </div>
              <div className="w-1.5 h-4 bg-neutral-600 rounded-t-sm" />
            </div>
          )}

          {/* Candle Body */}
          <div className="w-8 h-20 bg-gradient-to-b from-rose-400 via-pink-300 to-rose-500 rounded-md shadow-md border-x border-rose-200/40 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white/80 fill-white" />
          </div>

          {/* Cake Layers */}
          <div className="w-48 h-12 bg-gradient-to-r from-rose-900 via-purple-900 to-rose-900 rounded-t-2xl border-t-2 border-rose-300/40 shadow-inner flex items-center justify-center">
            <div className="flex gap-4">
              <span className="w-2 h-2 rounded-full bg-pink-300 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-yellow-200" />
              <span className="w-2 h-2 rounded-full bg-pink-300" />
            </div>
          </div>
          <div className="min-w-[260px] max-w-sm w-auto px-4 py-3 min-h-[4rem] bg-gradient-to-r from-rose-950 via-[#251036] to-rose-950 rounded-b-2xl border-t border-rose-500/20 shadow-xl flex items-center justify-center text-center">
            <span className="text-xs font-semibold text-rose-200/90 tracking-widest font-heading [text-wrap:balance]">
              كل سنة وأنتي طيبة يا {partnerName}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {!isBlown ? (
          <button
            onClick={handleBlowCandle}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer text-sm"
          >
            <Flame className="w-4 h-4 fill-current text-yellow-200" />
            <span>طفي الشمعة دلوقتي</span>
          </button>
        ) : (
          <button
            onClick={handleRelight}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200 border border-rose-800/40 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
            <span>ولعي الشمعة تاني</span>
          </button>
        )}

        {/* Revealed Secret Birthday Wish */}
        {showWishLetter && (
          <div className="mt-8 pt-6 border-t border-rose-900/40 w-full animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>أمنيتي ودعائي ليكي في سنتك الجديدة يا ست البنات</span>
            </div>
            <p className="font-poetry text-lg sm:text-xl text-rose-100/90 leading-relaxed [text-wrap:balance]">
              "يا رب يجعل أيامك الجاية كلها سكر زي قلبك، ويفرح روحك وما يوريني فيكي أي حاجة وحشة أبداً، وتفضلي منورة حياتي ومحليّاها دايماً يا أجمل حظ في عمري."
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
