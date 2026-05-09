import json
import os

from fastapi import APIRouter
from litellm import acompletion
from pydantic import BaseModel

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

CATALOG_SUMMARY = """Supported document types:
- Mutual Non-Disclosure Agreement: Standard mutual NDA between two parties
- Cloud Service Agreement: SaaS/cloud service subscription agreement
- Design Partner Agreement: Early-stage product testing partnership
- Service Level Agreement: Uptime commitments and service credits
- Professional Services Agreement: Consulting and professional services
- Data Processing Agreement: GDPR-compliant data handling
- Software License Agreement: Software licensing
- Partnership Agreement: Business partnerships and referral relationships
- Pilot Agreement: Time-limited product trial and evaluation
- Business Associate Agreement: HIPAA-compliant PHI sharing
- AI Addendum: AI-specific terms for existing agreements"""

_NDA_FIELDS = [
    {"key": "purpose", "description": "How confidential information may be used (e.g. 'Evaluating a potential business partnership')"},
    {"key": "effectiveDate", "description": "Date the MNDA takes effect (format: YYYY-MM-DD)"},
    {"key": "mndaTermType", "description": "'expires' (MNDA expires after N years) or 'until_terminated' (continues until terminated)"},
    {"key": "mndaTermYears", "description": "Number of years the MNDA lasts (only when mndaTermType is 'expires')"},
    {"key": "confidentialityType", "description": "'years' (confidentiality lasts N years) or 'perpetuity' (lasts forever)"},
    {"key": "confidentialityYears", "description": "Number of years for confidentiality (only when confidentialityType is 'years')"},
    {"key": "governingLaw", "description": "State whose laws govern this agreement (e.g. 'Delaware')"},
    {"key": "jurisdiction", "description": "Courts where disputes are resolved (e.g. 'New Castle, DE')"},
    {"key": "party1Name", "description": "Full name of Party 1 signer"},
    {"key": "party1Title", "description": "Job title of Party 1 signer"},
    {"key": "party1Company", "description": "Company of Party 1"},
    {"key": "party1Address", "description": "Email or postal address for Party 1 notices"},
    {"key": "party2Name", "description": "Full name of Party 2 signer"},
    {"key": "party2Title", "description": "Job title of Party 2 signer"},
    {"key": "party2Company", "description": "Company of Party 2"},
    {"key": "party2Address", "description": "Email or postal address for Party 2 notices"},
]

DOC_FIELDS: dict[str, list[dict]] = {
    "Mutual-NDA.md": _NDA_FIELDS,
    "Mutual-NDA-coverpage.md": _NDA_FIELDS,
    "CSA.md": [
        {"key": "providerName", "description": "Company providing the cloud service"},
        {"key": "customerName", "description": "Company purchasing the cloud service"},
        {"key": "effectiveDate", "description": "Date this agreement takes effect (format: YYYY-MM-DD)"},
        {"key": "governingLaw", "description": "State whose laws govern this agreement (e.g. 'Delaware')"},
        {"key": "chosenCourts", "description": "Courts where disputes are resolved (e.g. 'Delaware Court of Chancery')"},
        {"key": "generalCapAmount", "description": "Maximum total liability (e.g. '12 months of fees paid')"},
        {"key": "securityPolicy", "description": "URL of provider's security policy"},
    ],
    "design-partner-agreement.md": [
        {"key": "providerName", "description": "Company offering the product"},
        {"key": "partnerName", "description": "Design partner company name"},
        {"key": "effectiveDate", "description": "Date this agreement takes effect (format: YYYY-MM-DD)"},
        {"key": "term", "description": "Duration of the engagement (e.g. '6 months', '1 year')"},
        {"key": "programDescription", "description": "Description of the program and what the partner will test"},
        {"key": "fees", "description": "Any fees or compensation involved (e.g. '$0 - free access')"},
        {"key": "governingLaw", "description": "State whose laws govern this agreement"},
        {"key": "chosenCourts", "description": "Courts where disputes are resolved"},
    ],
    "sla.md": [
        {"key": "providerName", "description": "Company providing the service"},
        {"key": "customerName", "description": "Company receiving the service"},
        {"key": "targetUptime", "description": "Uptime commitment percentage (e.g. '99.9%')"},
        {"key": "targetResponseTime", "description": "Support response time commitment (e.g. '4 business hours')"},
        {"key": "supportChannel", "description": "How customers submit support requests (e.g. 'email at support@example.com')"},
        {"key": "uptimeCredit", "description": "Credit formula for uptime failures (e.g. '10% of monthly fees per 0.1% below target')"},
        {"key": "scheduledDowntime", "description": "When scheduled maintenance can occur (e.g. 'Sundays 2-4am UTC')"},
    ],
    "psa.md": [
        {"key": "providerName", "description": "Consulting/services company"},
        {"key": "customerName", "description": "Company receiving the services"},
        {"key": "effectiveDate", "description": "Date this agreement takes effect (format: YYYY-MM-DD)"},
        {"key": "governingLaw", "description": "State whose laws govern this agreement"},
        {"key": "chosenCourts", "description": "Courts where disputes are resolved"},
        {"key": "deliverables", "description": "What the provider will deliver (e.g. 'API integration, technical documentation')"},
        {"key": "fees", "description": "Payment amount and structure (e.g. '$10,000 fixed fee' or '$200/hour')"},
        {"key": "paymentPeriod", "description": "When payment is due (e.g. 'Net 30 days from invoice')"},
        {"key": "insuranceMinimums", "description": "Required insurance coverage (e.g. '$1M general liability')"},
    ],
    "DPA.md": [
        {"key": "providerName", "description": "Data Processor — company processing personal data"},
        {"key": "customerName", "description": "Data Controller — company controlling personal data"},
        {"key": "categoriesPersonalData", "description": "Types of personal data processed (e.g. 'name, email, IP address')"},
        {"key": "categoriesDataSubjects", "description": "Who the data subjects are (e.g. 'employees, end users')"},
        {"key": "natureAndPurpose", "description": "Why and how data is processed (e.g. 'Providing cloud software services')"},
        {"key": "durationProcessing", "description": "How long data is processed (e.g. 'For the duration of the service agreement')"},
        {"key": "approvedSubprocessors", "description": "Third parties who will process data (e.g. 'AWS, Stripe, SendGrid')"},
        {"key": "governingMemberState", "description": "EU member state whose law applies for GDPR SCC purposes"},
    ],
    "Software-License-Agreement.md": [
        {"key": "providerName", "description": "Company licensing the software"},
        {"key": "customerName", "description": "Company receiving the license"},
        {"key": "effectiveDate", "description": "Date this agreement takes effect (format: YYYY-MM-DD)"},
        {"key": "governingLaw", "description": "State whose laws govern this agreement"},
        {"key": "chosenCourts", "description": "Courts where disputes are resolved"},
        {"key": "permittedUses", "description": "How the customer may use the software (e.g. 'Internal business operations only')"},
        {"key": "licenseLimits", "description": "Limits on use (e.g. 'Up to 50 named users')"},
        {"key": "generalCapAmount", "description": "Maximum total liability"},
    ],
    "Partnership-Agreement.md": [
        {"key": "companyName", "description": "Primary company name"},
        {"key": "partnerName", "description": "Partner company name"},
        {"key": "effectiveDate", "description": "Date this agreement takes effect (format: YYYY-MM-DD)"},
        {"key": "governingLaw", "description": "State whose laws govern this agreement"},
        {"key": "chosenCourts", "description": "Courts where disputes are resolved"},
        {"key": "obligations", "description": "What each party is responsible for in the partnership"},
        {"key": "territory", "description": "Geographic scope of the partnership (e.g. 'United States', 'Worldwide')"},
        {"key": "endDate", "description": "When the partnership ends (e.g. '2026-12-31' or 'upon termination')"},
    ],
    "Pilot-Agreement.md": [
        {"key": "providerName", "description": "Company offering the product for pilot"},
        {"key": "customerName", "description": "Company evaluating the product"},
        {"key": "effectiveDate", "description": "Date the pilot starts (format: YYYY-MM-DD)"},
        {"key": "pilotPeriod", "description": "Duration of the pilot (e.g. '30 days', '3 months')"},
        {"key": "governingLaw", "description": "State whose laws govern this agreement"},
        {"key": "chosenCourts", "description": "Courts where disputes are resolved"},
        {"key": "generalCapAmount", "description": "Maximum total liability"},
    ],
    "BAA.md": [
        {"key": "providerName", "description": "Business Associate — company handling PHI as a service provider"},
        {"key": "companyName", "description": "Covered Entity — healthcare organization disclosing PHI"},
        {"key": "effectiveDate", "description": "Date this BAA takes effect (format: YYYY-MM-DD)"},
        {"key": "limitations", "description": "Restrictions on PHI use (e.g. 'No offshore processing; no de-identification without written approval')"},
        {"key": "breachNotificationPeriod", "description": "Time to notify of a PHI breach (e.g. '72 hours', '5 business days')"},
    ],
    "AI-Addendum.md": [
        {"key": "providerName", "description": "Company providing AI-powered services"},
        {"key": "customerName", "description": "Company using the AI services"},
        {"key": "trainingData", "description": "What customer data may be used for AI training (e.g. 'Aggregated, de-identified usage logs only')"},
        {"key": "trainingPurposes", "description": "Permitted purposes for using data in training (e.g. 'Improving model accuracy and safety')"},
        {"key": "trainingRestrictions", "description": "Constraints on training use (e.g. 'No training on personally identifiable information')"},
        {"key": "improvementRestrictions", "description": "Constraints on non-training product improvement"},
    ],
}

DOC_NAMES: dict[str, str] = {
    "Mutual-NDA.md": "Mutual Non-Disclosure Agreement",
    "Mutual-NDA-coverpage.md": "Mutual NDA Cover Page",
    "CSA.md": "Cloud Service Agreement",
    "design-partner-agreement.md": "Design Partner Agreement",
    "sla.md": "Service Level Agreement",
    "psa.md": "Professional Services Agreement",
    "DPA.md": "Data Processing Agreement",
    "Software-License-Agreement.md": "Software License Agreement",
    "Partnership-Agreement.md": "Partnership Agreement",
    "Pilot-Agreement.md": "Pilot Agreement",
    "BAA.md": "Business Associate Agreement",
    "AI-Addendum.md": "AI Addendum",
}


def build_system_prompt(document_type: str, fields_json: str) -> str:
    doc_name = DOC_NAMES.get(document_type, document_type)
    fields = DOC_FIELDS.get(document_type, [])
    field_list = "\n".join(f"- {f['key']}: {f['description']}" for f in fields)

    return f"""You are a helpful legal assistant guiding a user through filling out a {doc_name}.

Have a natural conversation to gather all required information. Ask about one topic at a time. Be friendly and explain each field clearly.

If there are no prior messages, greet the user warmly, briefly explain what you will help them do, and ask your first question.

Fields to collect:
{field_list}

Current field values (focus on collecting missing/empty ones):
{fields_json}

If the user asks for a document type not listed above, explain that it is not currently supported and suggest the closest match from:
{CATALOG_SUMMARY}

If any fields are still empty after your reply, always end your message with a question about the next empty field.
When all fields are filled, tell the user their document is ready and they can download or print it.

Always respond with a JSON object:
- "message": your conversational reply
- "fields": object with field updates (null for fields not being updated this turn)
"""


class AIResponse(BaseModel):
    message: str
    fields: dict


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    fields: dict
    document_type: str = "Mutual-NDA.md"


router = APIRouter()


@router.post("/api/chat", response_model=AIResponse)
async def chat(request: ChatRequest) -> AIResponse:
    system_content = build_system_prompt(
        request.document_type,
        json.dumps(request.fields, indent=2),
    )
    messages = [{"role": "system", "content": system_content}] + [
        {"role": m.role, "content": m.content} for m in request.messages
    ]

    response = await acompletion(
        model=MODEL,
        messages=messages,
        response_format=AIResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
        api_key=os.environ.get("OPENROUTER_API_KEY"),
    )

    return AIResponse.model_validate_json(response.choices[0].message.content)
