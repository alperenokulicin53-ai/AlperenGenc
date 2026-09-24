/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialProfile, initialWeeks, initialProjectLinks } from './data/initialWeeks';
import { StudentProfile, WeekData, UpdateItem, ProjectLinkItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectLinksSection } from './components/ProjectLinksSection';
import { WeekChangelog } from './components/WeekChangelog';
import { AddUpdateModal } from './components/AddUpdateModal';
import { AddLinkModal } from './components/AddLinkModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ExportModal } from './components/ExportModal';
import { Footer } from './components/Footer';
import { Check } from 'lucide-react';

const STORAGE_KEY_WEEKS = 'course_devlog_weeks_30w_v2';
const STORAGE_KEY_PROFILE = 'course_devlog_profile_v5';
const STORAGE_KEY_LINKS = 'course_devlog_links_v5';

export default function App() {
  // Load weeks from localStorage or clean 30 initialWeeks
  const [weeks, setWeeks] = useState<WeekData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEEKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 30) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load weeks', e);
    }
    return initialWeeks;
  });

  // Load student profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.studentName) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    }
    return initialProfile;
  });

  // Load project links and files
  const [links, setLinks] = useState<ProjectLinkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LINKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load links', e);
    }
    return initialProjectLinks;
  });

  // Modals state
  const [isAddUpdateModalOpen, setIsAddUpdateModalOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [preselectedWeekId, setPreselectedWeekId] = useState<string | null>(null);
  const [editingWeek, setEditingWeek] = useState<WeekData | null>(null);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync weeks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WEEKS, JSON.stringify(weeks));
    } catch (e) {
      console.error('Failed to save weeks', e);
    }
  }, [weeks]);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  // Sync links to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));
    } catch (e) {
      console.error('Failed to save links', e);
    }
  }, [links]);

  // Handlers for Weeks and Updates
  const handleSaveNewWeek = (newWeek: WeekData) => {
    setWeeks((prev) => [...prev, newWeek]);
    showToast(`Hafta ${newWeek.weekNumber} oluşturuldu.`);
  };

  const handleUpdateWeek = (updatedWeek: WeekData) => {
    setWeeks((prev) =>
      prev.map((w) => (w.id === updatedWeek.id ? updatedWeek : w))
    );
    showToast(`Hafta ${updatedWeek.weekNumber} güncellendi.`);
  };

  const handleRenameWeekTitle = (weekId: string, newTitle: string) => {
    setWeeks((prev) =>
      prev.map((w) =>
        w.id === weekId ? { ...w, title: newTitle.trim() || `${w.weekNumber}. Hafta` } : w
      )
    );
    showToast(`Hafta başlığı güncellendi.`);
  };

  const handleUpdateWeekDriveUrl = (weekId: string, driveUrl: string) => {
    setWeeks((prev) =>
      prev.map((w) =>
        w.id === weekId ? { ...w, driveUrl: driveUrl.trim() || undefined } : w
      )
    );
    showToast(
      driveUrl.trim()
        ? 'Google Drive bağlantısı eklendi.'
        : 'Google Drive bağlantısı kaldırıldı.'
    );
  };

  const handleSaveUpdateToWeek = (weekId: string, updateItem: UpdateItem) => {
    setWeeks((prev) =>
      prev.map((w) => {
        if (w.id === weekId) {
          return {
            ...w,
            updates: [updateItem, ...w.updates],
          };
        }
        return w;
      })
    );
    showToast(`"${updateItem.title}" yeniliği eklendi.`);
  };

  const handleDeleteWeek = (weekId: string) => {
    const target = weeks.find((w) => w.id === weekId);
    if (!target) return;

    if (
      window.confirm(
        `"Hafta ${target.weekNumber}: ${target.title}" kaydını silmek istediğinize emin misiniz?`
      )
    ) {
      setWeeks((prev) => prev.filter((w) => w.id !== weekId));
      if (selectedWeekId === weekId) {
        setSelectedWeekId(null);
      }
      showToast(`Hafta ${target.weekNumber} silindi.`);
    }
  };

  const handleDeleteUpdateFromWeek = (weekId: string, updateId: string) => {
    setWeeks((prev) =>
      prev.map((w) => {
        if (w.id === weekId) {
          return {
            ...w,
            updates: w.updates.filter((u) => u.id !== updateId),
          };
        }
        return w;
      })
    );
    showToast('Yenilik silindi.');
  };

  // Handlers for Links & Files
  const handleSaveLink = (newLink: ProjectLinkItem) => {
    setLinks((prev) => [newLink, ...prev]);
    showToast(`"${newLink.title}" bağlantısı eklendi.`);
  };

  const handleDeleteLink = (linkId: string) => {
    const target = links.find((l) => l.id === linkId);
    if (!target) return;

    if (window.confirm(`"${target.title}" bağlantısını silmek istediğinize emin misiniz?`)) {
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
      showToast('Bağlantı silindi.');
    }
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    showToast('Öğrenci ve ders bilgileri güncellendi.');
  };

  const handleResetToDefault = () => {
    setWeeks(initialWeeks);
    setProfile(initialProfile);
    setLinks(initialProjectLinks);
    try {
      localStorage.removeItem(STORAGE_KEY_WEEKS);
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_LINKS);
    } catch (e) {
      // ignore
    }
    showToast('Ders verileri sıfırlandı.');
  };

  const handleAddUpdateClick = (weekId?: string) => {
    setEditingWeek(null);
    setPreselectedWeekId(weekId || null);
    setIsAddUpdateModalOpen(true);
  };

  const handleEditWeekClick = (week: WeekData) => {
    setEditingWeek(week);
    setPreselectedWeekId(null);
    setIsAddUpdateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        onOpenAddModal={() => handleAddUpdateClick()}
        onOpenAddLinkModal={() => setIsAddLinkModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-grow">
        {/* Clean Student Profile & Hero Area */}
        <Hero
          profile={profile}
          weeks={weeks}
          links={links}
          selectedWeekId={selectedWeekId}
          onSelectWeek={setSelectedWeekId}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenAddUpdateModal={() => handleAddUpdateClick()}
          onOpenAddLinkModal={() => setIsAddLinkModalOpen(true)}
        />

        {/* Project Links & Attached Files Area (Click to open) */}
        <ProjectLinksSection
          links={links}
          onOpenAddLinkModal={() => setIsAddLinkModalOpen(true)}
          onDeleteLink={handleDeleteLink}
        />

        {/* Weekly Innovations Log (Renders as updates are added) */}
        <WeekChangelog
          weeks={weeks}
          onAddUpdateToWeek={(wId) => handleAddUpdateClick(wId)}
          onEditWeek={handleEditWeekClick}
          onRenameWeekTitle={handleRenameWeekTitle}
          onUpdateWeekDriveUrl={handleUpdateWeekDriveUrl}
          onDeleteWeek={handleDeleteWeek}
          onDeleteUpdateFromWeek={handleDeleteUpdateFromWeek}
          selectedWeekId={selectedWeekId}
          onSelectWeek={setSelectedWeekId}
          onClearSelectedWeek={() => setSelectedWeekId(null)}
        />
      </main>

      {/* Clean White Footer */}
      <Footer profile={profile} />

      {/* Modals */}
      <AddUpdateModal
        isOpen={isAddUpdateModalOpen}
        onClose={() => {
          setIsAddUpdateModalOpen(false);
          setEditingWeek(null);
          setPreselectedWeekId(null);
        }}
        weeks={weeks}
        preselectedWeekId={preselectedWeekId}
        editingWeek={editingWeek}
        onSaveNewWeek={handleSaveNewWeek}
        onUpdateWeek={handleUpdateWeek}
        onSaveUpdateToWeek={handleSaveUpdateToWeek}
      />

      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        onSaveLink={handleSaveLink}
      />

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        profile={profile}
        weeks={weeks}
        links={links}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
