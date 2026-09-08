# Recommendation Engine

The engine is primarily deterministic to ensure correctness and testability before passing data to the AI.

## Scoring Model
Each community is evaluated against a profile using the following weights:
- **University Match**: +30
- **Interest Match**: +25
- **Goal Match**: +20
- **Language Match**: +10
- **Arrival Stage Match**: +10
- **Newcomer Friendly**: +5

**Maximum possible score**: 100

## Process
1. Compute scores for all communities against the user's profile.
2. Filter out any community with a score of 0.
3. Sort descending by score.
4. Pass the top N candidates to the AI for personalization and summarization.
