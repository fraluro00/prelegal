'use client';

import { useState } from 'react';
import NDAForm from './components/NDAForm';
import NDAPreview from './components/NDAPreview';
import { NDAFormData, defaultFormData } from './lib/types';
import { downloadMarkdown } from './lib/download';

export default function Home() {
  const [formData, setFormData] = useState<NDAFormData>({
    ...defaultFormData,
    effectiveDate: new Date().toISOString().split('T')[0],
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="no-print bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Mutual NDA Creator</h1>
          <p className="text-xs text-gray-500">Prelegal &mdash; Common Paper Mutual NDA v1.0</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadMarkdown(formData)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .md
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>
      </header>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <aside className="no-print w-96 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <NDAForm data={formData} onChange={setFormData} />
        </aside>

        {/* Preview panel */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-10">
          <NDAPreview data={formData} />
        </main>
      </div>
    </div>
  );
}
