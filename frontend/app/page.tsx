'use client';

import { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import NDAForm from './components/NDAForm';
import NDAPreview from './components/NDAPreview';
import { NDAFormData, defaultFormData } from './lib/types';
import { downloadMarkdown } from './lib/download';

const REQUIRED_FIELDS: (keyof NDAFormData)[] = [
  'purpose', 'effectiveDate', 'governingLaw', 'jurisdiction',
  'party1Name', 'party1Company', 'party2Name', 'party2Company',
];

export default function Home() {
  const [formData, setFormData] = useState<NDAFormData>({
    ...defaultFormData,
    effectiveDate: (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })(),
  });
  const [activeTab, setActiveTab] = useState<'chat' | 'fields'>('chat');
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'print' | null>(null);

  function isComplete(): boolean {
    return REQUIRED_FIELDS.every((k) => !!formData[k]);
  }

  function handleDownload() {
    if (!isComplete()) {
      setPendingAction('download');
      setShowIncompleteWarning(true);
    } else {
      downloadMarkdown(formData);
    }
  }

  function handlePrint() {
    if (!isComplete()) {
      setPendingAction('print');
      setShowIncompleteWarning(true);
    } else {
      window.print();
    }
  }

  function confirmAction() {
    setShowIncompleteWarning(false);
    if (pendingAction === 'download') downloadMarkdown(formData);
    if (pendingAction === 'print') window.print();
    setPendingAction(null);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="no-print bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-lg font-bold" style={{ color: '#032147' }}>Mutual NDA Creator</h1>
          <p className="text-xs text-gray-500">Prelegal &mdash; Common Paper Mutual NDA v1.0</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .md
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
            style={{ backgroundColor: '#209dd7' }}
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
        {/* Left panel */}
        <aside className="no-print w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'border-b-2 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'chat' ? { borderBottomColor: '#209dd7', color: '#209dd7' } : {}}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'fields'
                  ? 'border-b-2 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === 'fields' ? { borderBottomColor: '#209dd7', color: '#209dd7' } : {}}
            >
              Edit Fields
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' ? (
              <ChatPanel fields={formData} onFieldsChange={setFormData} />
            ) : (
              <div className="overflow-y-auto h-full">
                <NDAForm data={formData} onChange={setFormData} />
              </div>
            )}
          </div>
        </aside>

        {/* Preview panel */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-10">
          <NDAPreview data={formData} />
        </main>
      </div>

      {/* Incomplete fields warning dialog */}
      {showIncompleteWarning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Document incomplete</h2>
            <p className="text-sm text-gray-600 mb-4">
              Some required fields are still blank. The document will have empty sections. Continue anyway?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowIncompleteWarning(false); setPendingAction(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Go back
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 text-sm font-medium text-white rounded-md"
                style={{ backgroundColor: '#753991' }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
