'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatPanel from './components/ChatPanel';
import DocumentCatalog from './components/DocumentCatalog';
import DocumentForm from './components/DocumentForm';
import DocumentPreview from './components/DocumentPreview';
import NDAForm from './components/NDAForm';
import NDAPreview from './components/NDAPreview';
import { API_URL, authHeaders, clearAuth, getEmail, getToken } from './lib/auth';
import { getDocConfig, isNDADoc } from './lib/documents';
import { downloadGenericMarkdown, downloadMarkdown } from './lib/download';
import { DocumentFields, NDAFormData, defaultFormData } from './lib/types';

const NDA_REQUIRED: (keyof NDAFormData)[] = [
  'purpose', 'effectiveDate', 'governingLaw', 'jurisdiction',
  'party1Name', 'party1Company', 'party2Name', 'party2Company',
];

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function deriveTitle(docType: string, fields: Record<string, unknown>): string {
  const config = getDocConfig(docType);
  const docName = config?.name ?? docType;
  const party1 = fields.party1Company || fields.providerName || fields.companyName;
  const party2 = fields.party2Company || fields.customerName || fields.partnerName;
  const parties = [party1, party2].filter(Boolean);
  if (parties.length > 0) return `${docName} — ${parties.join(' & ')}`;
  return docName;
}

export default function Home() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [ndaData, setNdaData] = useState<NDAFormData>({ ...defaultFormData, effectiveDate: todayISO() });
  const [genericFields, setGenericFields] = useState<DocumentFields>({});
  const [activeTab, setActiveTab] = useState<'chat' | 'fields'>('chat');
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'print' | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    setUserEmail(getEmail() || '');
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) return null;

  function handleLogout() {
    clearAuth();
    router.push('/login');
  }

  function handleSelect(filename: string, initialFields?: Record<string, unknown>) {
    setSelectedDoc(filename);
    setActiveTab('chat');
    if (initialFields) {
      if (isNDADoc(filename)) {
        setNdaData(initialFields as unknown as NDAFormData);
      } else {
        setGenericFields(initialFields as DocumentFields);
      }
    } else {
      setGenericFields({});
      setNdaData({ ...defaultFormData, effectiveDate: todayISO() });
    }
  }

  if (!selectedDoc) {
    return (
      <DocumentCatalog
        onSelect={handleSelect}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
    );
  }

  const docConfig = getDocConfig(selectedDoc);
  const useNDA = isNDADoc(selectedDoc);

  function isComplete(): boolean {
    if (useNDA) return NDA_REQUIRED.every((k) => !!ndaData[k]);
    if (!docConfig) return false;
    return docConfig.fields.filter((f) => f.required).every((f) => !!genericFields[f.key]?.trim());
  }

  function handleDownload() {
    if (!isComplete()) { setPendingAction('download'); setShowIncompleteWarning(true); return; }
    executeDownload();
  }

  function handlePrint() {
    if (!isComplete()) { setPendingAction('print'); setShowIncompleteWarning(true); return; }
    window.print();
  }

  function executeDownload() {
    if (useNDA) {
      downloadMarkdown(ndaData);
    } else if (docConfig) {
      downloadGenericMarkdown(docConfig, genericFields);
    }
  }

  function confirmAction() {
    setShowIncompleteWarning(false);
    if (pendingAction === 'download') executeDownload();
    if (pendingAction === 'print') window.print();
    setPendingAction(null);
  }

  async function handleSave() {
    setSaveStatus('saving');
    const fields = useNDA
      ? (ndaData as unknown as Record<string, unknown>)
      : (genericFields as Record<string, unknown>);
    const title = deriveTitle(selectedDoc!, fields);
    try {
      const res = await fetch(`${API_URL}/api/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ doc_type: selectedDoc, fields, title }),
      });
      setSaveStatus(res.ok ? 'saved' : 'error');
    } catch {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 2500);
  }

  const chatFields = useNDA
    ? (ndaData as unknown as Record<string, unknown>)
    : (genericFields as Record<string, unknown>);

  function onChatFieldsChange(updated: Record<string, unknown>) {
    if (useNDA) {
      setNdaData(updated as unknown as NDAFormData);
    } else {
      setGenericFields(updated as DocumentFields);
    }
  }

  const docName = docConfig?.name ?? selectedDoc;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="no-print bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedDoc(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <div>
            <h1 className="text-lg font-bold leading-tight" style={{ color: '#032147' }}>{docName}</h1>
            <p className="text-xs text-gray-500">Prelegal &mdash; AI-powered document drafting</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md border transition-colors disabled:opacity-50"
            style={
              saveStatus === 'saved'
                ? { borderColor: '#22c55e', color: '#16a34a', backgroundColor: '#f0fdf4' }
                : saveStatus === 'error'
                ? { borderColor: '#ef4444', color: '#dc2626', backgroundColor: '#fef2f2' }
                : { borderColor: '#e5e7eb', color: '#374151', backgroundColor: '#ffffff' }
            }
          >
            {saveStatus === 'saved' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : saveStatus === 'error' ? (
              'Save failed'
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {saveStatus === 'saving' ? 'Saving…' : 'Save'}
              </>
            )}
          </button>
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

      <div className="flex flex-1 overflow-hidden">
        <aside className="no-print w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex border-b border-gray-200 flex-shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'chat' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
              style={activeTab === 'chat' ? { borderBottomColor: '#209dd7', color: '#209dd7' } : {}}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'fields' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
              style={activeTab === 'fields' ? { borderBottomColor: '#209dd7', color: '#209dd7' } : {}}
            >
              Edit Fields
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className={activeTab === 'chat' ? 'h-full' : 'hidden'}>
              <ChatPanel
                fields={chatFields}
                onFieldsChange={onChatFieldsChange}
                documentType={selectedDoc}
              />
            </div>
            <div className={activeTab === 'fields' ? 'overflow-y-auto h-full' : 'hidden'}>
              {useNDA ? (
                <NDAForm data={ndaData} onChange={setNdaData} />
              ) : docConfig ? (
                <DocumentForm
                  config={docConfig}
                  fields={genericFields}
                  onChange={setGenericFields}
                />
              ) : null}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-10">
          {useNDA ? (
            <NDAPreview data={ndaData} />
          ) : docConfig ? (
            <DocumentPreview config={docConfig} fields={genericFields} />
          ) : null}
        </main>
      </div>

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
