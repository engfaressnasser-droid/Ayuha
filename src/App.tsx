/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FloatingHeartsCanvas } from './components/FloatingHeartsCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LoveLetterSection } from './components/LoveLetterSection';
import { GallerySection } from './components/GallerySection';
import { ReasonsWhySection } from './components/ReasonsWhySection';
import { BirthdayWishSection } from './components/BirthdayWishSection';
import { CustomizerModal } from './components/CustomizerModal';
import { LoveLetterModal } from './components/LoveLetterModal';
import { LoginGateway, UserSession } from './components/LoginGateway';
import { Footer } from './components/Footer';
import { BirthdayConfig, MemoryImage } from './types';
import { getCustomAudio, removeCustomAudio } from './utils/audioStorage';

const DEFAULT_ENVELOPE_LETTER = `إلى أغلى وأحلى صدفة حصلت في عمري، وحتة السكر اللي محلية دنيتي..
النهاردة مش مجرد يوم عادي، ده اليوم اللي ربنا رزقني فيه بأجمل هدية. من يوم ما دخلتي حياتي وكل حاجة بقى ليها طعم وشكل تاني يجنن.
كل سنة وأنتي الضحكة اللي بتطمن قلبي، وأحلى اختيار اخترته وعمري ما هندم عليه أبداً. يا بختي بيكي وبطيبتك وحنيتك اللي مفيش زيها في الدنيا دي كلها.
أنا بوعدك في سنتك الجديدة إني أفضل دايماً جنبك، في ضهرك، وأعمل كل اللي أقدر عليه عشان أشوف ضحكتك منورة وشك دايماً، ونفضل مكملين سوا خطوة بخطوة لكل حاجة حلوة بنحلم بيها.
بحبك من هنا لآخر العمر يا أجمل بداية لكل حاجة حلوة في حياتي`;

const DEFAULT_PAGE_LOVE_MESSAGE = `يا ست البنات وكل أماني الدنيا الحلوة في عيوني..
من أول يوم اتقابلنا وعرفتك فيه في 21 يوليو، وأنا حسيت إن ربنا بيعوضني بيكي عن كل حاجة. وجودك في حياتي نور هادي بيملا قلبي سكينة وفرحة مكنتش أعرفها قبلك.
كل تفصيلة فيكي قريبة لقلبي.. طيبتك، صوتك، طريقتك، حتى سكوتك لما تكوني مرتاحة جنبي. أنتي مش بس حبيبتي، أنتي سندي وسري وأجمل نعمة اتمناها قلبي ودعيت بيها.
في يوم ميلادك، بدعي ربنا يديمك ليا نعمة ما تفارقنيش أبداً، ويجعل كل سنينك فرح وسعادة وراحة بال، ويفضل حبنا بيكبر مع كل يوم ومع كل دقة قلب.
دمتي ليا ضحكتي وعمري وسري الجميل.. بحبك يا روح قلبي للأبد.`;

const INITIAL_CONFIG: BirthdayConfig = {
  partnerName: 'حبيبة قلبي ونور عيني',
  senderName: 'حبيبك اللي مبيشوفش غيرك',
  birthDate: '2007-10-20',
  anniversaryDate: '2026-07-21',
  mainHeadline: 'كل سنة وأنتي أجمل حاجة في حياتي',
  loveMessageTitle: 'كلام طالع من كل قلبي ليكي يا ست البنات',
  loveMessageBody: DEFAULT_PAGE_LOVE_MESSAGE,
  envelopeLetterBody: DEFAULT_ENVELOPE_LETTER,
  customSongTitle: 'أغنيتنا الحلوة اللي بنحبها 🎵',
  customSongUrl: '',
};

// Start with an empty gallery so the user can upload their own real memories
const INITIAL_MEMORIES: MemoryImage[] = [];

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(() => {
    try {
      const saved = localStorage.getItem('romantic_bday_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        let updated = false;
        // Ensure meeting date is 21 July 2026
        if (parsed.anniversaryDate !== '2026-07-21') {
          parsed.anniversaryDate = '2026-07-21';
          updated = true;
        }
        if (parsed.birthDate !== '2007-10-20') {
          parsed.birthDate = '2007-10-20';
          updated = true;
        }
        // Ensure envelope letter and page letter are distinct and not identical
        if (!parsed.envelopeLetterBody || parsed.envelopeLetterBody === parsed.loveMessageBody) {
          parsed.envelopeLetterBody = DEFAULT_ENVELOPE_LETTER;
          parsed.loveMessageBody = DEFAULT_PAGE_LOVE_MESSAGE;
          updated = true;
        }
        if (updated) {
          localStorage.setItem('romantic_bday_config', JSON.stringify(parsed));
        }
        return parsed;
      }
      return INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  const [memories, setMemories] = useState<MemoryImage[]>(() => {
    try {
      const saved = localStorage.getItem('romantic_bday_memories');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear old dummy placeholder cards (mem-1, mem-2, etc.) as requested by user
        const realUserPhotos = parsed.filter((m: MemoryImage) => !m.id.startsWith('mem-'));
        return realUserPhotos;
      }
      return INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  // User login session (Faress = admin, ايويه = viewer)
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('romantic_user_session');
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isPreviewingAsViewer, setIsPreviewingAsViewer] = useState<boolean>(false);

  // Stored audio state from phone via IndexedDB
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [uploadedAudioName, setUploadedAudioName] = useState<string>('');

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);

  const handleLogin = (session: UserSession) => {
    setUserSession(session);
    setIsPreviewingAsViewer(false);
    try {
      localStorage.setItem('romantic_user_session', JSON.stringify(session));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    setIsPreviewingAsViewer(false);
    try {
      localStorage.removeItem('romantic_user_session');
    } catch (e) {
      console.error(e);
    }
  };

  // Load custom audio from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    getCustomAudio().then((stored) => {
      if (isMounted && stored) {
        const url = URL.createObjectURL(stored.blob);
        setUploadedAudioUrl(url);
        setUploadedAudioName(stored.fileName);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAudioUploaded = (blobUrl: string, fileName: string) => {
    if (uploadedAudioUrl) {
      URL.revokeObjectURL(uploadedAudioUrl);
    }
    setUploadedAudioUrl(blobUrl);
    setUploadedAudioName(fileName);
  };

  const handleAudioRemoved = async () => {
    if (uploadedAudioUrl) {
      URL.revokeObjectURL(uploadedAudioUrl);
    }
    setUploadedAudioUrl(null);
    setUploadedAudioName('');
    await removeCustomAudio();
  };

  // Save changes to localStorage
  const handleSaveConfig = (updated: BirthdayConfig) => {
    setConfig(updated);
    try {
      localStorage.setItem('romantic_bday_config', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDefaults = async () => {
    setConfig(INITIAL_CONFIG);
    setMemories(INITIAL_MEMORIES);
    localStorage.removeItem('romantic_bday_config');
    localStorage.removeItem('romantic_bday_memories');
    await handleAudioRemoved();
    setIsCustomizerOpen(false);
  };

  const handleAddMemory = (newMem: MemoryImage) => {
    const updated = [newMem, ...memories];
    setMemories(updated);
    try {
      localStorage.setItem('romantic_bday_memories', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    try {
      localStorage.setItem('romantic_bday_memories', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const activeSongUrl = uploadedAudioUrl || config.customSongUrl;
  const activeSongTitle = uploadedAudioName
    ? (config.customSongTitle || uploadedAudioName)
    : config.customSongTitle;

  // If no user is logged in, show the romantic Login Gateway screen
  if (!userSession) {
    return (
      <div className="min-h-screen bg-[#0b0612] text-[#fce7f3] relative overflow-hidden">
        {/* Ambient floating hearts in the background */}
        <FloatingHeartsCanvas />
        <LoginGateway onLogin={handleLogin} />
      </div>
    );
  }

  const effectiveRole = isPreviewingAsViewer ? 'viewer' : userSession.role;
  const canEdit = effectiveRole === 'admin';

  return (
    <div className="min-h-screen bg-[#0b0612] text-[#fce7f3] selection:bg-rose-500 selection:text-white relative">
      {/* Dynamic Floating Hearts Canvas Background */}
      <FloatingHeartsCanvas />

      {/* Top Navbar with integrated responsive Music Player */}
      <Navbar
        partnerName={config.partnerName}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        customSongUrl={activeSongUrl}
        customSongTitle={activeSongTitle}
        userSession={userSession}
        onLogout={handleLogout}
        isPreviewingAsViewer={isPreviewingAsViewer}
        onTogglePreview={() => setIsPreviewingAsViewer((prev) => !prev)}
      />

      {/* Preview mode alert bar if Faress is previewing as Ayweya */}
      {isPreviewingAsViewer && (
        <div className="sticky top-14 z-20 w-full bg-purple-950/90 border-b border-purple-600/40 py-2 px-4 text-center text-xs text-purple-200 flex items-center justify-center gap-3 backdrop-blur-md">
          <span>👁️ أنت دلوقتي في وضع المعاينة (زي ما أيويه هتشوف الموقع بالظبط - القراءة فقط)</span>
          <button
            onClick={() => setIsPreviewingAsViewer(false)}
            className="px-2.5 py-0.5 rounded-full bg-purple-700 hover:bg-purple-600 text-white font-bold cursor-pointer transition-colors"
          >
            الرجوع للتعديل
          </button>
        </div>
      )}

      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection
          partnerName={config.partnerName}
          senderName={config.senderName}
          birthDate={config.birthDate}
          anniversaryDate={config.anniversaryDate}
          headline={config.mainHeadline}
          onOpenLetter={() => setIsLetterModalOpen(true)}
          userSession={isPreviewingAsViewer ? { ...userSession, role: 'viewer' } : userSession}
        />

        {/* Love Letter Section */}
        <LoveLetterSection
          partnerName={config.partnerName}
          senderName={config.senderName}
          customMessage={config.loveMessageBody}
        />

        {/* Gallery Section */}
        <GallerySection
          memories={memories}
          onAddMemory={handleAddMemory}
          onDeleteMemory={handleDeleteMemory}
          canEdit={canEdit}
        />

        {/* Reasons Why I Love You Section */}
        <ReasonsWhySection />

        {/* Birthday Cake & Candle Section */}
        <BirthdayWishSection
          partnerName={config.partnerName}
        />
      </main>

      {/* Footer */}
      <Footer
        partnerName={config.partnerName}
        senderName={config.senderName}
      />

      {/* Modals - Only editable by Admin/Faress */}
      {canEdit && (
        <CustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          config={config}
          onSaveConfig={handleSaveConfig}
          onResetDefaults={handleResetDefaults}
          uploadedAudioUrl={uploadedAudioUrl}
          uploadedAudioName={uploadedAudioName}
          onAudioUploaded={handleAudioUploaded}
          onAudioRemoved={handleAudioRemoved}
        />
      )}

      <LoveLetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        partnerName={config.partnerName}
        senderName={config.senderName}
        messageBody={config.envelopeLetterBody || DEFAULT_ENVELOPE_LETTER}
      />
    </div>
  );
}
