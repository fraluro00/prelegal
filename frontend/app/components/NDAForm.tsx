'use client';

import { NDAFormData } from '../lib/types';

interface Props {
  data: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-500 mb-1">{hint}</p>}
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const textareaClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none';

export default function NDAForm({ data, onChange }: Props) {
  function set<K extends keyof NDAFormData>(key: K, value: NDAFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Agreement Details</h2>
      <p className="text-xs text-gray-500 mb-6">Fill in the fields to generate your NDA</p>

      <section className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Cover Page</h3>

        <Field
          label="Purpose"
          hint="How Confidential Information may be used"
        >
          <textarea
            className={textareaClass}
            rows={3}
            value={data.purpose}
            onChange={(e) => set('purpose', e.target.value)}
            placeholder="Evaluating whether to enter into a business relationship with the other party."
          />
        </Field>

        <Field label="Effective Date">
          <input
            type="date"
            className={inputClass}
            value={data.effectiveDate}
            onChange={(e) => set('effectiveDate', e.target.value)}
          />
        </Field>

        <Field label="MNDA Term" hint="The length of this MNDA">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="mndaTermType"
                checked={data.mndaTermType === 'expires'}
                onChange={() => set('mndaTermType', 'expires')}
                className="accent-blue-600"
              />
              Expires after
              <input
                type="number"
                min={1}
                aria-label="MNDA term years"
                className="w-16 rounded border border-gray-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.mndaTermYears}
                onChange={(e) => set('mndaTermYears', Math.max(1, Number(e.target.value)))}
                disabled={data.mndaTermType !== 'expires'}
              />
              year(s) from Effective Date
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="mndaTermType"
                checked={data.mndaTermType === 'until_terminated'}
                onChange={() => set('mndaTermType', 'until_terminated')}
                className="accent-blue-600"
              />
              Continues until terminated
            </label>
          </div>
        </Field>

        <Field label="Term of Confidentiality" hint="How long Confidential Information is protected">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="confidentialityType"
                checked={data.confidentialityType === 'years'}
                onChange={() => set('confidentialityType', 'years')}
                className="accent-blue-600"
              />
              <input
                type="number"
                min={1}
                aria-label="Confidentiality term years"
                className="w-16 rounded border border-gray-300 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.confidentialityYears}
                onChange={(e) => set('confidentialityYears', Math.max(1, Number(e.target.value)))}
                disabled={data.confidentialityType !== 'years'}
              />
              year(s) from Effective Date
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="confidentialityType"
                checked={data.confidentialityType === 'perpetuity'}
                onChange={() => set('confidentialityType', 'perpetuity')}
                className="accent-blue-600"
              />
              In perpetuity
            </label>
          </div>
        </Field>

        <Field label="Governing Law" hint="State whose laws govern this MNDA">
          <input
            type="text"
            className={inputClass}
            value={data.governingLaw}
            onChange={(e) => set('governingLaw', e.target.value)}
            placeholder="e.g. Delaware"
          />
        </Field>

        <Field label="Jurisdiction" hint='City or county and state, e.g. "New Castle, DE"'>
          <input
            type="text"
            className={inputClass}
            value={data.jurisdiction}
            onChange={(e) => set('jurisdiction', e.target.value)}
            placeholder="e.g. New Castle, DE"
          />
        </Field>
      </section>

      <section className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Party 1</h3>
        <Field label="Name">
          <input type="text" className={inputClass} value={data.party1Name} onChange={(e) => set('party1Name', e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Title">
          <input type="text" className={inputClass} value={data.party1Title} onChange={(e) => set('party1Title', e.target.value)} placeholder="Job title" />
        </Field>
        <Field label="Company">
          <input type="text" className={inputClass} value={data.party1Company} onChange={(e) => set('party1Company', e.target.value)} placeholder="Company name" />
        </Field>
        <Field label="Notice Address" hint="Email or postal address">
          <input type="text" className={inputClass} value={data.party1Address} onChange={(e) => set('party1Address', e.target.value)} placeholder="email@example.com" />
        </Field>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Party 2</h3>
        <Field label="Name">
          <input type="text" className={inputClass} value={data.party2Name} onChange={(e) => set('party2Name', e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Title">
          <input type="text" className={inputClass} value={data.party2Title} onChange={(e) => set('party2Title', e.target.value)} placeholder="Job title" />
        </Field>
        <Field label="Company">
          <input type="text" className={inputClass} value={data.party2Company} onChange={(e) => set('party2Company', e.target.value)} placeholder="Company name" />
        </Field>
        <Field label="Notice Address" hint="Email or postal address">
          <input type="text" className={inputClass} value={data.party2Address} onChange={(e) => set('party2Address', e.target.value)} placeholder="email@example.com" />
        </Field>
      </section>
    </div>
  );
}
