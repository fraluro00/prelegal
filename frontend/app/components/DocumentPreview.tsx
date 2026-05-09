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
