import React, { useState } from 'react';
import { Heart, Sparkles, Send, Quote, Check } from 'lucide-react';
import { romanticAudio } from '../utils/audioEngine';

interface LoveLetterSectionProps {
  partnerName: string;
  senderName: string;
  customMessage?: string;
}

export const LoveLetterSection: React.FC<LoveLetterSectionProps> = ({
  partnerName,
  senderName,
  customMessage,
}) => {
  const [heartPulsed, setHeartPulsed] = useState<boolean>(false);
  const [pulseCount, setPulseCount] = useState<number>(100);

  const defaultMessage = `يا ست البنات وكل أماني الدنيا الحلوة في عيوني..
من أول يوم اتقابلنا وعرفتك فيه في 21 يوليو، وأنا حسيت إن ربنا بيعوضني بيكي عن كل حاجة. وجودك في حياتي نور هادي بيملا قلبي سكينة وفرحة مكنتش أعرفها قبلك.
كل تفصيلة فيكي قريبة لقلبي.. طيبتك، صوتك، طريقتك، حتى سكوتك لما تكوني مرتاحة جنبي. أنتي مش بس حبيبتي، أنتي سندي وسري وأجمل نعمة اتمناها قلبي ودعيت بيها.
في يوم ميلادك، بدعي ربنا يديمك ليا نعمة ما تفارقنيش أبداً، ويجعل كل سنينك فرح وسعادة وراحة بال، ويفضل حبنا بيكبر مع كل يوم ومع كل دقة قلب.
دمتي ليا ضحكتي وعمري وسري الجميل.. بحبك يا روح قلبي للأبد.`;

  const messageText = customMessage && customMessage.trim() !== '' ? customMessage : defaultMessage;

  const handlePulseHeart = () => {
    setHeartPulsed(true);
    setPulseCount(prev => prev + 1);
    romanticAudio.playCelebrationChime();
    setTimeout(() => setHeartPulsed(false), 800);
  };

  return (
    <section id="message" className="relative py-24 px-6 max-w-4xl mx-auto">
      {/* Decorative background aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 text-rose-400 text-xs sm:text-sm font-medium tracking-wider mb-2">
          <span>كلام طالع من كل قلبي</span>
          <span aria-hidden="true">·</span>
          <span>لأغلى إنسانة في الوجود</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          جواب حب لست البنات
        </h2>
      </div>

      {/* Love Letter Card Styled with Velvet Dark Aesthetic */}
      <div className="relative bg-gradient-to-b from-[#180d22] via-[#140a1c] to-[#0f0717] border border-rose-800/30 rounded-3xl p-8 sm:p-14 shadow-2xl box-glow">
        {/* Subtle romantic corner flourishes */}
        <div className="absolute top-4 right-4 text-rose-500/20">
          <Quote className="w-10 h-10 rotate-180" />
        </div>
        <div className="absolute bottom-4 left-4 text-rose-500/20">
          <Quote className="w-10 h-10" />
        </div>

        {/* Letter Salutation */}
        <div className="mb-8 border-b border-rose-900/40 pb-5">
          <span className="text-xs text-rose-400 uppercase tracking-widest block mb-1">
            لروحي وعمري كله..
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-rose-100 font-heading">
            يا أغلى ما ليا، {partnerName || 'حبيبة قلبي'}
          </h3>
        </div>

        {/* Letter Body with Calligraphic Elegance */}
        <div className="font-poetry text-lg sm:text-2xl text-rose-100/90 leading-[2.2] space-y-6 text-right whitespace-pre-line tracking-wide">
          {messageText}
        </div>

        {/* Poetic Verse Highlight */}
        <div className="my-10 p-6 rounded-2xl bg-rose-950/20 border-y border-rose-700/20 text-center">
          <p className="font-poetry text-xl sm:text-2xl text-pink-200 italic leading-relaxed">
            "يا بخت عيني اللي شافت ضحكتك.. <br className="hidden sm:inline" />
            ويا سعد قلبي اللي أنتي نصيبه وفرحته!"
          </p>
        </div>

        {/* Letter Sign-off */}
        <div className="mt-8 pt-6 border-t border-rose-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right w-full sm:w-auto">
            <span className="text-xs text-rose-400 block mb-0.5">بحبك من كل قلبي وبكل ما فيا،</span>
            <span className="text-lg font-semibold text-white font-heading">
              {senderName || 'حبيبك اللي مبيشوفش غيرك'}
            </span>
          </div>

          {/* Interactive Love Pulse Button */}
          <button
            onClick={handlePulseHeart}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all cursor-pointer ${
              heartPulsed
                ? 'bg-rose-600 text-white border-rose-400 scale-105 shadow-lg shadow-rose-600/50'
                : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border-rose-800/40'
            }`}
          >
            <Heart className={`w-4 h-4 fill-current ${heartPulsed ? 'text-white animate-ping' : 'text-rose-400'}`} />
            <span className="text-xs font-medium">
              {heartPulsed ? 'وصلت نبضة حبك يا روحي!' : 'ابعتي نبضة حب لقلبي'}
            </span>
            <span className="text-xs font-mono text-rose-300/80">({pulseCount}❤️)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
