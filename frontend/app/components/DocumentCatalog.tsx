'use client';

import { useState } from 'react';
import { DOCUMENTS } from '../lib/documents';

interface Props {
  onSelect: (filename: string) => void;
}

export default function DocumentCatalog({ onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm">
        <h1 className="text-xl font-bold" style={{ color: '#032147' }}>Prelegal</h1>
        <p className="text-sm text-gray-500 mt-0.5">AI-powered legal document drafting</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
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
              <div
                className="w-8 h-1 rounded mb-3"
                style={{ backgroundColor: '#ecad0a' }}
              />
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
