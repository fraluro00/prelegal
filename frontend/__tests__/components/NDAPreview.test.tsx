import { render, screen } from '@testing-library/react';
import NDAPreview from '../../app/components/NDAPreview';
import { defaultFormData, NDAFormData } from '../../app/lib/types';

const emptyData: NDAFormData = {
  ...defaultFormData,
  purpose: '',
  effectiveDate: '',
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

const filledData: NDAFormData = {
  purpose: 'Evaluating a potential partnership',
  effectiveDate: '2026-05-09',
  mndaTermType: 'expires',
  mndaTermYears: 2,
  confidentialityType: 'years',
  confidentialityYears: 3,
  governingLaw: 'Delaware',
  jurisdiction: 'New Castle, DE',
  party1Name: 'Alice Smith',
  party1Title: 'CEO',
  party1Company: 'Acme Corp',
  party1Address: 'alice@acme.com',
  party2Name: 'Bob Jones',
  party2Title: 'CTO',
  party2Company: 'Beta Inc',
  party2Address: 'bob@beta.com',
};

describe('NDAPreview', () => {
  describe('renders without crashing', () => {
    it('renders with default data', () => {
      render(<NDAPreview data={defaultFormData} />);
      expect(screen.getByText('Mutual Non-Disclosure Agreement')).toBeInTheDocument();
    });

    it('renders with all empty fields', () => {
      render(<NDAPreview data={emptyData} />);
      expect(screen.getByText('Mutual Non-Disclosure Agreement')).toBeInTheDocument();
    });
  });

  describe('fallback placeholders when empty', () => {
    it('shows [Not specified] fallbacks in cover page', () => {
      render(<NDAPreview data={emptyData} />);
      const fallbacks = screen.getAllByText('[Not specified]');
      expect(fallbacks.length).toBeGreaterThanOrEqual(1);
    });

    it('shows [Purpose] in standard terms for empty purpose', () => {
      render(<NDAPreview data={emptyData} />);
      const placeholders = screen.getAllByText('[Purpose]');
      expect(placeholders.length).toBeGreaterThanOrEqual(3);
    });

    it('shows [Governing Law] fallback in section 9 when empty', () => {
      render(<NDAPreview data={emptyData} />);
      const fallbacks = screen.getAllByText('[Governing Law]');
      expect(fallbacks.length).toBeGreaterThanOrEqual(2);
    });

    it('shows [Jurisdiction] fallback in section 9 when empty', () => {
      render(<NDAPreview data={emptyData} />);
      const fallbacks = screen.getAllByText('[Jurisdiction]');
      expect(fallbacks.length).toBeGreaterThanOrEqual(2);
    });

    it('shows [Effective Date] fallback in section 5 when empty', () => {
      render(<NDAPreview data={emptyData} />);
      expect(screen.getByText('[Effective Date]')).toBeInTheDocument();
    });

    it('shows Party 1 and Party 2 headers when company is empty', () => {
      render(<NDAPreview data={emptyData} />);
      expect(screen.getByText('Party 1')).toBeInTheDocument();
      expect(screen.getByText('Party 2')).toBeInTheDocument();
    });
  });

  describe('whitespace-only input treated as empty (trim fix)', () => {
    it('shows fallback when purpose is only spaces', () => {
      render(<NDAPreview data={{ ...emptyData, purpose: '   ' }} />);
      expect(screen.getAllByText('[Purpose]').length).toBeGreaterThanOrEqual(1);
    });

    it('shows fallback when governingLaw is only spaces', () => {
      render(<NDAPreview data={{ ...emptyData, governingLaw: '   ' }} />);
      expect(screen.getAllByText('[Governing Law]').length).toBeGreaterThanOrEqual(1);
    });

    it('does not highlight whitespace-only jurisdiction', () => {
      render(<NDAPreview data={{ ...emptyData, jurisdiction: '   ' }} />);
      expect(screen.getAllByText('[Jurisdiction]').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('highlights filled values', () => {
    it('shows purpose text in standard terms sections', () => {
      render(<NDAPreview data={filledData} />);
      const purposeElements = screen.getAllByText('Evaluating a potential partnership');
      expect(purposeElements.length).toBeGreaterThanOrEqual(3);
    });

    it('shows governing law in cover page and section 9', () => {
      render(<NDAPreview data={filledData} />);
      // cover page (1) + section 9 (2) = 3 total
      const elements = screen.getAllByText('Delaware');
      expect(elements.length).toBeGreaterThanOrEqual(2);
    });

    it('shows jurisdiction in cover page and section 9', () => {
      render(<NDAPreview data={filledData} />);
      const elements = screen.getAllByText('New Castle, DE');
      expect(elements.length).toBeGreaterThanOrEqual(2);
    });

    it('shows formatted effective date in multiple places', () => {
      render(<NDAPreview data={filledData} />);
      const dateElements = screen.getAllByText('May 9, 2026');
      expect(dateElements.length).toBeGreaterThanOrEqual(1);
    });

    it('shows MNDA term years in section 5', () => {
      render(<NDAPreview data={filledData} />);
      expect(screen.getByText('2 year(s) from Effective Date')).toBeInTheDocument();
    });

    it('shows confidentiality years in section 5', () => {
      render(<NDAPreview data={filledData} />);
      expect(screen.getByText('3 year(s) from Effective Date')).toBeInTheDocument();
    });

    it('shows party names in signature table', () => {
      render(<NDAPreview data={filledData} />);
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });

    it('shows party titles in signature table', () => {
      render(<NDAPreview data={filledData} />);
      expect(screen.getByText('CEO')).toBeInTheDocument();
      expect(screen.getByText('CTO')).toBeInTheDocument();
    });

    it('shows effective date in Date row of signature table (multiple occurrences)', () => {
      render(<NDAPreview data={filledData} />);
      const dateElements = screen.getAllByText('May 9, 2026');
      // cover page + section 5 + two Date cells = 4+
      expect(dateElements.length).toBeGreaterThanOrEqual(3);
    });

    it('does not show [Purpose] when purpose is filled', () => {
      render(<NDAPreview data={filledData} />);
      expect(screen.queryByText('[Purpose]')).not.toBeInTheDocument();
    });

    it('does not show [Governing Law] when governingLaw is filled', () => {
      render(<NDAPreview data={filledData} />);
      expect(screen.queryByText('[Governing Law]')).not.toBeInTheDocument();
    });
  });

  describe('MNDA term display', () => {
    it('shows ticked expires checkbox when mndaTermType is expires', () => {
      render(<NDAPreview data={filledData} />);
      const expiresRow = screen.getByText(/Expires/).closest('div');
      expect(expiresRow).toHaveTextContent('☑');
    });

    it('shows ticked until_terminated checkbox when selected', () => {
      render(<NDAPreview data={{ ...filledData, mndaTermType: 'until_terminated' }} />);
      const row = screen.getByText(/Continues until terminated/).closest('div');
      expect(row).toHaveTextContent('☑');
    });
  });

  describe('confidentiality term display', () => {
    it('shows years option text', () => {
      render(<NDAPreview data={filledData} />);
      expect(screen.getByText(/from Effective Date, but in the case of trade secrets/)).toBeInTheDocument();
    });

    it('shows In perpetuity checkbox text when selected', () => {
      render(<NDAPreview data={{ ...filledData, confidentialityType: 'perpetuity' }} />);
      expect(screen.getByText('In perpetuity.')).toBeInTheDocument();
    });

    it('shows in perpetuity in section 5 when perpetuity selected', () => {
      render(<NDAPreview data={{ ...filledData, confidentialityType: 'perpetuity' }} />);
      expect(screen.getByText('in perpetuity')).toBeInTheDocument();
    });
  });
});
