'use client';

import { NDAFormData } from '../lib/types';

interface FieldProps {
  value: string;
  fallback: string;
}

function Field({ value, fallback }: FieldProps) {
  if (value.trim()) {
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

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface Props {
  data: NDAFormData;
}

export default function NDAPreview({ data }: Props) {
  const effectiveDateDisplay = formatDate(data.effectiveDate);

  const mndaTermDisplay =
    data.mndaTermType === 'expires'
      ? `${data.mndaTermYears} year(s) from Effective Date`
      : 'the date of termination in accordance with the terms of the MNDA';

  const confidentialityDisplay =
    data.confidentialityType === 'perpetuity'
      ? 'in perpetuity'
      : `${data.confidentialityYears} year(s) from Effective Date`;

  const p = 'text-sm leading-relaxed text-gray-800 mb-4';
  const h2 = 'text-xl font-bold text-gray-900 mb-2';
  const h3 = 'text-base font-semibold text-gray-800 mb-1 mt-4';

  return (
    <div id="nda-preview" className="max-w-3xl mx-auto font-serif">
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
      {/* Cover Page */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Mutual Non-Disclosure Agreement
        </h1>
        <div className="border-b border-gray-300 mb-6" />

        <p className={`${p} text-xs text-gray-600`}>
          This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this Cover Page
          (&ldquo;<strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA Standard Terms Version 1.0
          (&ldquo;<strong>Standard Terms</strong>&rdquo;) identical to those posted at{' '}
          <a href="https://commonpaper.com/standards/mutual-nda/1.0" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
            commonpaper.com/standards/mutual-nda/1.0
          </a>
          . Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.
        </p>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <h3 className={h3}>Purpose</h3>
            <p className="text-xs text-gray-500 mb-1">How Confidential Information may be used</p>
            <p className="text-sm text-gray-800">
              <Field value={data.purpose} fallback="[Not specified]" />
            </p>
          </div>

          <div>
            <h3 className={h3}>Effective Date</h3>
            <p className="text-sm text-gray-800">
              <Field value={effectiveDateDisplay} fallback="[Not specified]" />
            </p>
          </div>

          <div>
            <h3 className={h3}>MNDA Term</h3>
            <p className="text-xs text-gray-500 mb-1">The length of this MNDA</p>
            <div className="text-sm text-gray-800 space-y-1">
              <div className="flex items-center gap-2">
                <span>{data.mndaTermType === 'expires' ? '☑' : '☐'}</span>
                <span>
                  Expires{' '}
                  {data.mndaTermType === 'expires' ? (
                    <Field value={`${data.mndaTermYears} year(s)`} fallback="" />
                  ) : (
                    <span className="text-gray-400">[…]</span>
                  )}{' '}
                  from Effective Date.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{data.mndaTermType === 'until_terminated' ? '☑' : '☐'}</span>
                <span>Continues until terminated in accordance with the terms of the MNDA.</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={h3}>Term of Confidentiality</h3>
            <p className="text-xs text-gray-500 mb-1">How long Confidential Information is protected</p>
            <div className="text-sm text-gray-800 space-y-1">
              <div className="flex items-start gap-2">
                <span className="mt-0.5">{data.confidentialityType === 'years' ? '☑' : '☐'}</span>
                <span>
                  {data.confidentialityType === 'years' ? (
                    <Field value={`${data.confidentialityYears} year(s)`} fallback="" />
                  ) : (
                    <span className="text-gray-400">[…]</span>
                  )}{' '}
                  from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{data.confidentialityType === 'perpetuity' ? '☑' : '☐'}</span>
                <span>In perpetuity.</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className={h3}>Governing Law &amp; Jurisdiction</h3>
            <p className="text-sm text-gray-800">
              Governing Law:{' '}
              <Field value={data.governingLaw} fallback="[Fill in state]" />
            </p>
            <p className="text-sm text-gray-800 mt-1">
              Jurisdiction:{' '}
              <Field value={data.jurisdiction} fallback='[Fill in city or county and state]' />
            </p>
          </div>

          <div>
            <h3 className={h3}>Signatures</h3>
            <p className="text-xs text-gray-500 mb-3">
              By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left border border-gray-300 px-3 py-2 bg-gray-50 font-semibold w-32"></th>
                    <th className="text-center border border-gray-300 px-3 py-2 bg-gray-50 font-semibold">
                      <Field value={data.party1Company} fallback="Party 1" />
                    </th>
                    <th className="text-center border border-gray-300 px-3 py-2 bg-gray-50 font-semibold">
                      <Field value={data.party2Company} fallback="Party 2" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-4 font-medium">Signature</td>
                    <td className="border border-gray-300 px-3 py-4"></td>
                    <td className="border border-gray-300 px-3 py-4"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Print Name</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={data.party1Name} fallback="" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={data.party2Name} fallback="" />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Title</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={data.party1Title} fallback="" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={data.party2Title} fallback="" />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Company</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={data.party1Company} fallback="" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={data.party2Company} fallback="" />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Notice Address</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={data.party1Address} fallback="" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={data.party2Address} fallback="" />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">Date</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={effectiveDateDisplay} fallback="" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Field value={effectiveDateDisplay} fallback="" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                CC BY 4.0
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Standard Terms */}
      <div>
        <h2 className={h2}>Standard Terms</h2>
        <div className="border-b border-gray-300 mb-6" />

        <p className={p}>
          <strong>1. Introduction.</strong>{' '}
          This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover
          Page (defined below)) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each party
          (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to disclose or make available information
          in connection with the{' '}
          <Field value={data.purpose} fallback="[Purpose]" />{' '}
          which (1) the Disclosing Party identifies to the receiving party
          (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;,
          &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood as
          confidential or proprietary due to its nature and the circumstances of its disclosure
          (&ldquo;<strong>Confidential Information</strong>&rdquo;). Each party&apos;s Confidential
          Information also includes the existence and status of the parties&apos; discussions and
          information on the Cover Page. Confidential Information includes technical or business
          information, product designs or roadmaps, requirements, pricing, security and compliance
          documentation, technology, inventions and know-how. To use this MNDA, the parties must
          complete and sign a cover page incorporating these Standard Terms
          (&ldquo;<strong>Cover Page</strong>&rdquo;). Each party is identified on the Cover Page and
          capitalized terms have the meanings given herein or on the Cover Page.
        </p>

        <p className={p}>
          <strong>2. Use and Protection of Confidential Information.</strong>{' '}
          The Receiving Party shall: (a) use Confidential Information solely for the{' '}
          <Field value={data.purpose} fallback="[Purpose]" />
          ; (b) not disclose Confidential Information to third parties without the Disclosing
          Party&apos;s prior written approval, except that the Receiving Party may disclose
          Confidential Information to its employees, agents, advisors, contractors and other
          representatives having a reasonable need to know for the{' '}
          <Field value={data.purpose} fallback="[Purpose]" />
          , provided these representatives are bound by confidentiality obligations no less protective
          of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party
          remains responsible for their compliance with this MNDA; and (c) protect Confidential
          Information using at least the same protections the Receiving Party uses for its own similar
          information but no less than a reasonable standard of care.
        </p>

        <p className={p}>
          <strong>3. Exceptions.</strong>{' '}
          The Receiving Party&apos;s obligations in this MNDA do not apply to information that it can
          demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party;
          (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without
          confidentiality restrictions; (c) it rightfully obtained from a third party without
          confidentiality restrictions; or (d) it independently developed without using or referencing
          the Confidential Information.
        </p>

        <p className={p}>
          <strong>4. Disclosures Required by Law.</strong>{' '}
          The Receiving Party may disclose Confidential Information to the extent required by law,
          regulation or regulatory authority, subpoena or court order, provided (to the extent legally
          permitted) it provides the Disclosing Party reasonable advance notice of the required
          disclosure and reasonably cooperates, at the Disclosing Party&apos;s expense, with the
          Disclosing Party&apos;s efforts to obtain confidential treatment for the Confidential
          Information.
        </p>

        <p className={p}>
          <strong>5. Term and Termination.</strong>{' '}
          This MNDA commences on the{' '}
          <Field value={effectiveDateDisplay} fallback="[Effective Date]" />{' '}
          and expires at the end of the{' '}
          <Field value={mndaTermDisplay} fallback="[MNDA Term]" />
          . Either party may terminate this MNDA for any or no reason upon written notice to the other
          party. The Receiving Party&apos;s obligations relating to Confidential Information will
          survive for{' '}
          <Field value={confidentialityDisplay} fallback="[Term of Confidentiality]" />
          , despite any expiration or termination of this MNDA.
        </p>

        <p className={p}>
          <strong>6. Return or Destruction of Confidential Information.</strong>{' '}
          Upon expiration or termination of this MNDA or upon the Disclosing Party&apos;s earlier
          request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly
          after the Disclosing Party&apos;s written request, destroy all Confidential Information in
          the Receiving Party&apos;s possession or control or return it to the Disclosing Party; and
          (c) if requested by the Disclosing Party, confirm its compliance with these obligations in
          writing. As an exception to subsection (b), the Receiving Party may retain Confidential
          Information in accordance with its standard backup or record retention policies or as
          required by law, but the terms of this MNDA will continue to apply to the retained
          Confidential Information.
        </p>

        <p className={p}>
          <strong>7. Proprietary Rights.</strong>{' '}
          The Disclosing Party retains all of its intellectual property and other rights in its
          Confidential Information and its disclosure to the Receiving Party grants no license under
          such rights.
        </p>

        <p className={p}>
          <strong>8. Disclaimer.</strong>{' '}
          ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT
          WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A
          PARTICULAR PURPOSE.
        </p>

        <p className={p}>
          <strong>9. Governing Law and Jurisdiction.</strong>{' '}
          This MNDA and all matters relating hereto are governed by, and construed in accordance with,
          the laws of the State of{' '}
          <Field value={data.governingLaw} fallback="[Governing Law]" />
          , without regard to the conflict of laws provisions of such{' '}
          <Field value={data.governingLaw} fallback="[Governing Law]" />
          . Any legal suit, action, or proceeding relating to this MNDA must be instituted in the
          federal or state courts located in{' '}
          <Field value={data.jurisdiction} fallback="[Jurisdiction]" />
          . Each party irrevocably submits to the exclusive jurisdiction of such{' '}
          <Field value={data.jurisdiction} fallback="[Jurisdiction]" />{' '}
          in any such suit, action, or proceeding.
        </p>

        <p className={p}>
          <strong>10. Equitable Relief.</strong>{' '}
          A breach of this MNDA may cause irreparable harm for which monetary damages are an
          insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek
          appropriate equitable relief, including an injunction, in addition to its other remedies.
        </p>

        <p className={p}>
          <strong>11. General.</strong>{' '}
          Neither party has an obligation under this MNDA to disclose Confidential Information to the
          other or proceed with any proposed transaction. Neither party may assign this MNDA without
          the prior written consent of the other party, except that either party may assign this MNDA
          in connection with a merger, reorganization, acquisition or other transfer of all or
          substantially all its assets or voting securities. Any assignment in violation of this
          Section is null and void. This MNDA will bind and inure to the benefit of each party&apos;s
          permitted successors and assigns. Waivers must be signed by the waiving party&apos;s
          authorized representative and cannot be implied from conduct. If any provision of this MNDA
          is held unenforceable, it will be limited to the minimum extent necessary so the rest of
          this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire
          agreement of the parties with respect to its subject matter, and supersedes all prior and
          contemporaneous understandings, agreements, representations, and warranties, whether written
          or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or
          supplemented by an agreement in writing signed by both parties. Notices, requests and
          approvals under this MNDA must be sent in writing to the email or postal addresses on the
          Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts,
          including electronic copies, each of which is deemed an original and which together form the
          same agreement.
        </p>

        <p className="text-xs text-gray-500 mt-8">
          Common Paper Mutual Non-Disclosure Agreement{' '}
          <a href="https://commonpaper.com/standards/mutual-nda/1.0/" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
            Version 1.0
          </a>{' '}
          free to use under{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
            CC BY 4.0
          </a>
          .
        </p>
      </div>
    </div>
  );
}
