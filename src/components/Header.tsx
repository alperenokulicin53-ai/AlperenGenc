import React from 'react';
import { Plus, Download, GraduationCap, Edit3, Link2, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenAddLinkModal: () => void;
  onOpenExportModal: () => void;
  onOpenProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenAddLinkModal,
  onOpenExportModal,
  onOpenProfileModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Branding */}
        <a
          href="#hero"
          className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5 hover:text-blue-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
            AG
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-extrabold text-slate-900">Alperen Genc</span>
            <span className="text-[10px] text-slate-500 font-medium tracking-normal hidden sm:block">Ders Proje Portalı</span>
          </div>
        </a>

        {/* Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#hero" className="hover:text-slate-900 transition-colors">
            Genel Bakış
          </a>
          <a href="#baglantilar" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Dosyalar & Bağlantılar</span>
          </a>
          <a href="#haftalar" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Eklenen Yenilikler</span>
          </a>
          <button
            onClick={onOpenProfileModal}
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-600"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Ders Bilgileri</span>
          </button>
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddLinkModal}
            title="Siteye Dosya veya Link Ekle"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
          >
            <Link2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Dosya / Link Ekle</span>
          </button>

          <button
            onClick={onOpenExportModal}
            title="Ders raporunu dışa aktar"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Rapor Al</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Yenilik Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
