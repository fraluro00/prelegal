'use client';

import { DocumentConfig, DocumentFields } from '../lib/types';

interface Props {
  config: DocumentConfig;
  fields: DocumentFields;
  onChange: (fields: DocumentFields) => void;
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const textareaClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none';

export default function DocumentForm({ config, fields, onChange }: Props) {
  function set(key: string, value: string) {
    onChange({ ...fields, [key]: value });
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Document Details</h2>
      <p className="text-xs text-gray-500 mb-6">{config.name}</p>

      {config.fields.map((field) => (
        <div key={field.key} className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {field.description && (
            <p className="text-xs text-gray-500 mb-1">{field.description}</p>
          )}
          {field.type === 'textarea' ? (
            <textarea
              className={textareaClass}
              rows={3}
              value={fields[field.key] ?? ''}
              onChange={(e) => set(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          ) : (
            <input
              type={field.type}
              className={inputClass}
              value={fields[field.key] ?? ''}
              onChange={(e) => set(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
    </div>
  );
}
