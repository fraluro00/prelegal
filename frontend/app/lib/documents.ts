import { DocumentConfig, DocumentField } from './types';

const NDA_FIELDS: DocumentField[] = [
  { key: 'purpose', label: 'Purpose', description: 'How confidential information may be used', type: 'textarea', required: true, placeholder: 'Evaluating a potential business partnership' },
  { key: 'effectiveDate', label: 'Effective Date', description: 'Date the MNDA takes effect', type: 'date', required: true },
  { key: 'mndaTermType', label: 'MNDA Term Type', description: '"expires" or "until_terminated"', type: 'text', required: true },
  { key: 'mndaTermYears', label: 'MNDA Term Years', description: 'Number of years (when type is expires)', type: 'text', required: false },
  { key: 'confidentialityType', label: 'Confidentiality Type', description: '"years" or "perpetuity"', type: 'text', required: true },
  { key: 'confidentialityYears', label: 'Confidentiality Years', description: 'Number of years', type: 'text', required: false },
  { key: 'governingLaw', label: 'Governing Law', description: 'State whose laws govern this agreement', type: 'text', required: true, placeholder: 'Delaware' },
  { key: 'jurisdiction', label: 'Jurisdiction', description: 'Courts where disputes are resolved', type: 'text', required: true, placeholder: 'New Castle, DE' },
  { key: 'party1Name', label: 'Party 1 Name', description: 'Full name of Party 1 signer', type: 'text', required: true },
  { key: 'party1Title', label: 'Party 1 Title', description: 'Job title of Party 1 signer', type: 'text', required: false },
  { key: 'party1Company', label: 'Party 1 Company', description: 'Company of Party 1', type: 'text', required: true },
  { key: 'party1Address', label: 'Party 1 Notice Address', description: 'Email or postal address for Party 1', type: 'text', required: false },
  { key: 'party2Name', label: 'Party 2 Name', description: 'Full name of Party 2 signer', type: 'text', required: true },
  { key: 'party2Title', label: 'Party 2 Title', description: 'Job title of Party 2 signer', type: 'text', required: false },
  { key: 'party2Company', label: 'Party 2 Company', description: 'Company of Party 2', type: 'text', required: true },
  { key: 'party2Address', label: 'Party 2 Notice Address', description: 'Email or postal address for Party 2', type: 'text', required: false },
];

export const DOCUMENTS: DocumentConfig[] = [
  {
    filename: 'Mutual-NDA.md',
    name: 'Mutual Non-Disclosure Agreement',
    description: 'Standard mutual NDA for sharing confidential information between two parties under equal obligations.',
    fields: NDA_FIELDS,
  },
  {
    filename: 'Mutual-NDA-coverpage.md',
    name: 'Mutual NDA Cover Page',
    description: 'Cover page template to accompany the Common Paper Mutual NDA, capturing key deal terms.',
    fields: NDA_FIELDS,
  },
  {
    filename: 'CSA.md',
    name: 'Cloud Service Agreement',
    description: 'Standard agreement for SaaS and cloud-based software products, covering subscription terms, data handling, and service commitments.',
    fields: [
      { key: 'providerName', label: 'Provider', description: 'Company providing the cloud service', type: 'text', required: true, placeholder: 'Acme Corp' },
      { key: 'customerName', label: 'Customer', description: 'Company purchasing the service', type: 'text', required: true, placeholder: 'Globex Inc' },
      { key: 'effectiveDate', label: 'Effective Date', description: 'Date this agreement takes effect', type: 'date', required: true },
      { key: 'governingLaw', label: 'Governing Law', description: 'State whose laws govern this agreement', type: 'text', required: true, placeholder: 'Delaware' },
      { key: 'chosenCourts', label: 'Chosen Courts', description: 'Courts where disputes are resolved', type: 'text', required: true, placeholder: 'Delaware Court of Chancery' },
      { key: 'generalCapAmount', label: 'General Liability Cap', description: 'Maximum total liability', type: 'text', required: true, placeholder: '12 months of fees paid' },
      { key: 'securityPolicy', label: 'Security Policy URL', description: "URL of provider's security policy", type: 'text', required: false, placeholder: 'https://example.com/security' },
    ],
  },
  {
    filename: 'design-partner-agreement.md',
    name: 'Design Partner Agreement',
    description: 'Standard agreement for early-stage product development partnerships where a customer tests pre-release software in exchange for feedback.',
    fields: [
      { key: 'providerName', label: 'Provider', description: 'Company offering the product', type: 'text', required: true },
      { key: 'partnerName', label: 'Partner', description: 'Design partner company name', type: 'text', required: true },
      { key: 'effectiveDate', label: 'Effective Date', description: 'Date this agreement takes effect', type: 'date', required: true },
      { key: 'term', label: 'Term', description: 'Duration of the engagement', type: 'text', required: true, placeholder: '6 months' },
      { key: 'programDescription', label: 'Program Description', description: 'What the partner will test and provide feedback on', type: 'textarea', required: true },
      { key: 'fees', label: 'Fees', description: 'Any fees or compensation involved', type: 'text', required: true, placeholder: '$0 — free access in exchange for feedback' },
      { key: 'governingLaw', label: 'Governing Law', description: 'State whose laws govern this agreement', type: 'text', required: true, placeholder: 'Delaware' },
      { key: 'chosenCourts', label: 'Chosen Courts', description: 'Courts where disputes are resolved', type: 'text', required: true },
    ],
  },
  {
    filename: 'sla.md',
    name: 'Service Level Agreement',
    description: 'Standard SLA defining uptime commitments, measurement methodology, and service credits for failures to meet targets.',
    fields: [
      { key: 'providerName', label: 'Provider', description: 'Company providing the service', type: 'text', required: true },
      { key: 'customerName', label: 'Customer', description: 'Company receiving the service', type: 'text', required: true },
      { key: 'targetUptime', label: 'Target Uptime', description: 'Uptime commitment percentage', type: 'text', required: true, placeholder: '99.9%' },
      { key: 'targetResponseTime', label: 'Target Response Time', description: 'Support response time commitment', type: 'text', required: true, placeholder: '4 business hours' },
      { key: 'supportChannel', label: 'Support Channel', description: 'How customers submit support requests', type: 'text', required: true, placeholder: 'Email at support@example.com' },
      { key: 'uptimeCredit', label: 'Uptime Credit Formula', description: 'Credit formula for uptime failures', type: 'text', required: true, placeholder: '10% of monthly fees per 0.1% below target' },
      { key: 'scheduledDowntime', label: 'Scheduled Downtime Window', description: 'When scheduled maintenance can occur', type: 'text', required: false, placeholder: 'Sundays 2–4am UTC' },
    ],
  },
  {
    filename: 'psa.md',
    name: 'Professional Services Agreement',
    description: 'Standard agreement for consulting and professional services engagements, covering deliverables, IP ownership, and payment terms.',
    fields: [
      { key: 'providerName', label: 'Provider', description: 'Consulting or services company', type: 'text', required: true },
      { key: 'customerName', label: 'Customer', description: 'Company receiving the services', type: 'text', required: true },
      { key: 'effectiveDate', label: 'Effective Date', description: 'Date this agreement takes effect', type: 'date', required: true },
      { key: 'governingLaw', label: 'Governing Law', description: 'State whose laws govern this agreement', type: 'text', required: true, placeholder: 'Delaware' },
      { key: 'chosenCourts', label: 'Chosen Courts', description: 'Courts where disputes are resolved', type: 'text', required: true },
      { key: 'deliverables', label: 'Deliverables', description: 'What the provider will deliver', type: 'textarea', required: true },
      { key: 'fees', label: 'Fees', description: 'Payment amount and structure', type: 'text', required: true, placeholder: '$10,000 fixed fee' },
      { key: 'paymentPeriod', label: 'Payment Period', description: 'When payment is due', type: 'text', required: true, placeholder: 'Net 30 days from invoice' },
      { key: 'insuranceMinimums', label: 'Insurance Minimums', description: 'Required insurance coverage', type: 'text', required: false, placeholder: '$1M general liability' },
    ],
  },
  {
    filename: 'DPA.md',
    name: 'Data Processing Agreement',
    description: 'Standard DPA for GDPR-compliant data handling, defining processor obligations, sub-processor rules, and data subject rights.',
    fields: [
      { key: 'providerName', label: 'Data Processor', description: 'Company processing personal data', type: 'text', required: true },
      { key: 'customerName', label: 'Data Controller', description: 'Company controlling personal data', type: 'text', required: true },
      { key: 'categoriesPersonalData', label: 'Categories of Personal Data', description: 'Types of personal data processed', type: 'textarea', required: true, placeholder: 'Name, email address, IP address' },
      { key: 'categoriesDataSubjects', label: 'Categories of Data Subjects', description: 'Who the data subjects are', type: 'text', required: true, placeholder: 'Employees, end users' },
      { key: 'natureAndPurpose', label: 'Nature and Purpose', description: 'Why and how data is processed', type: 'textarea', required: true, placeholder: 'Providing cloud software services' },
      { key: 'durationProcessing', label: 'Duration of Processing', description: 'How long data is processed', type: 'text', required: true, placeholder: 'For the duration of the service agreement' },
      { key: 'approvedSubprocessors', label: 'Approved Subprocessors', description: 'Third parties who will process data', type: 'text', required: true, placeholder: 'AWS, Stripe, SendGrid' },
      { key: 'governingMemberState', label: 'Governing Member State', description: 'EU member state whose law applies for GDPR SCC purposes', type: 'text', required: false, placeholder: 'Ireland' },
    ],
  },
  {
    filename: 'Software-License-Agreement.md',
    name: 'Software License Agreement',
    description: 'Standard agreement for licensing software products on a perpetual or subscription basis, covering permitted use, restrictions, and warranties.',
    fields: [
      { key: 'providerName', label: 'Provider', description: 'Company licensing the software', type: 'text', required: true },
      { key: 'customerName', label: 'Customer', description: 'Company receiving the license', type: 'text', required: true },
      { key: 'effectiveDate', label: 'Effective Date', description: 'Date this agreement takes effect', type: 'date', required: true },
      { key: 'governingLaw', label: 'Governing Law', description: 'State whose laws govern this agreement', type: 'text', required: true, placeholder: 'Delaware' },
      { key: 'chosenCourts', label: 'Chosen Courts', description: 'Courts where disputes are resolved', type: 'text', required: true },
      { key: 'permittedUses', label: 'Permitted Uses', description: 'How the customer may use the software', type: 'textarea', required: true, placeholder: 'Internal business operations only' },
      { key: 'licenseLimits', label: 'License Limits', description: 'Any limits on use', type: 'text', required: false, placeholder: 'Up to 50 named users' },
      { key: 'generalCapAmount', label: 'General Liability Cap', description: 'Maximum total liability', type: 'text', required: true, placeholder: 'Fees paid in prior 12 months' },
    ],
  },
  {
    filename: 'Partnership-Agreement.md',
    name: 'Partnership Agreement',
    description: 'Standard agreement for business partnerships and referral relationships, covering revenue sharing, responsibilities, and term.',
    fields: [
      { key: 'companyName', label: 'Company', description: 'Primary company name', type: 'text', required: true },
      { key: 'partnerName', label: 'Partner', description: 'Partner company name', type: 'text', required: true },
      { key: 'effectiveDate', label: 'Effective Date', description: 'Date this agreement takes effect', type: 'date', required: true },
      { key: 'governingLaw', label: 'Governing Law', description: 'State whose laws govern this agreement', type: 'text', required: true, placeholder: 'Delaware' },
      { key: 'chosenCourts', label: 'Chosen Courts', description: 'Courts where disputes are resolved', type: 'text', required: true },
      { key: 'obligations', label: 'Obligations', description: 'What each party is responsible for', type: 'textarea', required: true },
      { key: 'territory', label: 'Territory', description: 'Geographic scope of the partnership', type: 'text', required: true, placeholder: 'United States' },
      { key: 'endDate', label: 'End Date', description: 'When the partnership ends', type: 'text', required: false, placeholder: '2027-12-31 or upon termination' },
    ],
  },
  {
    filename: 'Pilot-Agreement.md',
    name: 'Pilot Agreement',
    description: 'Standard agreement for time-limited product trials and evaluations before a full commercial commitment.',
    fields: [
      { key: 'providerName', label: 'Provider', description: 'Company offering the product for pilot', type: 'text', required: true },
      { key: 'customerName', label: 'Customer', description: 'Company evaluating the product', type: 'text', required: true },
      { key: 'effectiveDate', label: 'Effective Date', description: 'Date the pilot starts', type: 'date', required: true },
      { key: 'pilotPeriod', label: 'Pilot Period', description: 'Duration of the pilot', type: 'text', required: true, placeholder: '30 days' },
      { key: 'governingLaw', label: 'Governing Law', description: 'State whose laws govern this agreement', type: 'text', required: true, placeholder: 'Delaware' },
      { key: 'chosenCourts', label: 'Chosen Courts', description: 'Courts where disputes are resolved', type: 'text', required: true },
      { key: 'generalCapAmount', label: 'General Liability Cap', description: 'Maximum total liability', type: 'text', required: false, placeholder: '$10,000' },
    ],
  },
  {
    filename: 'BAA.md',
    name: 'Business Associate Agreement',
    description: 'Standard BAA for HIPAA-compliant sharing and processing of protected health information between covered entities and business associates.',
    fields: [
      { key: 'providerName', label: 'Business Associate', description: 'Company handling PHI as a service provider', type: 'text', required: true },
      { key: 'companyName', label: 'Covered Entity', description: 'Healthcare organization disclosing PHI', type: 'text', required: true },
      { key: 'effectiveDate', label: 'Effective Date', description: 'Date this BAA takes effect', type: 'date', required: true },
      { key: 'limitations', label: 'PHI Use Limitations', description: 'Restrictions on PHI use', type: 'textarea', required: true, placeholder: 'No offshore processing; no de-identification without written approval' },
      { key: 'breachNotificationPeriod', label: 'Breach Notification Period', description: 'Time to notify of a PHI breach', type: 'text', required: true, placeholder: '72 hours' },
    ],
  },
  {
    filename: 'AI-Addendum.md',
    name: 'AI Addendum',
    description: 'Standard addendum to add AI-specific terms (acceptable use, data training opt-outs, output ownership) to existing commercial agreements.',
    fields: [
      { key: 'providerName', label: 'Provider', description: 'Company providing AI-powered services', type: 'text', required: true },
      { key: 'customerName', label: 'Customer', description: 'Company using the AI services', type: 'text', required: true },
      { key: 'trainingData', label: 'Training Data', description: 'What customer data may be used for AI training', type: 'textarea', required: true, placeholder: 'Aggregated, de-identified usage logs only' },
      { key: 'trainingPurposes', label: 'Training Purposes', description: 'Permitted purposes for using data in training', type: 'textarea', required: true, placeholder: 'Improving model accuracy and safety' },
      { key: 'trainingRestrictions', label: 'Training Restrictions', description: 'Constraints on training use', type: 'textarea', required: true, placeholder: 'No training on personally identifiable information' },
      { key: 'improvementRestrictions', label: 'Improvement Restrictions', description: 'Constraints on non-training product improvement', type: 'textarea', required: false },
    ],
  },
];

export function getDocConfig(filename: string): DocumentConfig | undefined {
  return DOCUMENTS.find((d) => d.filename === filename);
}

export function isNDADoc(filename: string): boolean {
  return filename === 'Mutual-NDA.md' || filename === 'Mutual-NDA-coverpage.md';
}
