import React, { useState } from 'react';
import { ProjectLinkItem, FileType } from '../types';
import {
  Plus,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  FileText,
  Github,
  HardDrive,
  Figma,
  Archive,
  Image as ImageIcon,
  Globe,
  Paperclip,
  Clock,
} from 'lucide-react';

interface ProjectLinksSectionProps {
  links: ProjectLinkItem[];
  onOpenAddLinkModal: () => void;
  onDeleteLink: (linkId: string) => void;
}

export const ProjectLinksSection: React.FC<ProjectLinksSectionProps> = ({
  links,
  onOpenAddLinkModal,
  onDeleteLink,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const renderIcon = (type: FileType) => {
    switch (type) {
      case 'drive':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
        );
      case 'pdf':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      case 'github':
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-center shrink-0">
            <Github className="w-5 h-5" />
          </div>
        );
      case 'figma':
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
            <Figma className="w-5 h-5" />
          </div>
        );
      case 'archive':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <Archive className="w-5 h-5" />
          </div>
        );
      case 'image':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
        );
      case 'doc':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
        );
    }
  };

  const getTypeName = (type: FileType) => {
    switch (type) {
      case 'drive':
        return 'Google Drive';
      case 'pdf':
        return 'PDF Dokümanı';
      case 'github':
        return 'GitHub Repo';
      case 'figma':
        return 'Figma Tasarımı';
      case 'archive':
        return 'Arşiv / ZIP';
      case 'doc':
        return 'Belge / Kod';
      case 'image':
        return 'Görsel';
      default:
        return 'Web Bağlantısı';
    }
  };

  return (
    <section id="baglantilar" className="py-8 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Proje Dosyaları & Bağlantı Havuzu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Ders Dosyaları, Dokümanlar ve Bağlantılar
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Siteye eklediğiniz tüm dosya ve web bağlantılarına buradan tıklayıp anında ulaşabilirsiniz.
            </p>
          </div>

          <button
            onClick={onOpenAddLinkModal}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all duration-150 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Dosya / Link Ekle</span>
          </button>
        </div>

        {/* Links Grid */}
        {links.length === 0 ? (
          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center">
            <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Henüz Dosya veya Link Eklenmedi</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Google Drive ödev klasörünüzü, GitHub kaynak kodlarınızı, ders sunumu PDF'lerini veya Figma çizimlerinizi buraya ekleyin.
            </p>
            <button
              onClick={onOpenAddLinkModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>İlk Dosyayı / Linki Ekle</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="group relative p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      {renderIcon(link.fileType)}
                      <div>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 mb-0.5">
                          {getTypeName(link.fileType)}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {link.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteLink(link.id)}
                      title="Bu bağlantıyı kaldır"
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {link.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {link.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{link.addedAt}</span>
                    </span>
                    {link.fileSize && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="font-mono text-slate-500 font-medium">{link.fileSize}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(link.url, link.id)}
                      title="Linki Panoya Kopyala"
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Aç</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
