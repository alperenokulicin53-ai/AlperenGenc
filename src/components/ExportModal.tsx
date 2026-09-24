import React, { useState } from 'react';
import { StudentProfile, WeekData, ProjectLinkItem } from '../types';
import { X, Copy, Check, Download, RotateCcw, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  weeks: WeekData[];
  links: ProjectLinkItem[];
  onResetToDefault: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  weeks,
  links,
  onResetToDefault,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'markdown' | 'json'>('markdown');

  if (!isOpen) return null;

  // Generate Markdown
  const generateMarkdown = () => {
    let md = `# ${profile.courseCode} - ${profile.courseName}\n`;
    md += `## Proje: ${profile.projectTitle} (Ders Geliştirme Raporu)\n\n`;
    md += `- **Öğrenci:** ${profile.studentName} (${profile.studentNumber})\n`;
    md += `- **Bölüm:** ${profile.department} - ${profile.university}\n`;
    md += `- **Ders Öğretim Üyesi:** ${profile.instructor}\n`;
    md += `- **Dönem:** ${profile.term}\n`;
    md += `- **GitHub:** ${profile.githubUrl}\n\n`;

    if (links.length > 0) {
      md += `### Proje Dosyaları ve Bağlantılar:\n`;
      links.forEach((l) => {
        md += `- [${l.title}](${l.url}) (${l.fileType.toUpperCase()}) ${l.description ? `— ${l.description}` : ''}\n`;
      });
      md += `\n---\n\n`;
    }

    md += `## Haftalık Geliştirme ve İlerleme Raporu\n\n`;

    weeks.forEach((w) => {
      md += `### Hafta ${w.weekNumber}: ${w.title}\n`;
      md += `- **Tarih:** ${w.dateRange}\n`;
      md += `- **Durum:** ${w.status === 'completed' ? 'Tamamlandı' : w.status === 'in_progress' ? 'Devam Ediyor' : 'Planlandı'}\n`;
      md += `- **Harcanan Efor:** ${w.hoursSpent} saat\n`;
      if (w.gitCommit) md += `- **Commit:** \`${w.gitCommit}\`\n`;
      md += `- **Özet:** ${w.summary}\n\n`;

      if (w.updates.length > 0) {
        md += `#### Yapılan Yenilikler & Kod Geliştirmeleri:\n`;
        w.updates.forEach((u) => {
          md += `1. **[${u.category.toUpperCase()}] ${u.title}**\n`;
          md += `   - ${u.description}\n`;
          if (u.impact) md += `   - *Etki:* ${u.impact}\n`;
          if (u.codeSnippet) {
            md += `   - *Kod (${u.codeSnippet.filename}):*\n`;
            md += `   \`\`\`${u.codeSnippet.language}\n${u.codeSnippet.code}\n   \`\`\`\n`;
          }
        });
        md += `\n`;
      }

      if (w.challengesAndSolutions) {
        md += `> **Karşılaşılan Zorluk & Çözüm:** ${w.challengesAndSolutions}\n\n`;
      }

      if (w.teacherNote) {
        md += `> **Öğretim Üyesi Notu:** ${w.teacherNote}\n\n`;
      }

      md += `---\n\n`;
    });

    return md;
  };

  const markdownContent = generateMarkdown();
  const jsonContent = JSON.stringify({ profile, links, weeks }, null, 2);

  const handleCopy = async () => {
    const textToCopy = activeTab === 'markdown' ? markdownContent : jsonContent;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = activeTab === 'markdown' ? markdownContent : jsonContent;
    const filename =
      activeTab === 'markdown'
        ? `ders_proje_30_haftalik_rapor_${profile.studentNumber}.md`
        : `ders_proje_30_hafta_verileri_${profile.studentNumber}.json`;
    const mimeType = activeTab === 'markdown' ? 'text/markdown' : 'application/json';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">30 Haftalık Ders Raporunu Dışa Aktar</h3>
              <p className="text-xs text-slate-500">
                Hocaya teslim, GitHub dokümantasyonu veya ödev arşivi için hazır format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab & Actions Header */}
        <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'markdown'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Markdown Raporu (.md)
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              JSON Verisi (.json)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Panoya Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kopyala</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>İndir</span>
            </button>
          </div>
        </div>

        {/* Preview pane */}
        <div className="p-5 max-h-[50vh] overflow-y-auto bg-slate-900 text-slate-200">
          <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap">
            {activeTab === 'markdown' ? markdownContent : jsonContent}
          </pre>
        </div>

        {/* Footer with Reset option */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (
                window.confirm(
                  '30 haftalık varsayılan ders verilerine dönmek istediğinize emin misiniz? Eklediğiniz özel haftalar sıfırlanacaktır.'
                )
              ) {
                onResetToDefault();
                onClose();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>30 Haftalık Orijinal Verilere Sıfırla</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
