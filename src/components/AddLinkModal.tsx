import React, { useState } from 'react';
import { ProjectLinkItem, FileType } from '../types';
import { X, Link2, Upload, FileText, AlertCircle, Clock, Calendar } from 'lucide-react';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLink: (item: ProjectLinkItem) => void;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen,
  onClose,
  onSaveLink,
}) => {
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

  const [sourceType, setSourceType] = useState<'url' | 'upload'>('url');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [fileType, setFileType] = useState<FileType>('drive');
  const [description, setDescription] = useState('');
  const [linkDateTime, setLinkDateTime] = useState<string>(getNowFormatted());
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size formatting
    const sizeInKb = file.size / 1024;
    const formattedSize =
      sizeInKb > 1024
        ? `${(sizeInKb / 1024).toFixed(1)} MB`
        : `${Math.round(sizeInKb)} KB`;

    setUploadedFileSize(formattedSize);
    setUploadedFileName(file.name);

    if (!title) {
      setTitle(file.name);
    }

    // Guess file type
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.pdf')) {
      setFileType('pdf');
    } else if (lowerName.endsWith('.zip') || lowerName.endsWith('.rar')) {
      setFileType('archive');
    } else if (
      lowerName.endsWith('.png') ||
      lowerName.endsWith('.jpg') ||
      lowerName.endsWith('.jpeg') ||
      lowerName.endsWith('.svg')
    ) {
      setFileType('image');
    } else if (
      lowerName.endsWith('.ts') ||
      lowerName.endsWith('.tsx') ||
      lowerName.endsWith('.js') ||
      lowerName.endsWith('.json') ||
      lowerName.endsWith('.html') ||
      lowerName.endsWith('.css')
    ) {
      setFileType('doc');
    } else {
      setFileType('link');
    }

    // Read as Data URL so clicking will open or download it
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Lütfen bir başlık veya dosya adı girin.');
      return;
    }

    if (!url.trim()) {
      setFormError(
        sourceType === 'url'
          ? 'Lütfen geçerli bir web veya bulut bağlantısı (URL) girin.'
          : 'Lütfen cihazınızdan bir dosya seçin.'
      );
      return;
    }

    // Human-friendly date & time format
    let formattedAddedAt = '';
    try {
      const d = linkDateTime ? new Date(linkDateTime) : new Date();
      formattedAddedAt = d.toLocaleString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      formattedAddedAt = new Date().toLocaleString('tr-TR');
    }

    const newItem: ProjectLinkItem = {
      id: `link-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
      fileType,
      description: description.trim() || undefined,
      fileSize: uploadedFileSize || undefined,
      addedAt: formattedAddedAt,
      isUploadedFile: sourceType === 'upload',
    };

    onSaveLink(newItem);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setFileType('drive');
    setDescription('');
    setUploadedFileSize('');
    setUploadedFileName('');
    setFormError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Siteye Dosya veya Link Ekle</h3>
              <p className="text-xs text-slate-500">
                Eklenen linkler ve dosyalar sitede tıklanıp doğrudan yeni sekmede açılabilir
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

        {/* Tab Selection */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-200 bg-white flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSourceType('url');
              setUrl('');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              sourceType === 'url'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Web / Bulut Linki (Drive, GitHub, PDF URL)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSourceType('upload');
              setUrl('');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              sourceType === 'upload'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Cihazdan Dosya Seç</span>
          </button>
        </div>

        {/* Error message */}
        {formError && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {sourceType === 'url' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bağlantı Linki (URL) *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://drive.google.com/... veya https://github.com/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Google Drive, Dropbox, GitHub repo, Figma, YouTube veya herhangi bir web linki yapıştırabilirsiniz.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cihazınızdan Dosya Seçin *
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-7 h-7 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-800">
                    {uploadedFileName ? uploadedFileName : 'Dosya seçmek için tıklayın'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    PDF, Resim, Metin, ZIP veya Kod dosyaları ({uploadedFileSize || 'Seçilmedi'})
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dosya / Link Başlığı *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: 1. Dönem Ödev Raporu (PDF)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tür / Kategori
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as FileType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="drive">Google Drive Klasörü / Dosyası</option>
                <option value="pdf">PDF Dokümanı</option>
                <option value="github">GitHub Repo / Kaynak Kod</option>
                <option value="figma">Figma Tasarım Dosyası</option>
                <option value="archive">ZIP / Arşiv Dosyası</option>
                <option value="doc">Döküman / Metin Dosyası</option>
                <option value="image">Görsel / Ekran Görüntüsü</option>
                <option value="link">Canlı Web Sayfası / Link</option>
              </select>
            </div>
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
                onClick={() => setLinkDateTime(getNowFormatted())}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                <span>Şu Anki Saati Al</span>
              </button>
            </div>
            <input
              type="datetime-local"
              value={linkDateTime}
              onChange={(e) => setLinkDateTime(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kısa Açıklama veya Not (Opsiyonel)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Örn: Hafta teslimi için hocaya sunulan PDF ve sunum dosyası"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{sourceType === 'upload' ? 'Dosyayı Ekle' : 'Linki Ekle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
