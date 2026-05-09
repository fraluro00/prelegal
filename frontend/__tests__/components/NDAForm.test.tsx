import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NDAForm from '../../app/components/NDAForm';
import { defaultFormData, NDAFormData } from '../../app/lib/types';

// Stateful wrapper so controlled inputs update correctly across keystrokes
function setup(overrides: Partial<NDAFormData> = {}) {
  const onChange = jest.fn();
  function Wrapper() {
    const [data, setData] = React.useState({ ...defaultFormData, ...overrides });
    return (
      <NDAForm
        data={data}
        onChange={(newData) => {
          setData(newData);
          onChange(newData);
        }}
      />
    );
  }
  render(<Wrapper />);
  return { onChange };
}

describe('NDAForm', () => {
  describe('structure renders all sections', () => {
    it('renders Cover Page section heading', () => {
      setup();
      expect(screen.getByText('Cover Page')).toBeInTheDocument();
    });

    it('renders Party 1 section heading', () => {
      setup();
      expect(screen.getByText('Party 1')).toBeInTheDocument();
    });

    it('renders Party 2 section heading', () => {
      setup();
      expect(screen.getByText('Party 2')).toBeInTheDocument();
    });

    it('renders Purpose textarea with default placeholder', () => {
      setup();
      expect(
        screen.getByPlaceholderText(/Evaluating whether to enter/)
      ).toBeInTheDocument();
    });

    it('renders Effective Date section label', () => {
      setup();
      expect(screen.getByText('Effective Date')).toBeInTheDocument();
    });

    it('renders Governing Law input', () => {
      setup();
      expect(screen.getByPlaceholderText('e.g. Delaware')).toBeInTheDocument();
    });

    it('renders Jurisdiction input', () => {
      setup();
      expect(screen.getByPlaceholderText('e.g. New Castle, DE')).toBeInTheDocument();
    });

    it('renders MNDA term year input with accessible name', () => {
      setup();
      expect(screen.getByRole('spinbutton', { name: 'MNDA term years' })).toBeInTheDocument();
    });

    it('renders confidentiality year input with accessible name', () => {
      setup();
      expect(screen.getByRole('spinbutton', { name: 'Confidentiality term years' })).toBeInTheDocument();
    });

    it('renders 4 MNDA radio buttons total', () => {
      setup();
      expect(screen.getAllByRole('radio')).toHaveLength(4);
    });
  });

  describe('field interactions', () => {
    it('calls onChange when a character is typed in purpose', async () => {
      const user = userEvent.setup();
      const { onChange } = setup();
      const textarea = screen.getByPlaceholderText(/Evaluating whether to enter/);
      await user.type(textarea, 'X');
      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.purpose).toContain('X');
    });

    it('calls onChange with new purpose after clearing and typing', async () => {
      const user = userEvent.setup();
      const { onChange } = setup();
      const textarea = screen.getByPlaceholderText(/Evaluating whether to enter/);
      await user.clear(textarea);
      await user.type(textarea, 'New purpose text');
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.purpose).toBe('New purpose text');
    });

    it('calls onChange when governing law is typed', async () => {
      const user = userEvent.setup();
      const { onChange } = setup();
      await user.type(screen.getByPlaceholderText('e.g. Delaware'), 'Delaware');
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.governingLaw).toBe('Delaware');
    });

    it('calls onChange when jurisdiction is typed', async () => {
      const user = userEvent.setup();
      const { onChange } = setup();
      await user.type(screen.getByPlaceholderText('e.g. New Castle, DE'), 'San Jose, CA');
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.jurisdiction).toBe('San Jose, CA');
    });

    it('calls onChange when party 1 company is typed', async () => {
      const user = userEvent.setup();
      const { onChange } = setup();
      const companyInputs = screen.getAllByPlaceholderText('Company name');
      await user.type(companyInputs[0], 'Acme Corp');
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.party1Company).toBe('Acme Corp');
    });

    it('calls onChange when party 2 name is typed', async () => {
      const user = userEvent.setup();
      const { onChange } = setup();
      const nameInputs = screen.getAllByPlaceholderText('Full name');
      await user.type(nameInputs[1], 'Bob Williams');
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.party2Name).toBe('Bob Williams');
    });
  });

  describe('MNDA term type radio buttons', () => {
    it('expires radio is checked by default', () => {
      setup();
      const radios = screen.getAllByRole('radio');
      const expiresRadio = radios.find((r) =>
        r.closest('label')?.textContent?.includes('Expires after')
      );
      expect(expiresRadio).toBeChecked();
    });

    it('year input is enabled when expires is selected', () => {
      setup({ mndaTermType: 'expires' });
      expect(screen.getByRole('spinbutton', { name: 'MNDA term years' })).not.toBeDisabled();
    });

    it('year input is disabled when until_terminated is selected', () => {
      setup({ mndaTermType: 'until_terminated' });
      expect(screen.getByRole('spinbutton', { name: 'MNDA term years' })).toBeDisabled();
    });

    it('clicking until_terminated calls onChange with correct mndaTermType', async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ mndaTermType: 'expires' });
      const radios = screen.getAllByRole('radio');
      const untilRadio = radios.find((r) =>
        r.closest('label')?.textContent?.includes('Continues until terminated')
      );
      await user.click(untilRadio!);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ mndaTermType: 'until_terminated' })
      );
    });

    it('clicking expires radio calls onChange with expires', async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ mndaTermType: 'until_terminated' });
      const radios = screen.getAllByRole('radio');
      const expiresRadio = radios.find((r) =>
        r.closest('label')?.textContent?.includes('Expires after')
      );
      await user.click(expiresRadio!);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ mndaTermType: 'expires' })
      );
    });
  });

  describe('confidentiality term radio buttons', () => {
    it('years radio is checked by default', () => {
      setup();
      const radios = screen.getAllByRole('radio');
      const yearsRadio = radios.find((r) =>
        r.closest('label')?.textContent?.includes('year(s) from Effective Date')
      );
      expect(yearsRadio).toBeChecked();
    });

    it('year input is enabled when years is selected', () => {
      setup({ confidentialityType: 'years' });
      expect(screen.getByRole('spinbutton', { name: 'Confidentiality term years' })).not.toBeDisabled();
    });

    it('year input is disabled when perpetuity is selected', () => {
      setup({ confidentialityType: 'perpetuity' });
      expect(screen.getByRole('spinbutton', { name: 'Confidentiality term years' })).toBeDisabled();
    });

    it('clicking perpetuity calls onChange with perpetuity', async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ confidentialityType: 'years' });
      const radios = screen.getAllByRole('radio');
      const perpetuityRadio = radios.find((r) =>
        r.closest('label')?.textContent?.includes('In perpetuity')
      );
      await user.click(perpetuityRadio!);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ confidentialityType: 'perpetuity' })
      );
    });
  });

  describe('onChange preserves unrelated fields', () => {
    it('does not drop other fields when governing law changes', async () => {
      const user = userEvent.setup();
      const { onChange } = setup({
        party1Name: 'Existing Name',
        party1Company: 'Existing Corp',
        mndaTermYears: 3,
      });
      await user.type(screen.getByPlaceholderText('e.g. Delaware'), 'X');
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.party1Name).toBe('Existing Name');
      expect(lastCall.party1Company).toBe('Existing Corp');
      expect(lastCall.mndaTermYears).toBe(3);
    });
  });
});
