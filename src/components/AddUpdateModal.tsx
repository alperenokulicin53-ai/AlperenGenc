import React, { useState, useEffect } from 'react';
import { WeekData, UpdateCategory, UpdateItem, FileType } from '../types';
import { X, Sparkles, Code2, AlertCircle, Paperclip, Clock, Calendar } from 'lucide-react';

interface AddUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeks: WeekData[];
  preselectedWeekId?: string | null;
  editingWeek?: WeekData | null;
  onSaveNewWeek: (newWeek: WeekData) => void;
  onUpdateWeek: (updatedWeek: WeekData) => void;
  onSaveUpdateToWeek: (weekId: string, updateItem: UpdateItem) => void;
}

export const AddUpdateModal: React.FC<AddUpdateModalProps> = ({
  isOpen,
  onClose,
  weeks,
  preselectedWeekId,
  editingWeek,
  onSaveNewWeek,
  onUpdateWeek,
  onSaveUpdateToWeek,
}) => {
  const [modalMode, setModalMode] = useState<'update' | 'week'>('update');

  // Helper function to get local date & time formatted
  const getNowFormatted = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Form states for update
  const [targetWeekId, setTargetWeekId] = useState<string>('');
  const [updateCategory, setUpdateCategory] = useState<UpdateCategory>('feature');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateTags, setUpdateTags] = useState('');
  const [updateImpact, setUpdateImpact] = useState('');
  const [updateDateTime, setUpdateDateTime] = useState<string>(getNowFormatted());

  // Attachment states
  const [hasAttachment, setHasAttachment] = useState(false);
  const [attachmentTitle, setAttachmentTitle] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentType, setAttachmentType] = useState<FileType>('drive');

  // Code snippet states
  const [hasCodeSnippet, setHasCodeSnippet] = useState(false);
  const [snippetFilename, setSnippetFilename] = useState('src/App.tsx');
  const [snippetLanguage, setSnippetLanguage] = useState('typescript');
  const [snippetCode, setSnippetCode] = useState('');

  // Form states for new week
  const [newWeekNumber, setNewWeekNumber] = useState(weeks.length + 1);
  const [newWeekTitle, setNewWeekTitle] = useState('');
  const [newWeekDateRange, setNewWeekDateRange] = useState('');
  const [newWeekSummary, setNewWeekSummary] = useState('');
  const [newWeekHours, setNewWeekHours] = useState(8);
  const [newWeekStatus, setNewWeekStatus] = useState<'completed' | 'in_progress' | 'planned'>('completed');
  const [newWeekCommit, setNewWeekCommit] = useState('');
  const [newWeekDriveUrl, setNewWeekDriveUrl] = useState('');
  const [newWeekChallenges, setNewWeekChallenges] = useState('');

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (editingWeek) {
      setModalMode('week');
      setNewWeekNumber(editingWeek.weekNumber);
      setNewWeekTitle(editingWeek.title);
      setNewWeekDateRange(editingWeek.dateRange);
      setNewWeekSummary(editingWeek.summary);
      setNewWeekHours(editingWeek.hoursSpent);
      setNewWeekStatus(editingWeek.status);
      setNewWeekCommit(editingWeek.gitCommit || '');
      setNewWeekDriveUrl(editingWeek.driveUrl || '');
      setNewWeekChallenges(editingWeek.challengesAndSolutions || '');
    } else if (preselectedWeekId) {
      setTargetWeekId(preselectedWeekId);
      setModalMode('update');
      setUpdateDateTime(getNowFormatted());
    } else if (weeks.length > 0) {
      if (!targetWeekId || !weeks.some((w) => w.id === targetWeekId)) {
        setTargetWeekId(weeks[0].id);
      }
      setUpdateDateTime(getNowFormatted());
    }
  }, [editingWeek, preselectedWeekId, weeks, targetWeekId]);

  useEffect(() => {
    if (!editingWeek) {
      setNewWeekNumber(weeks.length + 1);
    }
  }, [weeks, editingWeek]);

  if (!isOpen) return null;

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!updateTitle.trim() || !updateDescription.trim()) {
      setFormError('Lütfen başlık ve açıklama alanlarını doldurun.');
      return;
    }

    let effectiveWeekId = targetWeekId;

    // If no weeks exist yet, auto create Week 1
    if (weeks.length === 0 || !effectiveWeekId) {
      const autoWeek: WeekData = {
        id: `week-1-${Date.now()}`,
        weekNumber: 1,
        title: '1. Hafta Geliştirmeleri',
        dateRange: '1. Hafta',
        status: 'completed',
        summary: 'Proje başlangıcı ve ilk geliştirmeler',
        hoursSpent: 8,
        updates: [],
      };
      onSaveNewWeek(autoWeek);
      effectiveWeekId = autoWeek.id;
    }

    const tagsArray = updateTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Format human-friendly creation date & time: "24 Eyl 2026, 11:23"
    let createdAtValue = '';
    try {
      const d = updateDateTime ? new Date(updateDateTime) : new Date();
      createdAtValue = d.toLocaleString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      createdAtValue = new Date().toLocaleString('tr-TR');
    }

    const newUpdate: UpdateItem = {
      id: `upd-${Date.now().toString().slice(-5)}`,
      category: updateCategory,
      title: updateTitle.trim(),
      description: updateDescription.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['Yenilik'],
      createdAt: createdAtValue,
      impact: updateImpact.trim() || undefined,
      attachment:
        hasAttachment && attachmentUrl.trim()
          ? {
              title: attachmentTitle.trim() || (attachmentType === 'drive' ? 'Google Drive Klasörü / Dosyası' : 'Ekli Dosya / Bağlantı'),
              url: attachmentUrl.trim(),
              fileType: attachmentType,
            }
          : undefined,
      codeSnippet:
        hasCodeSnippet && snippetCode.trim()
          ? {
              filename: snippetFilename.trim() || 'src/component.tsx',
              language: snippetLanguage,
              code: snippetCode,
            }
          : undefined,
    };

    onSaveUpdateToWeek(effectiveWeekId, newUpdate);
    resetForm();
    onClose();
  };

  const handleSubmitNewWeek = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newWeekTitle.trim() || !newWeekSummary.trim()) {
      setFormError('Lütfen hafta başlığını ve haftalık özeti doldurun.');
      return;
    }

    if (editingWeek) {
      const updated: WeekData = {
        ...editingWeek,
        weekNumber: Number(newWeekNumber),
        title: newWeekTitle.trim(),
        dateRange: newWeekDateRange.trim() || editingWeek.dateRange,
        status: newWeekStatus,
        summary: newWeekSummary.trim(),
        hoursSpent: Number(newWeekHours) || 8,
        gitCommit: newWeekCommit.trim() || undefined,
        driveUrl: newWeekDriveUrl.trim() || undefined,
        challengesAndSolutions: newWeekChallenges.trim() || undefined,
      };
      onUpdateWeek(updated);
    } else {
      const newWeek: WeekData = {
        id: `week-${newWeekNumber}-${Date.now().toString().slice(-4)}`,
        weekNumber: Number(newWeekNumber),
        title: newWeekTitle.trim(),
        dateRange: newWeekDateRange.trim() || `${newWeekNumber}. Hafta`,
        status: newWeekStatus,
        summary: newWeekSummary.trim(),
        hoursSpent: Number(newWeekHours) || 8,
        gitCommit: newWeekCommit.trim() || undefined,
        driveUrl: newWeekDriveUrl.trim() || undefined,
        challengesAndSolutions: newWeekChallenges.trim() || undefined,
        updates: [],
      };
      onSaveNewWeek(newWeek);
    }

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setUpdateTitle('');
    setUpdateDescription('');
    setUpdateTags('');
    setUpdateImpact('');
    setHasAttachment(false);
    setAttachmentTitle('');
    setAttachmentUrl('');
    setHasCodeSnippet(false);
    setSnippetCode('');
    setNewWeekTitle('');
    setNewWeekSummary('');
    setNewWeekDriveUrl('');
    setFormError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              {modalMode === 'update'
                ? 'Haftaya Yeni Yenilik & Geliştirme Ekle'
                : 'Ders Haftası Oluştur / Düzenle'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="px-5 pt-4 pb-2 border-b border-slate-200 bg-white flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalMode('update')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              modalMode === 'update'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Haftalık Yenilik Ekle
          </button>
          <button
            type="button"
            onClick={() => setModalMode('week')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              modalMode === 'week'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            + Yeni Hafta Ekle / Düzenle
          </button>
        </div>

        {/* Error message */}
        {formError && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Forms */}
        {modalMode === 'update' ? (
          <form onSubmit={handleSubmitUpdate} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Target Week Picker */}
            {weeks.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Güncellemenin Ekleneceği Hafta
                </label>
                <select
                  value={targetWeekId}
                  onChange={(e) => setTargetWeekId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  {[...weeks]
                    .sort((a, b) => a.weekNumber - b.weekNumber)
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        Hafta {w.weekNumber}: {w.title}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Category & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yenilik Kategorisi
                </label>
                <select
                  value={updateCategory}
                  onChange={(e) => setUpdateCategory(e.target.value as UpdateCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="ui">Arayüz & Tasarım (UI/UX)</option>
                  <option value="feature">Yeni Özellik (Feature)</option>
                  <option value="performance">Performans & İyileştirme</option>
                  <option value="bugfix">Hata Çözümü (Bugfix)</option>
                  <option value="assignment">Ödev & Teslim</option>
                  <option value="docs">Dökümantasyon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Etiketler (Virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={updateTags}
                  onChange={(e) => setUpdateTags(e.target.value)}
                  placeholder="React, Tailwind, Beyaz Tema, API"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Yenilik Başlığı *
              </label>
              <input
                type="text"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                placeholder="Örn: Açık Tema Dönüşümü ve Beyaz Zemin Tasarımı"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                required
              />
            </div>

            {/* Date & Time Field */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Eklenme Tarihi ve Saati</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUpdateDateTime(getNowFormatted())}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  <span>Şu Anki Saati Al</span>
                </button>
              </div>
              <input
                type="datetime-local"
                value={updateDateTime}
                onChange={(e) => setUpdateDateTime(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Yenilik veya link eklendiğinde bu saat ve tarih kart üzerinde açıkça gösterilir.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Açıklama & Yapılan Geliştirme *
              </label>
              <textarea
                rows={3}
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
                placeholder="Bu yenilikte ne yapıldı, arayüz veya kod tarafında neler değişti?"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                required
              />
            </div>

            {/* Impact */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Etki / Çıktı Notu (Opsiyonel)
              </label>
              <input
                type="text"
                value={updateImpact}
                onChange={(e) => setUpdateImpact(e.target.value)}
                placeholder="Örn: Sayfa açılışı hızlandı, okunabilirlik arttı"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* File / Link Attachment Section */}
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAttachment}
                  onChange={(e) => setHasAttachment(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                <span>Bu Yeniliğe İlgili Dosya veya Link Ekle</span>
              </label>

              {hasAttachment && (
                <div className="mt-3 space-y-3 p-3.5 rounded-xl bg-blue-50/50 border border-blue-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-700 font-semibold mb-1">
                        Dosya / Link Adı
                      </label>
                      <input
                        type="text"
                        value={attachmentTitle}
                        onChange={(e) => setAttachmentTitle(e.target.value)}
                        placeholder="Örn: Ödev Raporu (PDF)"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-700 font-semibold mb-1">
                        Tür
                      </label>
                      <select
                        value={attachmentType}
                        onChange={(e) => setAttachmentType(e.target.value as FileType)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                      >
                        <option value="drive">Google Drive</option>
                        <option value="pdf">PDF Dokümanı</option>
                        <option value="github">GitHub Repo</option>
                        <option value="figma">Figma Tasarımı</option>
                        <option value="archive">ZIP / Arşiv</option>
                        <option value="link">Web Bağlantısı</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-700 font-semibold mb-1">
                      Bağlantı URL'si (Tıklandığında açılacak link)
                    </label>
                    <input
                      type="url"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      placeholder="https://drive.google.com/... veya https://..."
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Code Snippet Checkbox & Inputs */}
            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCodeSnippet}
                  onChange={(e) => setHasCodeSnippet(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <Code2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Kod Parçacığı Ekle (Opsiyonel)</span>
              </label>

              {hasCodeSnippet && (
                <div className="mt-3 space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-600 font-semibold mb-1">Dosya Adı</label>
                      <input
                        type="text"
                        value={snippetFilename}
                        onChange={(e) => setSnippetFilename(e.target.value)}
                        placeholder="src/components/MyComponent.tsx"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 font-semibold mb-1">Dil</label>
                      <input
                        type="text"
                        value={snippetLanguage}
                        onChange={(e) => setSnippetLanguage(e.target.value)}
                        placeholder="typescript, css, html"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 font-semibold mb-1">Kod İçeriği</label>
                    <textarea
                      rows={4}
                      value={snippetCode}
                      onChange={(e) => setSnippetCode(e.target.value)}
                      placeholder="// Kod satırlarınızı buraya yapıştırın"
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs font-mono text-slate-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
              >
                Yeniliği Kaydet
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitNewWeek} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hafta Numarası
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newWeekNumber}
                  onChange={(e) => setNewWeekNumber(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tarih / Dönem Notu
                </label>
                <input
                  type="text"
                  value={newWeekDateRange}
                  onChange={(e) => setNewWeekDateRange(e.target.value)}
                  placeholder="Örn: 1. Hafta · Ekim 2025"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hafta Başlığı *
              </label>
              <input
                type="text"
                value={newWeekTitle}
                onChange={(e) => setNewWeekTitle(e.target.value)}
                placeholder="Örn: Proje Mimarisi, Taslaklar ve Arayüz Kurulumu"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Haftalık Özet *
              </label>
              <textarea
                rows={3}
                value={newWeekSummary}
                onChange={(e) => setNewWeekSummary(e.target.value)}
                placeholder="Bu hafta derste ve projede hangi ana yenilikler yapıldı?"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Haftalık Durum
                </label>
                <select
                  value={newWeekStatus}
                  onChange={(e) => setNewWeekStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="completed">Tamamlandı</option>
                  <option value="in_progress">Devam Ediyor</option>
                  <option value="planned">Planlandı</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Harcanan Saat (Tahmini)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newWeekHours}
                  onChange={(e) => setNewWeekHours(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Karşılaşılan Zorluklar ve Çözümler (Opsiyonel)
              </label>
              <textarea
                rows={2}
                value={newWeekChallenges}
                onChange={(e) => setNewWeekChallenges(e.target.value)}
                placeholder="Karşılaşılan zorluklar ve bunların nasıl çözüldüğü"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <svg viewBox="0 0 87.3 78" className="w-3.5 h-3.5" fill="none">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.45z" fill="#00ac47"/>
                  <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.3c.8-1.4 1.2-2.95 1.2-4.5H59.85l6.1 10.6z" fill="#ea4335"/>
                  <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.4-4.5 1.2z" fill="#00832d"/>
                  <path d="M59.85 53H87.3c0-1.55-.4-3.1-1.2-4.5l-22.1-38.3c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25z" fill="#2684fc"/>
                  <path d="M73.55 76.8c1.4-.8 2.5-1.9 3.3-3.3L63.1 50.15 56.95 39.55 43.65 25 29.9 50.15h43.65z" fill="#ffba00"/>
                </svg>
                <span>Haftalık Google Drive Linki (Klasör veya Dosya)</span>
              </label>
              <input
                type="url"
                value={newWeekDriveUrl}
                onChange={(e) => setNewWeekDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/... veya dosya linki"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Buraya eklediğiniz Google Drive linki, haftanın kartında buton olarak yer alır ve tıklandığında hocayı doğrudan Google Drive'a götürür.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Git Commit Notu (Opsiyonel)
              </label>
              <input
                type="text"
                value={newWeekCommit}
                onChange={(e) => setNewWeekCommit(e.target.value)}
                placeholder="Örn: 8a3b1c - feat: add week core features"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
              >
                Haftayı Kaydet
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
