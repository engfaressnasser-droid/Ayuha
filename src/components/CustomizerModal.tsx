import React, { useState, useRef } from 'react';
import { X, Save, RotateCcw, Heart, Music, Calendar, User, UploadCloud, Trash2, CheckCircle2 } from 'lucide-react';
import { BirthdayConfig } from '../types';
import { saveCustomAudio } from '../utils/audioStorage';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onSaveConfig: (updated: BirthdayConfig) => void;
  onResetDefaults: () => void;
  uploadedAudioUrl?: string | null;
  uploadedAudioName?: string;
  onAudioUploaded?: (audioUrl: string, fileName: string) => void;
  onAudioRemoved?: () => Promise<void>;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDefaults,
  uploadedAudioUrl,
  uploadedAudioName,
  onAudioUploaded,
  onAudioRemoved,
}) => {
  const [partnerName, setPartnerName] = useState(config.partnerName);
  const [senderName, setSenderName] = useState(config.senderName);
  const [birthDate, setBirthDate] = useState(config.birthDate || '2007-10-20');
  const [anniversaryDate, setAnniversaryDate] = useState(config.anniversaryDate || '2026-07-21');
  const [customSongTitle, setCustomSongTitle] = useState(config.customSongTitle);
  const [customSongUrl, setCustomSongUrl] = useState(config.customSongUrl || '');
  const [loveMessageBody, setLoveMessageBody] = useState(config.loveMessageBody);
  const [envelopeLetterBody, setEnvelopeLetterBody] = useState(config.envelopeLetterBody || '');

  // Audio upload state
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const [currentUploadedName, setCurrentUploadedName] = useState<string>(uploadedAudioName || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedAudioFile(file);
    setCurrentUploadedName(file.name);

    // If title was default, suggest the file name
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
    if (!customSongTitle || customSongTitle.includes('أغنيتنا الحلوة') || customSongTitle.trim() === '') {
      setCustomSongTitle(cleanTitle);
    }

    if (previewAudioUrl) {
      URL.revokeObjectURL(previewAudioUrl);
    }
    const newPreview = URL.createObjectURL(file);
    setPreviewAudioUrl(newPreview);
  };

  const handleRemoveAudio = async () => {
    setSelectedAudioFile(null);
    setCurrentUploadedName('');
    if (previewAudioUrl) {
      URL.revokeObjectURL(previewAudioUrl);
      setPreviewAudioUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onAudioRemoved) {
      await onAudioRemoved();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (selectedAudioFile) {
        await saveCustomAudio(selectedAudioFile, selectedAudioFile.name);
        const newUrl = URL.createObjectURL(selectedAudioFile);
        onAudioUploaded?.(newUrl, selectedAudioFile.name);
      }

      onSaveConfig({
        ...config,
        partnerName: partnerName.trim() || 'حبيبتي',
        senderName: senderName.trim() || 'حبيبكِ',
        birthDate: birthDate || '2007-10-20',
        anniversaryDate: anniversaryDate || '2026-07-21',
        customSongTitle: customSongTitle.trim() || (selectedAudioFile ? selectedAudioFile.name.replace(/\.[^/.]+$/, "") : 'أغنيتنا الحلوة اللي بنحبها'),
        customSongUrl: customSongUrl.trim(),
        loveMessageBody: loveMessageBody.trim(),
        envelopeLetterBody: envelopeLetterBody.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const activeAudioPreview = previewAudioUrl || uploadedAudioUrl;
  const hasActiveAudioFile = !!(selectedAudioFile || currentUploadedName);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#150a20] border border-rose-800/50 rounded-2xl max-w-lg w-full p-6 text-right shadow-2xl my-8"
      >
        <div className="flex items-center justify-between pb-4 border-b border-rose-900/40 mb-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-lg font-bold text-white">تعديل بيانات الحفلة وعيد الميلاد</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق نافذة التعديل"
            className="text-rose-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>اسم حبيبتك (صاحبة العيد)</span>
              </label>
              <input
                type="text"
                required
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="مثلاً: سارة / نور / حبيبة قلبي"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>اسمك أنت (حبيبها)</span>
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="مثلاً: فارس / حبيبك للأبد"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>تاريخ ميلادها (20/10/2007)</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-rose-300 mb-1">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>تاريخ ما اتعرفنا على بعض (21 يوليو 2026)</span>
              </label>
              <input
                type="date"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Music Configuration: Direct phone upload + Link fallback */}
          <div className="pt-3 border-t border-rose-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                <Music className="w-4 h-4 text-rose-400" />
                <span>أغنية الاحتفال (ارفعها من تليفونك مباشرة) 🎵</span>
              </label>
              <span className="text-[10px] text-pink-300/80">MP3 / M4A / تسجيل صوتي</span>
            </div>

            {/* Direct Phone Audio File Upload Box */}
            <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-rose-800/40 space-y-3">
              {!hasActiveAudioFile ? (
                <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-rose-600/50 hover:border-rose-400 rounded-xl cursor-pointer bg-rose-950/20 hover:bg-rose-950/40 transition-all text-center group">
                  <UploadCloud className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform animate-pulse" />
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-white">
                      اضغط هنا واختار ملف الأغنية من التليفون 🎵
                    </span>
                    <span className="block text-[11px] text-rose-300/70 mt-1">
                      يدعم ملفات MP3 أو أي ملف صوتي من جهازك وهيشتغل على طول بدون روابط
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac"
                    onChange={handleAudioFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                /* Stored / Selected Audio File Card */
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-600/50 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="text-right overflow-hidden">
                        <span className="text-xs font-bold text-white block truncate">
                          {selectedAudioFile ? selectedAudioFile.name : currentUploadedName}
                        </span>
                        <span className="text-[10px] text-rose-300/80">
                          {selectedAudioFile
                            ? `${(selectedAudioFile.size / (1024 * 1024)).toFixed(2)} ميجابايت (جاهزة للحفظ)`
                            : 'أغنيتكم الخاصة مرفوعة ومحفوظة على جهازك ✅'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveAudio}
                      title="حذف الأغنية والرجوع لعزف البيانو"
                      className="p-1.5 px-2.5 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-200 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">حذف الملف</span>
                    </button>
                  </div>

                  {/* Audio Preview player inside modal so user can test before/after saving */}
                  {activeAudioPreview && (
                    <div className="mt-1">
                      <span className="text-[10px] text-rose-300/70 block mb-1">
                        تجربة الاستماع للأغنية المختارة:
                      </span>
                      <audio
                        src={activeAudioPreview}
                        controls
                        className="w-full h-8 rounded-lg"
                      />
                    </div>
                  )}

                  <label className="text-[11px] text-rose-400 hover:text-rose-200 underline cursor-pointer text-center block pt-1">
                    تغيير واختيار ملف أغنية تاني من التليفون
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac"
                      onChange={handleAudioFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Song Title Input */}
              <div>
                <label className="block text-[11px] font-medium text-rose-300/90 mb-1">
                  اسم الأغنية اللي هيظهر في الموقع
                </label>
                <input
                  type="text"
                  value={customSongTitle}
                  onChange={(e) => setCustomSongTitle(e.target.value)}
                  placeholder="مثلاً: أغنيتنا المفضلة"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-rose-900/40 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Collapsible / Optional URL fallback */}
              <div className="pt-1 border-t border-rose-900/30">
                <label className="block text-[11px] text-rose-300/70 mb-1">
                  أو رابط MP3 مباشر (اختياري - لو مش عاوز ترفع من الجهاز):
                </label>
                <input
                  type="url"
                  value={customSongUrl}
                  onChange={(e) => setCustomSongUrl(e.target.value)}
                  placeholder="https://example.com/our-song.mp3"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-rose-900/30 text-xs text-white/80 focus:outline-none focus:border-rose-500"
                />
              </div>

              <p className="text-[10px] text-rose-300/60 leading-relaxed">
                💡 لو مفيش ملف مرفوع أو رابط، هيشتغل تلقائياً لحن البيانو الرومانسي الهادي بجودة عالية.
              </p>
            </div>
          </div>

          {/* Letter 1: The Secret Envelope Letter (افتحي الجواب بتاعي ليكي) */}
          <div className="pt-2 border-t border-rose-900/30 space-y-1">
            <label className="block text-xs font-semibold text-rose-300">
              💌 رسالة الظرف المقفول (زر "افتحي الجواب بتاعي ليكي" في الأعلى):
            </label>
            <span className="block text-[11px] text-rose-400/70 mb-1">
              الرسالة السرية اللي بتظهر لما تفتح الظرف من فوق
            </span>
            <textarea
              rows={4}
              value={envelopeLetterBody}
              onChange={(e) => setEnvelopeLetterBody(e.target.value)}
              placeholder="اكتب هنا الرسالة اللي جوه الظرف السري..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500 font-poetry leading-relaxed"
            />
          </div>

          {/* Letter 2: The stationary On-Page Letter Section (جواب حب لست البنات تحت) */}
          <div className="pt-2 border-t border-rose-900/30 space-y-1">
            <label className="block text-xs font-semibold text-rose-300">
              📜 جواب الحب لست البنات (المعروض تحت في الصفحة):
            </label>
            <span className="block text-[11px] text-rose-400/70 mb-1">
              الجواب الكبير الثابت المعروض داخل الصفحة في الأسفل
            </span>
            <textarea
              rows={4}
              value={loveMessageBody}
              onChange={(e) => setLoveMessageBody(e.target.value)}
              placeholder="اكتب هنا الجواب المعروض في أسفل الصفحة..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-rose-900/40 text-sm text-white focus:outline-none focus:border-rose-500 font-poetry leading-relaxed"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-rose-900/40">
            <button
              type="button"
              onClick={onResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>رجّع البيانات الأصلية</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-rose-300 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'جاري الحفظ...' : 'احفظ التعديلات'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
