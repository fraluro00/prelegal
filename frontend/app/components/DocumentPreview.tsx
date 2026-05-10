'use client';

import { DocumentConfig, DocumentFields } from '../lib/types';

interface Props {
  config: DocumentConfig;
  fields: DocumentFields;
}

function strVal(v: unknown): string {
  return v != null ? String(v) : '';
}

function FieldValue({ value, fallback }: { value: string; fallback: string }) {
  if (value?.trim()) {
    return (
      <span className="bg-yellow-100 text-gray-900 font-medium px-0.5 rounded">
        {value}
      </span>
    );
  }
  return (
    <span className="bg-gray-100 text-gray-400 italic px-0.5 rounded">
      {fallback}
    </span>
  );
}

export default function DocumentPreview({ config, fields }: Props) {
  const filledCount = config.fields.filter((f) => strVal(fields[f.key]).trim()).length;
  const totalCount = config.fields.length;
  const pct = totalCount === 0 ? 0 : Math.round((filledCount / totalCount) * 100);

  return (
    <div className="max-w-3xl mx-auto font-serif">
      <div
        className="flex items-start gap-2.5 rounded-md border px-4 py-3 mb-6 text-xs leading-relaxed"
        style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d', color: '#92400e' }}
      >
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <p>
          <strong>Draft document.</strong> This document has been generated for discussion purposes only and has not been reviewed by a licensed attorney. Please consult a qualified legal professional before use.
        </p>
      </div>

      <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">{config.name}</h1>
      <div className="border-b border-gray-300 mb-6" />

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>{filledCount} of {totalCount} fields filled</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: '#209dd7' }}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
        {config.fields.map((field) => (
          <div key={field.key}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </p>
            <p className="text-sm text-gray-800">
              <FieldValue
                value={strVal(fields[field.key])}
                fallback={`[${field.label}]`}
              />
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Chat with the AI assistant to fill in missing fields, or edit them directly in the &ldquo;Edit Fields&rdquo; tab.
      </p>
    </div>
  );
}
