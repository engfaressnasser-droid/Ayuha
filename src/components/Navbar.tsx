import React from 'react';
import { Settings2, Crown, LogOut, Heart } from 'lucide-react';
import { MusicPlayer } from './MusicPlayer';
import { UserSession } from './LoginGateway';

interface NavbarProps {
  partnerName: string;
  onOpenCustomizer: () => void;
  customSongUrl?: string;
  customSongTitle?: string;
  userSession?: UserSession | null;
  onLogout?: () => void;
  isPreviewingAsViewer?: boolean;
  onTogglePreview?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCustomizer,
  customSongUrl,
  customSongTitle,
  userSession,
  onLogout,
  isPreviewingAsViewer,
  onTogglePreview,
}) => {
  const isAdmin = userSession?.role === 'admin' && !isPreviewingAsViewer;
  const isViewer = userSession?.role === 'viewer' || isPreviewingAsViewer;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-rose-950/40 bg-[#0b0612]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#top"
            className="text-sm sm:text-base md:text-lg font-bold tracking-wide text-rose-200 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500 animate-pulse" />
            <span>حكايتنا سوا</span>
          </a>

          {/* User Role Tag */}
          {userSession && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all">
              {isAdmin ? (
                <span className="flex items-center gap-1 text-amber-300 bg-amber-950/40 border border-amber-600/30 px-2 py-0.5 rounded-full">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>فارس (أدمن) 👑</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-pink-300 bg-pink-950/40 border border-pink-600/30 px-2 py-0.5 rounded-full">
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-500/40" />
                  <span>أهلاً أيويه 🌸</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: 4-5 clean single-line nav links (desktop only) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-rose-200/70">
          <a
            href="#message"
            className="hover:text-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            رسالتي ليكي
          </a>
          <a
            href="#gallery"
            className="hover:text-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            ذكرياتنا الحلوة
          </a>
          <a
            href="#reasons"
            className="hover:text-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            ليه بحبك
          </a>
          <a
            href="#wish"
            className="hover:text-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            شمعة وأمنية
          </a>
        </nav>

        {/* Zone 3: Actions (Music player + Settings + Logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <MusicPlayer
            customSongUrl={customSongUrl}
            customSongTitle={customSongTitle}
            onOpenCustomizer={isAdmin ? onOpenCustomizer : undefined}
          />

          {/* If Faress (Admin), he can edit everything */}
          {isAdmin && (
            <button
              onClick={onOpenCustomizer}
              title="تعديل محتوى وبيانات الموقع"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-100 bg-gradient-to-r from-rose-700 to-pink-700 hover:from-rose-600 hover:to-pink-600 border border-rose-500/40 rounded-full sm:rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-md shadow-rose-950/60"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">تعديل الموقع</span>
            </button>
          )}

          {/* Quick Preview Toggle for Faress */}
          {userSession?.role === 'admin' && onTogglePreview && (
            <button
              onClick={onTogglePreview}
              title={isPreviewingAsViewer ? 'الرجوع لوضع التعديل (فارس)' : 'معاينة كما تراه أيويه'}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-purple-200 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-700/40 rounded-lg transition-colors cursor-pointer"
            >
              <span>{isPreviewingAsViewer ? '🔙 وضع التعديل' : '👁️ معاينة كـ أيويه'}</span>
            </button>
          )}

          {/* Logout / Switch Role button */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="تسجيل الخروج أو تبديل الحساب"
              className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] sm:text-xs text-rose-300/80 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/30 rounded-full sm:rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">تبديل</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
