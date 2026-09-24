import { StudentProfile, WeekData, ProjectLinkItem } from '../types';

export const initialProfile: StudentProfile = {
  studentName: 'Alperen Genc',
  studentNumber: '2024090153',
  courseCode: 'BİL-304',
  courseName: 'Web Tasarımı ve İnternet Programcılığı',
  term: '2024 - 2025 Bahar Dönemi',
  instructor: 'Öğretim Üyesi',
  department: 'Bilgisayar Programcılığı / Bilişim',
  university: 'Mühendislik & Doğa Bilimleri Fakültesi',
  projectTitle: 'Ders Web Projesi & Haftalık Geliştirme Portalı',
  projectDescription:
    'Ders kapsamında 30 hafta boyunca geliştirilen tüm arayüz, kod, veritabanı ve dokümantasyon güncellemelerinin haftalık olarak sunulduğu öğrenci portali.',
  githubUrl: 'https://github.com',
  liveDemoUrl: 'https://demo-linki.com',
};

export const initialProjectLinks: ProjectLinkItem[] = [
  {
    id: 'link-1',
    title: 'Google Drive Ödev ve Proje Klasörü',
    description: 'Ders sunumları, ekran görüntüleri ve proje kaynak dosyaları',
    url: 'https://drive.google.com',
    fileType: 'drive',
    addedAt: '2025-10-15',
  },
  {
    id: 'link-2',
    title: 'GitHub Kaynak Kod Deposu',
    description: 'Tüm haftalık kod commitleri, mimari ve bileşenler',
    url: 'https://github.com',
    fileType: 'github',
    addedAt: '2025-10-15',
  },
];

// Clean 30 weeks setup ready for Alperen to set custom titles and updates
export const initialWeeks: WeekData[] = Array.from({ length: 30 }, (_, index) => {
  const weekNum = index + 1;
  return {
    id: `week-${weekNum}`,
    weekNumber: weekNum,
    title: `${weekNum}. Hafta`,
    dateRange: `${weekNum}. Hafta`,
    status: weekNum === 1 ? 'completed' : 'planned',
    summary: '',
    hoursSpent: 0,
    gitCommit: '',
    driveUrl: '',
    challengesAndSolutions: '',
    teacherNote: '',
    updates: [],
  };
});
