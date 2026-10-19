import React, { useState } from 'react';
import { X, Heart, Sparkles, Send } from 'lucide-react';
import { romanticAudio } from '../utils/audioEngine';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  senderName: string;
  messageBody: string;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  isOpen,
  onClose,
  partnerName,
  senderName,
  messageBody,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    romanticAudio.playCelebrationChime();
  };

  const handleClose = () => {
    setIsOpened(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-xl w-full text-right"
      >
        {!isOpened ? (
          /* Sealed Romantic Envelope */
          <div className="relative bg-[#210e2f] border border-rose-700/50 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center box-glow">
            <button
              onClick={handleClose}
              aria-label="إغلاق الرسالة"
              className="absolute top-4 left-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 shadow-xl shadow-rose-900/60 flex items-center justify-center mb-6 animate-pulse">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>

            <span className="text-xs text-rose-400 font-mono tracking-widest uppercase mb-2">
              جواب سري ومقفول عشانك أنتي وبس
            </span>
            <h3 className="text-2xl font-bold text-white mb-3">
              لأحلى عيون في الدنيا دي كلها.. {partnerName}
            </h3>
            <p className="text-sm text-rose-200/80 mb-8 max-w-xs font-poetry text-base">
              الظرف ده مقفول ومش هيتفتح غير لست البنات اللي خطفت قلبي.. دوسي عشان تفتحي الجواب يا روحي.
            </p>

            <button
              onClick={handleOpenEnvelope}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-2xl shadow-xl shadow-rose-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer text-sm"
            >
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>افتحي الجواب دلوقتي</span>
            </button>
          </div>
        ) : (
          /* Unfolded Parchment Letter */
          <div className="relative bg-gradient-to-b from-[#1b0c26] to-[#12071a] border border-rose-500/40 rounded-3xl p-6 sm:p-12 shadow-2xl box-glow max-h-[85vh] overflow-y-auto">
            <button
              onClick={handleClose}
              aria-label="إغلاق الرسالة"
              className="absolute top-4 left-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-rose-600 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-rose-800/40 pb-4 mb-6 flex items-center justify-between pl-10">
              <div>
                <span className="text-xs text-rose-400 block">كل سنة وأنتي طيبة يا حبيبة قلبي</span>
                <h4 className="text-xl font-bold text-white">لـ {partnerName} ❤️</h4>
              </div>
              <div className="w-8 h-8 rounded-full bg-rose-950 border border-rose-700/40 flex items-center justify-center text-rose-400">
                <Heart className="w-4 h-4 fill-rose-500/30" />
              </div>
            </div>

            <div className="font-poetry text-lg sm:text-xl text-rose-100 leading-[2.2] space-y-4 whitespace-pre-line">
              {messageBody}
            </div>

            <div className="mt-8 pt-6 border-t border-rose-800/40 flex items-center justify-between text-rose-300 text-sm">
              <span className="font-heading font-semibold text-white">
                حبيبك: {senderName}
              </span>
              <span className="font-poetry text-xs text-rose-400/80">
                في كل سنة، حبك أنتي هو أحلى حاجة في حياتي
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
