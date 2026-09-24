import React, { useState, useMemo } from 'react';
import { WeekData, UpdateItem } from '../types';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Plus,
  Edit2,
  Trash2,
  Code2,
  Sparkles,
  Palette,
  Zap,
  Bug,
  FileText,
  Award,
  AlertCircle,
  ExternalLink,
  Paperclip,
  CheckCircle2,
  Flame,
  ArrowLeft,
  ArrowRight,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';

export const GoogleDriveIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 87.3 78" className={className} fill="none">
    <path
      d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"
      fill="#0066da"
    />
    <path
      d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.45z"
      fill="#00ac47"
    />
    <path
      d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.3c.8-1.4 1.2-2.95 1.2-4.5H59.85l6.1 10.6z"
      fill="#ea4335"
    />
    <path
      d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.4-4.5 1.2z"
      fill="#00832d"
    />
    <path
      d="M59.85 53H87.3c0-1.55-.4-3.1-1.2-4.5l-22.1-38.3c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25z"
      fill="#2684fc"
    />
    <path
      d="M73.55 76.8c1.4-.8 2.5-1.9 3.3-3.3L63.1 50.15 56.95 39.55 43.65 25 29.9 50.15h43.65z"
      fill="#ffba00"
    />
  </svg>
);

interface WeekChangelogProps {
  weeks: WeekData[];
  onAddUpdateToWeek: (weekId: string) => void;
  onEditWeek: (week: WeekData) => void;
  onRenameWeekTitle?: (weekId: string, newTitle: string) => void;
  onUpdateWeekDriveUrl?: (weekId: string, driveUrl: string) => void;
  onDeleteWeek: (weekId: string) => void;
  onDeleteUpdateFromWeek: (weekId: string, updateId: string) => void;
  selectedWeekId: string | null;
  onSelectWeek: (weekId: string | null) => void;
  onClearSelectedWeek: () => void;
}

export const WeekChangelog: React.FC<WeekChangelogProps> = ({
  weeks,
  onAddUpdateToWeek,
  onEditWeek,
  onRenameWeekTitle,
  onUpdateWeekDriveUrl,
  onDeleteWeek,
  onDeleteUpdateFromWeek,
  selectedWeekId,
  onSelectWeek,
  onClearSelectedWeek,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortDescending, setSortDescending] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Quick inline title editing state
  const [editingTitleWeekId, setEditingTitleWeekId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>('');

  // Quick inline Google Drive link editing state
  const [editingDriveWeekId, setEditingDriveWeekId] = useState<string | null>(null);
  const [editingDriveValue, setEditingDriveValue] = useState<string>('');

  // Sort weeks in ascending order (1..30)
  const ascendingWeeks = useMemo(() => {
    return [...weeks].sort((a, b) => a.weekNumber - b.weekNumber);
  }, [weeks]);

  // Find currently selected week object and its neighbors
  const selectedWeekIndex = useMemo(() => {
    if (!selectedWeekId) return -1;
    return ascendingWeeks.findIndex((w) => w.id === selectedWeekId);
  }, [ascendingWeeks, selectedWeekId]);

  const activeWeek = selectedWeekIndex >= 0 ? ascendingWeeks[selectedWeekIndex] : null;
  const prevWeek = selectedWeekIndex > 0 ? ascendingWeeks[selectedWeekIndex - 1] : null;
  const nextWeek =
    selectedWeekIndex >= 0 && selectedWeekIndex < ascendingWeeks.length - 1
      ? ascendingWeeks[selectedWeekIndex + 1]
      : null;

  // Toggle week accordion
  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekId]: !prev[weekId],
    }));
  };

  // Copy code handler
  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Inline title rename handlers
  const startEditingTitle = (week: WeekData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingTitleWeekId(week.id);
    setEditingTitleValue(week.title);
  };

  const saveEditingTitle = (weekId: string) => {
    if (onRenameWeekTitle && editingTitleValue.trim()) {
      onRenameWeekTitle(weekId, editingTitleValue.trim());
    }
    setEditingTitleWeekId(null);
  };

  const handleTitleKeyDown = (weekId: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditingTitle(weekId);
    } else if (e.key === 'Escape') {
      setEditingTitleWeekId(null);
    }
  };

  // Inline Google Drive handlers
  const startEditingDrive = (week: WeekData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingDriveWeekId(week.id);
    setEditingDriveValue(week.driveUrl || '');
  };

  const saveEditingDrive = (weekId: string) => {
    if (onUpdateWeekDriveUrl) {
      onUpdateWeekDriveUrl(weekId, editingDriveValue.trim());
    }
    setEditingDriveWeekId(null);
  };

  const handleDriveKeyDown = (weekId: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditingDrive(weekId);
    } else if (e.key === 'Escape') {
      setEditingDriveWeekId(null);
    }
  };

  // Filter & sort weeks
  const filteredWeeks = useMemo(() => {
    let result = [...weeks];

    if (selectedWeekId) {
      result = result.filter((w) => w.id === selectedWeekId);
    }

    result.sort((a, b) =>
      sortDescending ? b.weekNumber - a.weekNumber : a.weekNumber - b.weekNumber
    );

    if (!searchQuery.trim() && selectedCategory === 'all') {
      return result;
    }

    const query = searchQuery.toLowerCase().trim();

    return result
      .map((week) => {
        const matchingUpdates = week.updates.filter((upd) => {
          const matchCategory =
            selectedCategory === 'all' || upd.category === selectedCategory;
          const matchSearch =
            !query ||
            upd.title.toLowerCase().includes(query) ||
            upd.description.toLowerCase().includes(query) ||
            upd.tags.some((t) => t.toLowerCase().includes(query)) ||
            (upd.codeSnippet && upd.codeSnippet.code.toLowerCase().includes(query));

          return matchCategory && matchSearch;
        });

        const weekMatchesSearch =
          week.title.toLowerCase().includes(query) ||
          week.summary.toLowerCase().includes(query) ||
          String(week.weekNumber).includes(query);

        if (matchingUpdates.length > 0 || (weekMatchesSearch && selectedCategory === 'all')) {
          return {
            ...week,
            updates: matchingUpdates.length > 0 ? matchingUpdates : week.updates,
          };
        }
        return null;
      })
      .filter((w): w is WeekData => w !== null);
  }, [weeks, selectedWeekId, sortDescending, searchQuery, selectedCategory]);

  const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    all: { label: 'Tüm Yenilikler', icon: <Sparkles className="w-3.5 h-3.5" /> },
    ui: { label: 'Arayüz (UI)', icon: <Palette className="w-3.5 h-3.5 text-purple-600" /> },
    feature: { label: 'Özellik', icon: <Sparkles className="w-3.5 h-3.5 text-blue-600" /> },
    performance: { label: 'Performans', icon: <Zap className="w-3.5 h-3.5 text-amber-600" /> },
    bugfix: { label: 'Hata Çözümü', icon: <Bug className="w-3.5 h-3.5 text-rose-600" /> },
    assignment: { label: 'Ödev & Teslim', icon: <Award className="w-3.5 h-3.5 text-emerald-600" /> },
    docs: { label: 'Döküman', icon: <FileText className="w-3.5 h-3.5 text-sky-600" /> },
  };

  const totalUpdatesCount = weeks.reduce((acc, w) => acc + w.updates.length, 0);

  const handleSelectAndScroll = (weekId: string | null) => {
    onSelectWeek(weekId);
    const element = document.getElementById('haftalar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="haftalar" className="py-10 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>30 Haftalık Ders İlerleme & Google Drive Portalı</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Haftalık Yenilikler & Google Drive Teslimleri (30 Hafta)
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Her haftaya ait kendi başlığınızı belirleyebilir, ödev ve proje klasörlerinizin <strong>Google Drive</strong> linklerini ekleyebilirsiniz. Öğretmeniniz veya siz tek tıkla doğrudan Google Drive'a gidebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddUpdateToWeek(selectedWeekId || weeks[0]?.id || '')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Yenilik Ekle</span>
            </button>
          </div>
        </div>

        {/* --- 30 WEEKS NAVIGATION CONTROL CENTER --- */}
        {weeks.length > 0 && (
          <div className="mb-5 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            {/* Top row with week count and dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  Hafta Seçimi & İnceleme:
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {selectedWeekId && activeWeek
                    ? `${activeWeek.weekNumber}. Hafta Gösteriliyor`
                    : 'Tüm 30 Hafta'}
                </span>
              </div>

              {/* Direct Jump Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Hızlı Git:</span>
                <select
                  value={selectedWeekId || ''}
                  onChange={(e) => handleSelectAndScroll(e.target.value ? e.target.value : null)}
                  aria-label="Hafta seç"
                  className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600 cursor-pointer max-w-[240px]"
                >
                  <option value="">Tüm Haftalar (30 Hafta)</option>
                  {ascendingWeeks.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.weekNumber}. Hafta {w.title !== `${w.weekNumber}. Hafta` ? `- ${w.title}` : ''} {w.driveUrl ? '[Drive Var]' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 1..30 Numbered Buttons Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              <button
                type="button"
                onClick={() => handleSelectAndScroll(null)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  selectedWeekId === null
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tümü</span>
              </button>

              {ascendingWeeks.map((w) => {
                const isSelected = selectedWeekId === w.id;
                const hasDrive = Boolean(w.driveUrl);
                const hasUpdates = w.updates.length > 0;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleSelectAndScroll(w.id)}
                    title={`${w.weekNumber}. Hafta: ${w.title} ${hasDrive ? '· (Google Drive Linki Var)' : ''}`}
                    className={`relative min-w-[34px] h-[34px] px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/30'
                        : hasDrive
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                        : hasUpdates
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <span>{w.weekNumber}</span>
                    {hasDrive && !isSelected && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- STEPPER BAR (Önceki / Sonraki Hafta Hızlı Geçiş & Google Drive Hızlı Buton) --- */}
        {selectedWeekId && activeWeek && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {prevWeek ? (
                <button
                  type="button"
                  onClick={() => handleSelectAndScroll(prevWeek.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-white hover:bg-blue-600 hover:text-white border border-blue-300 rounded-lg shadow-xs transition-colors cursor-pointer"
                  title={`${prevWeek.weekNumber}. Haftaya Geri Dön`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← {prevWeek.weekNumber}. Hafta'ya Geri Dön</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  İlk Hafta (1. Hafta)
                </span>
              )}
            </div>

            {/* Middle Section: Week Title & Quick Drive Button */}
            <div className="text-center flex flex-col items-center gap-1.5">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {activeWeek.weekNumber}. Hafta: {activeWeek.title}
                </span>
                <button
                  type="button"
                  onClick={() => startEditingTitle(activeWeek)}
                  title="Bu haftanın başlığını değiştir"
                  className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>

              {/* Direct Drive Action in Stepper */}
              {activeWeek.driveUrl ? (
                <a
                  href={activeWeek.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 rounded-md shadow-2xs transition-all cursor-pointer"
                  title="Doğrudan Google Drive'a git"
                >
                  <GoogleDriveIcon className="w-3.5 h-3.5" />
                  <span>Google Drive'da Aç</span>
                  <ExternalLink className="w-3 h-3 text-emerald-700" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    startEditingDrive(activeWeek);
                    const el = document.getElementById(`week-${activeWeek.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                >
                  <GoogleDriveIcon className="w-3 h-3" />
                  <span>+ Bu Haftaya Google Drive Linki Ekle</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {nextWeek ? (
                <button
                  type="button"
                  onClick={() => handleSelectAndScroll(nextWeek.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-700 bg-white hover:bg-blue-600 hover:text-white border border-blue-300 rounded-lg shadow-xs transition-colors cursor-pointer"
                  title={`${nextWeek.weekNumber}. Haftaya İlerle`}
                >
                  <span>{nextWeek.weekNumber}. Hafta'ya İlerle →</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSelectAndScroll(null)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Tüm Haftaları Göster</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        {totalUpdatesCount > 0 && (
          <div className="mb-6 space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Yeniliklerde, başlıklarda veya etiketlerde ara..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Sort controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSortDescending(!sortDescending)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {sortDescending ? '30. Haftadan Başla' : '1. Haftadan Başla'}
                </button>

                {selectedWeekId && (
                  <button
                    onClick={onClearSelectedWeek}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Tüm Haftalara Dön
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin pt-1 border-t border-slate-100">
              {Object.entries(categoryLabels).map(([catKey, { label, icon }]) => {
                const isActive = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Weeks List */}
        {filteredWeeks.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-slate-300 rounded-2xl bg-white">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">Aramanıza Uygun Hafta veya Yenilik Bulunamadı</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Arama kriterinizi temizleyerek 30 haftalık listeye dönebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                onClearSelectedWeek();
              }}
              className="mt-3 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredWeeks.map((week) => {
              const isExpanded = expandedWeeks[week.id] !== false; // expanded by default
              const isEditingThisTitle = editingTitleWeekId === week.id;
              const isEditingThisDrive = editingDriveWeekId === week.id;

              // Find index of this week in sorted list to provide next/previous links inside card
              const currentIdx = ascendingWeeks.findIndex((w) => w.id === week.id);
              const cardPrevWeek = currentIdx > 0 ? ascendingWeeks[currentIdx - 1] : null;
              const cardNextWeek =
                currentIdx < ascendingWeeks.length - 1 ? ascendingWeeks[currentIdx + 1] : null;

              return (
                <article
                  key={week.id}
                  id={`week-${week.id}`}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
                >
                  {/* Week Header */}
                  <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white border border-blue-200 shadow-xs shrink-0">
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Hafta</span>
                        <span className="text-lg font-black text-blue-600 font-mono">
                          {String(week.weekNumber).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <span>{week.weekNumber}. Hafta Geliştirmesi</span>
                          {week.driveUrl && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.2 rounded-full border border-emerald-200">
                              <GoogleDriveIcon className="w-2.5 h-2.5" />
                              <span>Google Drive Ekli</span>
                            </span>
                          )}
                        </div>

                        {/* Title Display or Inline Editing */}
                        {isEditingThisTitle ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={editingTitleValue}
                              onChange={(e) => setEditingTitleValue(e.target.value)}
                              onKeyDown={(e) => handleTitleKeyDown(week.id, e)}
                              placeholder={`Örn: ${week.weekNumber}. Hafta Başlığı...`}
                              autoFocus
                              className="px-2.5 py-1 text-sm font-bold text-slate-900 bg-white border border-blue-500 rounded-lg focus:outline-none ring-2 ring-blue-500/20 w-full max-w-md"
                            />
                            <button
                              type="button"
                              onClick={() => saveEditingTitle(week.id)}
                              className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shrink-0 cursor-pointer"
                            >
                              Kaydet
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTitleWeekId(null)}
                              className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 shrink-0 cursor-pointer"
                            >
                              İptal
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group">
                            <h3
                              onClick={() => startEditingTitle(week)}
                              className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                              title="Başlığı değiştirmek için tıklayın"
                            >
                              {week.title}
                            </h3>
                            <button
                              type="button"
                              onClick={(e) => startEditingTitle(week, e)}
                              title="Başlığı Düzenle"
                              className="opacity-60 hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 rounded transition-all cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Week actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Direct Google Drive button in header - always accessible for quick access or editing */}
                      {week.driveUrl ? (
                        <a
                          href={week.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Google Drive Klasörünü Aç (Yeni Sekme)"
                          className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <GoogleDriveIcon className="w-4 h-4" />
                          <span className="hidden md:inline">Google Drive</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditingDrive(week)}
                          title="Bu haftaya Google Drive linki ekle"
                          className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <GoogleDriveIcon className="w-4 h-4" />
                          <span className="hidden md:inline">Google Drive</span>
                        </button>
                      )}

                      <button
                        onClick={() => onAddUpdateToWeek(week.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Yenilik Ekle</span>
                      </button>

                      <button
                        onClick={() => onEditWeek(week)}
                        title="Hafta detaylarını düzenle"
                        className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleWeek(week.id)}
                        className="p-1.5 text-slate-600 bg-slate-200/80 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
                        title={isExpanded ? 'Gizle' : 'Genişlet'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Week Body */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-5">
                      {week.summary && (
                        <p className="text-xs sm:text-sm text-slate-600 pb-3 border-b border-slate-100">
                          {week.summary}
                        </p>
                      )}

                      {/* --- PROMINENT GOOGLE DRIVE SECTION FOR THIS WEEK --- */}
                      <div className="rounded-xl overflow-hidden border border-emerald-200/90 bg-emerald-50/40">
                        {isEditingThisDrive ? (
                          /* Inline Google Drive Editor */
                          <div className="p-4 bg-emerald-50/90 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <GoogleDriveIcon className="w-4 h-4" />
                                <span>{week.weekNumber}. Hafta Google Drive Linkini Kaydet</span>
                              </span>
                              <span className="text-[11px] text-slate-500">
                                Linke tıklayan doğrudan Google Drive'a gider
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <input
                                type="url"
                                value={editingDriveValue}
                                onChange={(e) => setEditingDriveValue(e.target.value)}
                                onKeyDown={(e) => handleDriveKeyDown(week.id, e)}
                                placeholder="https://drive.google.com/drive/folders/... veya dosya linki yapıştırın"
                                autoFocus
                                className="flex-1 px-3 py-2 text-xs bg-white border border-emerald-400 rounded-lg text-slate-900 focus:outline-none ring-2 ring-emerald-500/20 shadow-2xs font-mono"
                              />
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => saveEditingDrive(week.id)}
                                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                                >
                                  Kaydet
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingDriveWeekId(null)}
                                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg transition-colors cursor-pointer"
                                >
                                  Vazgeç
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : week.driveUrl ? (
                          /* Active Google Drive Banner (Clickable -> Redirects to Drive) */
                          <div className="p-3.5 sm:p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-xs shrink-0">
                                <GoogleDriveIcon className="w-6 h-6" />
                              </div>
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900">
                                    {week.weekNumber}. Hafta Google Drive Teslim & Proje Dosyaları
                                  </span>
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-200 shrink-0">
                                    Google Drive
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate max-w-lg mt-0.5 font-mono">
                                  {week.driveUrl}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                              {/* Open Google Drive Link */}
                              <a
                                href={week.driveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer active:scale-98"
                              >
                                <GoogleDriveIcon className="w-3.5 h-3.5" />
                                <span>Google Drive'a Git</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={() => startEditingDrive(week)}
                                title="Google Drive linkini değiştir"
                                className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateWeekDriveUrl && onUpdateWeekDriveUrl(week.id, '')
                                }
                                title="Google Drive linkini kaldır"
                                className="p-2 text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Empty Google Drive Prompt */
                          <div className="p-3 sm:p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                            <div className="flex items-center gap-2.5 text-slate-600">
                              <GoogleDriveIcon className="w-5 h-5 opacity-80 shrink-0" />
                              <span className="font-medium text-slate-700">
                                Bu haftaya ait Google Drive klasör linki eklenmemiş.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => startEditingDrive(week)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Google Drive Linki Ekle</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Updates list */}
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>Bu Haftada Eklenen Yenilikler ({week.updates.length})</span>
                          </span>
                        </div>

                        {week.updates.length === 0 ? (
                          <div className="py-4 px-5 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs text-slate-500 flex items-center justify-between gap-3">
                            <span className="font-normal italic">
                              Bu haftaya henüz bir geliştirme notu girilmedi. Sağ üstteki <strong>"Yenilik Ekle"</strong> butonundan ekleyebilirsiniz.
                            </span>
                            <button
                              onClick={() => onAddUpdateToWeek(week.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Yenilik Ekle</span>
                            </button>
                          </div>
                        ) : (
                          week.updates.map((update) => (
                            <div
                              key={update.id}
                              className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/90 hover:border-blue-300 hover:bg-white transition-all shadow-2xs"
                            >
                              {/* Metadata row */}
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-blue-700 flex items-center gap-1">
                                    {categoryLabels[update.category]?.icon}
                                    {categoryLabels[update.category]?.label || update.category}
                                  </span>

                                  {/* Date and Time badge */}
                                  {update.createdAt && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      <span>{update.createdAt}</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Tags list */}
                                  {update.tags.length > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                      {update.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Delete update button */}
                                  <button
                                    onClick={() => onDeleteUpdateFromWeek(week.id, update.id)}
                                    title="Bu yeniliği sil"
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <h4 className="text-base font-bold text-slate-900 mb-1">
                                {update.title}
                              </h4>

                              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                {update.description}
                              </p>

                              {/* Impact note */}
                              {update.impact && (
                                <div className="mt-2.5 text-xs text-emerald-800 font-medium flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                                  <span>{update.impact}</span>
                                </div>
                              )}

                              {/* Clickable Attached File / Link */}
                              {update.attachment && (
                                <div className="mt-3 p-3 rounded-lg bg-white border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 overflow-hidden">
                                    {update.attachment.fileType === 'drive' ? (
                                      <GoogleDriveIcon className="w-4 h-4 shrink-0" />
                                    ) : (
                                      <Paperclip className="w-4 h-4 text-blue-600 shrink-0" />
                                    )}
                                    <div className="overflow-hidden">
                                      <div className="flex items-center gap-2">
                                        <span className="truncate">{update.attachment.title}</span>
                                        {update.attachment.fileType === 'drive' && (
                                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                                            Google Drive
                                          </span>
                                        )}
                                      </div>
                                      {update.createdAt && (
                                        <div className="text-[11px] font-normal text-slate-400 flex items-center gap-1 mt-0.5">
                                          <Calendar className="w-3 h-3" />
                                          <span>Eklenme Tarihi: {update.createdAt}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <a
                                    href={update.attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors shrink-0 self-start sm:self-auto cursor-pointer ${
                                      update.attachment.fileType === 'drive'
                                        ? 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs'
                                        : 'text-white bg-blue-600 hover:bg-blue-700'
                                    }`}
                                  >
                                    <span>
                                      {update.attachment.fileType === 'drive'
                                        ? "Google Drive'ı Aç"
                                        : 'Bağlantıyı Aç'}
                                    </span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}

                              {/* Code Snippet Card */}
                              {update.codeSnippet && (
                                <div className="mt-3.5 rounded-lg overflow-hidden border border-slate-800 bg-[#0f172a] shadow-xs">
                                  <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                                    <div className="flex items-center gap-2">
                                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                                      <span className="text-slate-200 font-medium">{update.codeSnippet.filename}</span>
                                      <span className="text-[11px] text-slate-400 uppercase">({update.codeSnippet.language})</span>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleCopyCode(update.codeSnippet!.code, update.id)
                                      }
                                      className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
                                    >
                                      {copiedCodeId === update.id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span className="text-emerald-400">Kopyalandı</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span>Kodu Kopyala</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="p-3.5 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed scrollbar-thin">
                                    <code>{update.codeSnippet.code}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Challenges & Solutions and Teacher Notes Split */}
                      {(week.challengesAndSolutions || week.teacherNote) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                          {week.challengesAndSolutions && (
                            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                              <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                                <Flame className="w-3.5 h-3.5 text-amber-600" />
                                <span>Karşılaşılan Zorluk & Çözüm</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {week.challengesAndSolutions}
                              </p>
                            </div>
                          )}

                          {week.teacherNote && (
                            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                              <div className="text-xs font-bold text-blue-800 flex items-center gap-1.5 mb-1">
                                <Award className="w-3.5 h-3.5 text-blue-600" />
                                <span>Ders Öğretim Üyesi Değerlendirmesi</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed italic">
                                "{week.teacherNote}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* --- CARD FOOTER NAVIGATION (Hafta İçi Hızlı Geçiş Butonları) --- */}
                      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          {cardPrevWeek ? (
                            <button
                              type="button"
                              onClick={() => handleSelectAndScroll(cardPrevWeek.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer border border-blue-200"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>← {cardPrevWeek.weekNumber}. Hafta'ya Geri Dön</span>
                            </button>
                          ) : (
                            <span className="text-slate-400">1. Hafta (Başlangıç)</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {selectedWeekId && (
                            <button
                              type="button"
                              onClick={() => handleSelectAndScroll(null)}
                              className="px-2.5 py-1 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                              Tüm 30 Haftayı Göster
                            </button>
                          )}

                          {cardNextWeek && (
                            <button
                              type="button"
                              onClick={() => handleSelectAndScroll(cardNextWeek.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer border border-blue-200"
                            >
                              <span>{cardNextWeek.weekNumber}. Hafta'ya İlerle →</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
