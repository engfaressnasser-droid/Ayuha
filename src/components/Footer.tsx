import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  partnerName: string;
  senderName: string;
}

export const Footer: React.FC<FooterProps> = ({
  partnerName,
  senderName,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-rose-950/50 bg-[#09040f] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-rose-300 font-semibold mb-1">
            <span>اتعملت بكل حب عشان عيون {partnerName || 'حبيبة قلبي'}</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <p className="text-xs text-rose-400/60 font-poetry">
            كل ثانية، وكل دقيقة، وكل سنة.. وأنتي أجمل نعمة في حياتي ومنورة دنيتي كلها.
          </p>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/80 hover:bg-rose-950/60 border border-rose-900/30 text-rose-300 text-xs transition-colors cursor-pointer"
        >
          <span>اطلعي لفوق</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
