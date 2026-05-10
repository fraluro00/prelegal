import { DRAFT_DISCLAIMER, generateMarkdown } from '../../app/lib/download';
import { defaultFormData, NDAFormData } from '../../app/lib/types';

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

describe('generateMarkdown', () => {
  describe('with filled data', () => {
    let md: string;
    beforeEach(() => {
      md = generateMarkdown(filledData);
    });

    it('includes the purpose', () => {
      expect(md).toContain('Evaluating a potential partnership');
    });

    it('includes governing law in section 9', () => {
      const section9 = md.slice(md.indexOf('**9. Governing Law'));
      expect(section9).toContain('Delaware');
    });

    it('includes jurisdiction in section 9', () => {
      const section9 = md.slice(md.indexOf('**9. Governing Law'));
      expect(section9).toContain('New Castle, DE');
    });

    it('includes effective date in section 5', () => {
      const section5 = md.slice(md.indexOf('**5. Term'));
      expect(section5).toContain('May 9, 2026');
    });

    it('includes effective date in the signature table Date row', () => {
      const tableSection = md.slice(md.indexOf('| Date |'));
      expect(tableSection).toContain('May 9, 2026');
    });

    it('includes party names in signature table', () => {
      expect(md).toContain('Alice Smith');
      expect(md).toContain('Bob Jones');
    });

    it('includes party companies in signature table', () => {
      expect(md).toContain('Acme Corp');
      expect(md).toContain('Beta Inc');
    });

    it('includes MNDA term years in section 5', () => {
      const section5 = md.slice(md.indexOf('**5. Term'));
      expect(section5).toContain('2 year(s) from Effective Date');
    });

    it('includes confidentiality years in section 5', () => {
      const section5 = md.slice(md.indexOf('**5. Term'));
      expect(section5).toContain('3 year(s) from Effective Date');
    });
  });

  describe('until_terminated MNDA term', () => {
    it('produces grammatically correct Section 5', () => {
      const md = generateMarkdown({ ...filledData, mndaTermType: 'until_terminated' });
      const section5 = md.slice(md.indexOf('**5. Term'));
      expect(section5).toContain('expires at the end of the **the date of termination');
      expect(section5).not.toContain('expires at the end of the **continues');
    });

    it('checks the until_terminated radio in the cover page', () => {
      const md = generateMarkdown({ ...filledData, mndaTermType: 'until_terminated' });
      expect(md).toContain('- [x] Continues until terminated');
      expect(md).toContain('- [ ] Expires');
    });
  });

  describe('perpetuity confidentiality', () => {
    it('shows In perpetuity in cover page', () => {
      const md = generateMarkdown({ ...filledData, confidentialityType: 'perpetuity' });
      expect(md).toContain('- [x] In perpetuity');
    });

    it('shows In perpetuity in section 5', () => {
      const md = generateMarkdown({ ...filledData, confidentialityType: 'perpetuity' });
      const section5 = md.slice(md.indexOf('**5. Term'));
      expect(section5).toContain('In perpetuity');
    });
  });

  describe('Markdown injection protection', () => {
    it('escapes pipe characters in purpose to prevent table corruption', () => {
      const md = generateMarkdown({ ...filledData, purpose: 'A | B partnership' });
      expect(md).toContain('A \\| B partnership');
    });

    it('escapes asterisks in party names', () => {
      const md = generateMarkdown({ ...filledData, party1Name: 'Alice **Bold** Smith' });
      expect(md).toContain('Alice \\*\\*Bold\\*\\* Smith');
    });

    it('escapes backticks in governing law', () => {
      const md = generateMarkdown({ ...filledData, governingLaw: 'State `X`' });
      expect(md).toContain('State \\`X\\`');
    });

    it('escapes pipe in party address to prevent table row corruption', () => {
      const md = generateMarkdown({ ...filledData, party1Address: 'alice|bob@acme.com' });
      const tableSection = md.slice(md.indexOf('|| PARTY 1'));
      expect(tableSection).toContain('alice\\|bob@acme.com');
    });
  });

  describe('with empty fields', () => {
    it('uses fallback placeholders for empty text fields', () => {
      const md = generateMarkdown({
        ...defaultFormData,
        purpose: '',
        governingLaw: '',
        jurisdiction: '',
        effectiveDate: '',
      });
      expect(md).toContain('[Purpose]');
      expect(md).toContain('[Not specified]');
      expect(md).toContain('[Effective Date]');
    });
  });
});

describe('DRAFT_DISCLAIMER', () => {
  it('includes the legal disclaimer text', () => {
    expect(DRAFT_DISCLAIMER).toContain('Legal Disclaimer');
    expect(DRAFT_DISCLAIMER).toContain('draft');
    expect(DRAFT_DISCLAIMER).toContain('licensed attorney');
  });

  it('generateMarkdown does NOT include the disclaimer', () => {
    const md = generateMarkdown(filledData);
    expect(md).not.toContain('Legal Disclaimer');
  });
});
