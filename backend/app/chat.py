import json
import os
from typing import Literal, Optional

from fastapi import APIRouter
from litellm import acompletion
from pydantic import BaseModel

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a helpful legal assistant guiding a user through filling out a Mutual Non-Disclosure Agreement (MNDA).

Have a natural conversation to gather all required information. Ask about one topic at a time. Be friendly and explain each field clearly.

If there are no prior messages, greet the user warmly, briefly explain what you will help them do, and ask your first question.

Fields to collect:
- purpose: How confidential information may be used (e.g. "Evaluating a potential business partnership")
- effectiveDate: The date the MNDA takes effect (format: YYYY-MM-DD)
- mndaTermType: "expires" (MNDA expires after N years) or "until_terminated" (continues until either party terminates)
- mndaTermYears: Number of years the MNDA lasts (only when mndaTermType is "expires")
- confidentialityType: "years" (confidentiality lasts N years) or "perpetuity" (lasts forever)
- confidentialityYears: Number of years for confidentiality (only when confidentialityType is "years")
- governingLaw: State whose laws govern this agreement (e.g. "Delaware")
- jurisdiction: Courts where disputes are resolved (e.g. "New Castle, DE")
- party1Name, party1Title, party1Company, party1Address: Details for Party 1 signer
- party2Name, party2Title, party2Company, party2Address: Details for Party 2 signer

Current field values (focus on collecting missing/empty ones):
{fields_json}

Always respond with a JSON object:
- "message": your conversational reply
- "fields": object with field updates (null for fields not being updated this turn)
"""


class FieldUpdate(BaseModel):
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[Literal["expires", "until_terminated"]] = None
    mndaTermYears: Optional[int] = None
    confidentialityType: Optional[Literal["years", "perpetuity"]] = None
    confidentialityYears: Optional[int] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None
    party1Name: Optional[str] = None
    party1Title: Optional[str] = None
    party1Company: Optional[str] = None
    party1Address: Optional[str] = None
    party2Name: Optional[str] = None
    party2Title: Optional[str] = None
    party2Company: Optional[str] = None
    party2Address: Optional[str] = None


class AIResponse(BaseModel):
    message: str
    fields: FieldUpdate


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    fields: dict


router = APIRouter()


@router.post("/api/chat", response_model=AIResponse)
async def chat(request: ChatRequest) -> AIResponse:
    system_content = SYSTEM_PROMPT.format(fields_json=json.dumps(request.fields, indent=2))
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
