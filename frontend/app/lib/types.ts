export interface NDAFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermType: 'expires' | 'until_terminated';
  mndaTermYears: number;
  confidentialityType: 'years' | 'perpetuity';
  confidentialityYears: number;
  governingLaw: string;
  jurisdiction: string;
  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1Address: string;
  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2Address: string;
}

export const defaultFormData: NDAFormData = {
  purpose: '',
  effectiveDate: '',
  mndaTermType: 'expires',
  mndaTermYears: 1,
  confidentialityType: 'years',
  confidentialityYears: 1,
  governingLaw: '',
  jurisdiction: '',
  party1Name: '',
  party1Title: '',
  party1Company: '',
  party1Address: '',
  party2Name: '',
  party2Title: '',
  party2Company: '',
  party2Address: '',
};

export interface DocumentField {
  key: string;
  label: string;
  description: string;
  type: 'text' | 'date' | 'textarea';
  required: boolean;
  placeholder?: string;
}

export interface DocumentConfig {
  filename: string;
  name: string;
  description: string;
  fields: DocumentField[];
}

export type DocumentFields = Record<string, string>;
