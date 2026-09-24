import React from 'react';
import { StudentProfile, WeekData, ProjectLinkItem } from '../types';
import { Plus, Link2, Sparkles, Edit2, Github, Globe, BookOpen, Calendar, ArrowRight } from 'lucide-react';

interface HeroProps {
  profile: StudentProfile;
  weeks: WeekData[];
  links: ProjectLinkItem[];
  selectedWeekId: string | null;
  onSelectWeek: (weekId: string | null) => void;
  onOpenProfileModal: () => void;
  onOpenAddUpdateModal: () => void;
  onOpenAddLinkModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  profile,
  weeks,
  links,
  selectedWeekId,
  onSelectWeek,
  onOpenProfileModal,
  onOpenAddUpdateModal,
  onOpenAddLinkModal,
}) => {
  const totalUpdates = weeks.reduce((acc, w) => acc + w.updates.length, 0);
  const activeWeeksCount = weeks.filter((w) => w.updates.length > 0).length;
  const driveWeeksCount = weeks.filter((w) => Boolean(w.driveUrl)).length;
  const sortedWeeks = [...weeks].sort((a, b) => a.weekNumber - b.weekNumber);

  const handleSelectWeekAndScroll = (weekId: string | null) => {
    onSelectWeek(weekId);
    const elem = document.getElementById('haftalar');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-6 pb-8 border-b border-slate-200/80 bg-white overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[250px] bg-blue-50/60 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Teacher Quick-Notice & 30-Week Selector Banner */}
        <div className="mb-5 p-3 sm:p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2 text-blue-950 font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Öğretmen İnceleme Portalı:</span>
            <span className="font-normal text-blue-800">
              {profile.studentName} ({profile.studentNumber}) · {profile.courseCode}
            </span>
          </div>

          {/* Quick Jump Dropdown and Number Pills for 30 Weeks */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-blue-200 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">Hafta:</span>
              <select
                value={selectedWeekId || ''}
                onChange={(e) => handleSelectWeekAndScroll(e.target.value ? e.target.value : null)}
                aria-label="Hafta seçimi"
                className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer pr-1"
              >
                <option value="">Tüm 30 Haftayı Göster</option>
                {sortedWeeks.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.weekNumber}. Hafta {w.title !== `${w.weekNumber}. Hafta` ? `— ${w.title}` : ''} {w.driveUrl ? '· [Drive Ekli]' : ''} {w.updates.length > 0 ? `(${w.updates.length} yenilik)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick scrollable number bar */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full sm:max-w-xs md:max-w-sm pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => handleSelectWeekAndScroll(null)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedWeekId === null
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Tümü
              </button>
              {sortedWeeks.slice(0, 10).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => handleSelectWeekAndScroll(w.id)}
                  title={`${w.weekNumber}. Hafta: ${w.title}`}
                  className={`w-6 h-6 rounded text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    selectedWeekId === w.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : w.updates.length > 0
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {w.weekNumber}
                </button>
              ))}
              {sortedWeeks.length > 10 && (
                <button
                  type="button"
                  onClick={() => {
                    const elem = document.getElementById('haftalar');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-1.5 py-0.5 text-[10px] text-blue-600 font-bold bg-white border border-blue-200 rounded shrink-0 hover:bg-blue-50"
                  title="Tüm 30 haftayı görmek için kaydırın"
                >
                  +20...
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Student & Course Context */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-2 tracking-wide">
              <span className="text-blue-600 font-bold">{profile.courseCode}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.courseName}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.term}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
              {profile.studentName} — Proje Geliştirme Portalı
            </h1>

            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              30 haftalık ders süresi boyunca geliştirilen proje yenilikleri, haftalık kod güncellemeleri ve hocaya teslim edilen dokümanlar burada sunulmaktadır.
            </p>

            {/* Student & Instructor Profile Card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <img
                  src="/src/assets/images/student_avatar_profile_1790236443420.jpg"
                  alt={profile.studentName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-slate-300 shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{profile.studentName}</span>
                    <span className="text-xs text-slate-500 font-mono">({profile.studentNumber})</span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                    <span>Öğretim Üyesi: {profile.instructor}</span>
                    <span aria-hidden="true">·</span>
                    <span>{profile.department}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenProfileModal}
                className="self-start sm:self-center px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit2 className="w-3 h-3 text-slate-500" />
                <span>Bilgileri Düzenle</span>
              </button>
            </div>

            {/* Action buttons directly under profile */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAddUpdateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Yenilik Ekle</span>
              </button>

              <button
                onClick={onOpenAddLinkModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
              >
                <Link2 className="w-4 h-4 text-blue-600" />
                <span>Dosya / Link Ekle</span>
              </button>

              {/* Dynamic info pill */}
              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-100 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  30 Hafta Planı {totalUpdates > 0 ? `· ${totalUpdates} yenilik` : '· Yenilikler eklenebilir'}
                </span>
                {driveWeeksCount > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-semibold">{driveWeeksCount} Hafta Google Drive Ekli</span>
                  </>
                )}
                {links.length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{links.length} Dosya & Link</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Project Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src="/src/assets/images/course_project_hero_1790236416409.jpg"
                  alt="Ders Projesi Çalışma Alanı"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-blue-600 text-white inline-block mb-1">
                    Aktif Ders Projesi
                  </span>
                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {profile.projectTitle}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-2 mt-1">
                    {profile.projectDescription}
                  </p>
                </div>
              </div>

              {/* Project Quick Links */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-slate-700">Proje Bağlantıları:</span>
                <div className="flex items-center gap-2">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.liveDemoUrl && (
                    <a
                      href={profile.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Canlı Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
