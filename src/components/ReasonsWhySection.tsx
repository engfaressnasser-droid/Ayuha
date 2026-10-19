import React, { useState } from 'react';
import { Sparkles, Heart, Smile, Sun, Shield, Eye, Compass, Gift } from 'lucide-react';
import { LoveReason } from '../types';

export const ReasonsWhySection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (id: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const reasons: LoveReason[] = [
    {
      id: 1,
      icon: 'smile',
      title: 'ضحكتك اللي بتنورلي الدنيا',
      description: 'لما بتضحكي من قلبك، بحس إن كل تعب الدنيا اتبخر في ثانية، وكأن الفرحة اتخلقت مخصوص عشان وشك.',
    },
    {
      id: 2,
      icon: 'heart',
      title: 'قلبك الأبيض وحنيتك اللي ملهاش زي',
      description: 'طيبتك الفطرية وخوفك عليا واهتمامك بأصغر تفاصيلي بتخليني طاير بيكي ومفيش أسعد مني في الكون.',
    },
    {
      id: 3,
      icon: 'eye',
      title: 'نظرة عينيكي اللي بدوب فيها',
      description: 'في عينيكي بشوف أماني وبيتي ومستقبلي كله، وبحس إن ده المكان الوحيد اللي بهدى فيه بجد.',
    },
    {
      id: 4,
      icon: 'sun',
      title: 'شقاوتك وروحك الحلوة العفوية',
      description: 'عفويتك وجنانك اللذيذ وضحكتك اللي بتطلع من القلب بتخلي لأي يوم عادي جنبك طعم وفرحة تانية خالص.',
    },
    {
      id: 5,
      icon: 'shield',
      title: 'إنك سندي ومطرح ما برتاح',
      description: 'لما الدنيا بتضيق بيا، مش برتاح غير لما أسمع صوتك وأفضفضلك.. أنتي أماني ومطرح ما بهرب من الدنيا.',
    },
    {
      id: 6,
      icon: 'gift',
      title: 'عشان أنتي أحلى رزق ونعمة',
      description: 'بكل تفاصيلك، بصوتك، بطريقتك.. أنتي أحلى حاجة دخلت حياتي ومستعد أعيش عمري كله بس عشان أسعدك.',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'smile': return <Smile className="w-5 h-5 text-pink-400" />;
      case 'heart': return <Heart className="w-5 h-5 text-rose-400 fill-rose-500/30" />;
      case 'eye': return <Eye className="w-5 h-5 text-amber-300" />;
      case 'sun': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'shield': return <Shield className="w-5 h-5 text-purple-400" />;
      default: return <Gift className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <section id="reasons" className="relative py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 text-rose-400 text-xs sm:text-sm font-medium tracking-wider mb-2">
          <span>أسرار بيني وبينك</span>
          <span aria-hidden="true">·</span>
          <span>من بين ألف سبب وسبب</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          ليه بحبك وبموت فيكي؟
        </h2>
        <p className="text-sm text-rose-300/70 mt-2 max-w-lg mx-auto">
          دوسي على أي كارت وشوفي سر من أسراري ليكي
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((item) => {
          const isFlipped = flippedCards[item.id];

          return (
            <div
              key={item.id}
              onClick={() => toggleFlip(item.id)}
              className="relative min-h-[190px] rounded-2xl p-6 border border-rose-900/30 bg-[#13091c]/80 hover:border-rose-500/40 hover:bg-[#180c24] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-rose-950/40 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(item.icon)}
                </div>
                <span className="text-[11px] font-mono text-rose-400/80 bg-rose-950/40 px-2 py-0.5 rounded-md">
                  #{item.id}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-rose-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-200/70 leading-relaxed font-poetry text-base">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-900/30 flex items-center justify-between text-[11px] text-rose-400/60 group-hover:text-rose-300 transition-colors">
                <span>سر من أسرار حبي ليكي</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
