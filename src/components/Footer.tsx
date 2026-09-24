import React from 'react';
import { StudentProfile } from '../types';
import { GraduationCap, Github, ArrowUp } from 'lucide-react';

interface FooterProps {
  profile: StudentProfile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm tracking-tight mb-1">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>{profile.courseCode} · {profile.courseName}</span>
            </div>
            <p className="text-slate-600 max-w-md">
              {profile.projectTitle} — {profile.studentName} ({profile.studentNumber}), {profile.department}.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Projesi</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              title="Sayfa Başına Dön"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Başa Dön</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 {profile.studentName}. {profile.term} Geliştirme Portalı.
          </div>
          <div className="flex items-center gap-4">
            <span>Öğretim Üyesi: {profile.instructor}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.university}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
