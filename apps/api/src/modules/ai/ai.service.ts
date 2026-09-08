import { Profile, Community } from '@prisma/client';
import { RecommendationResponse, NavigatorResponseSchema, NavigatorResponse } from '@wasl/contracts';
import { scoreCommunity } from '../recommendations/recommendation.service.js';

export const generateRecommendations = async (
  profile: Profile,
  communities: Community[]
): Promise<RecommendationResponse> => {
  // 1. Deterministic Scoring
  const scored = communities.map(community => ({
    community,
    scoreResult: scoreCommunity(profile, community)
  }));

  // 2. Filter & Sort Candidates
  // Only keep communities with > 0 score and sort descending
  const candidates = scored
    .filter(c => c.scoreResult.score > 0)
    .sort((a, b) => b.scoreResult.score - a.scoreResult.score)
    .slice(0, 10); // Take top 10 as context for AI

  const deterministic = candidates.map(c => ({
    communityId: c.community.id,
    community: c.community,
    score: c.scoreResult,
  }));

  // 3. AI Personalization Boundary
  let aiNavigator: NavigatorResponse | undefined = undefined;
  let errorFallback: string | undefined = undefined;

  try {
    aiNavigator = await callAiProvider(profile, candidates.map(c => c.community));
  } catch (err) {
    console.error('AI Provider failed, falling back to deterministic only', err);
    errorFallback = 'AI Personalization is temporarily unavailable. Displaying best matches.';
  }

  // 4. Verification Boundary (Never trust AI IDs blindly)
  if (aiNavigator) {
    const validIds = new Set(candidates.map(c => c.community.id));
    aiNavigator.nextSteps = aiNavigator.nextSteps.filter(step => {
      if (step.relatedCommunityId && !validIds.has(step.relatedCommunityId)) {
        return false; // Reject step if it hallucinates an ID
      }
      return true;
    });
  }

  return {
    navigator: aiNavigator,
    deterministic,
    error: errorFallback,
  };
};

/**
 * Mocking the AI provider call for the hackathon MVP.
 * In reality, this would use fetch() or an SDK with structured outputs.
 */
async function callAiProvider(profile: Profile, candidates: Community[]): Promise<NavigatorResponse> {
  // Simulating an AI call timeout / delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!process.env.AI_PROVIDER_API_KEY) {
    throw new Error('AI API key not set');
  }

  // MVP: Return mock valid structured output 
  // In reality, you'd send `profile` and `candidates` to OpenAI / Claude and parse the JSON.
  const mockResponse = {
    summary: `Welcome to Istanbul, arriving for your ${profile.arrivalStage}. Here are your personalized next steps based on your interest in ${profile.interests.join(', ')}.`,
    nextSteps: [
      {
        title: "Join a Tech Community",
        description: "Connect with like-minded peers in tech.",
        priority: "High" as const,
        reason: "You mentioned an interest in Software and AI.",
        relatedCommunityId: candidates[0]?.id // Grounded with actual ID
      }
    ]
  };

  // Validate with Zod before returning!
  return NavigatorResponseSchema.parse(mockResponse);
}
