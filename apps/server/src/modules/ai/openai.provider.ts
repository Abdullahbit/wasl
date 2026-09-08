/**
 * Minimal OpenAI-compatible provider for WASL AI Navigator.
 *
 * Server-only, uses AI_PROVIDER_API_KEY. Falls closed when not configured.
 * Treats all provider output as untrusted and validates via Zod in ai.service.
 */

import { Profile } from '@prisma/client';
import { environment } from '../../config/env.js';
import { NAVIGATOR_PROMPT_V1 } from './navigator.prompt.js';
import type { AiCandidate } from './ai.service.js';

export async function createOpenAiNavigator(
  profile: Profile,
  candidates: AiCandidate[],
  signal: AbortSignal,
): Promise<unknown> {
  const apiKey = environment.AI_PROVIDER_API_KEY;
  if (!apiKey) {
    throw new Error('AI_PROVIDER_API_KEY is not configured');
  }

  const model = environment.AI_PROVIDER_MODEL ?? 'gpt-4o-mini';

  const approvedEntities = {
    profile: {
      city: profile.city,
      university: profile.university,
      arrivalStage: profile.arrivalStage,
      turkishLevel: profile.turkishLevel,
      interests: profile.interests,
      goals: profile.goals,
    },
    candidates: candidates.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      category: candidate.category,
      languages: candidate.languages,
      score: candidate.score,
      reasonCodes: candidate.reasonCodes,
    })),
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: NAVIGATOR_PROMPT_V1 },
        { role: 'user', content: JSON.stringify({ APPROVED_ENTITIES: approvedEntities }) },
      ],
      temperature: 0.3,
    }),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`OpenAI error ${response.status}: ${text.slice(0, 500)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty provider response');
  }

  // Provider must return JSON object matching NavigatorResponse
  return JSON.parse(content);
}
