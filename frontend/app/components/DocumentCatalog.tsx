'use client';

import { useEffect, useState } from 'react';
import { API_URL, authHeaders } from '../lib/auth';
import { DOCUMENTS } from '../lib/documents';

interface SavedDoc {
  id: number;
  doc_type: string;
  title: string;
  created_at: string;
}

interface Props {
  onSelect: (filename: string, initialFields?: Record<string, unknown>) => void;
  userEmail: string;
  onLogout: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function DocumentCatalog({ onSelect, userEmail, onLogout }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [savedDocs, setSavedDocs] = useState<SavedDoc[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/documents`, { headers: authHeaders() })
      .then((r) => r.ok ? r.json() : [])
      .then(setSavedDocs)
      .catch(() => {});
  }, []);

  async function handleSelectSaved(doc: SavedDoc) {
    try {
      const res = await fetch(`${API_URL}/api/documents/${doc.id}`, { headers: authHeaders() });
      if (!res.ok) return;
      const full = await res.json();
      onSelect(full.doc_type, full.fields);
    } catch {}
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`${API_URL}/api/documents/${id}`, { method: 'DELETE', headers: authHeaders() });
    setSavedDocs((prev) => prev.filter((d) => d.id !== id));
  }

  const initials = userEmail ? userEmail[0].toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#032147' }}>Prelegal</h1>
            <p className="text-sm text-gray-500">AI-powered legal document drafting</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: '#753991' }}
            >
              {initials}
            </div>
            <span className="text-sm text-gray-700 hidden sm:block">{userEmail}</span>
            <button
              onClick={onLogout}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 rounded-md px-3 py-1.5"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {savedDocs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-base font-semibold mb-4" style={{ color: '#032147' }}>My Documents</h2>
            <div className="space-y-2">
              {savedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="w-full bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                  onClick={() => handleSelectSaved(doc)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelectSaved(doc)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: '#209dd7' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#032147' }}>{doc.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Saved {formatDate(doc.created_at)}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(doc.id, e); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all ml-4 p-1"
                    aria-label="Delete document"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#032147' }}>
            What document do you need today?
          </h2>
          <p className="text-gray-500">
            Choose a document type and our AI will guide you through filling it out.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCUMENTS.map((doc) => (
            <button
              key={doc.filename}
              onClick={() => onSelect(doc.filename)}
              onMouseEnter={() => setHovered(doc.filename)}
              onMouseLeave={() => setHovered(null)}
              className="text-left bg-white border rounded-lg p-5 hover:shadow-md transition-all"
              style={{ borderColor: hovered === doc.filename ? '#209dd7' : '#e5e7eb' }}
            >
              <div className="w-8 h-1 rounded mb-3" style={{ backgroundColor: '#ecad0a' }} />
              <h3
                className="text-sm font-semibold mb-1.5 transition-colors"
                style={{ color: hovered === doc.filename ? '#209dd7' : '#032147' }}
              >
                {doc.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{doc.description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
