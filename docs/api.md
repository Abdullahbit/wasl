# API Reference

Base URL: `/api/v1`

## Health
- `GET /health` - Check if API is running.

## Profiles
- `POST /profile` - Create a new user profile based on onboarding data.
- `GET /profile/:id` - Retrieve a user profile.

## Communities
- `GET /communities` - List available communities.
- `GET /communities/:id` - Get specific community details.

## Resources
- `GET /resources` - List helpful resources.
- `GET /resources/:id` - Get specific resource.

## AI Navigation
- `POST /ai/navigate` - Submit a profile ID to receive an AI-generated personalized roadmap and recommended communities. Validates against deterministic candidates.
