import Anthropic from '@anthropic-ai/sdk'
import { InternalError } from '../../shared/errors/AppError.js'

export interface AiCompleteOptions {
  maxTokens?: number
  timeoutMs?: number
}

export interface AiProvider {
  complete(systemPrompt: string, userPrompt: string, options?: AiCompleteOptions): Promise<string>
}

export interface AiProviderConfig {
  provider: 'anthropic' | 'openai'
  apiKey: string | undefined
  model: string
}

const DEFAULT_MAX_TOKENS = 1024
const DEFAULT_TIMEOUT_MS = 10_000

/**
 * Anthropic-backed AI provider. The API key never leaves the server process —
 * it is only used to construct the SDK client, and the client/response is
 * never returned to callers verbatim.
 */
export class AnthropicProvider implements AiProvider {
  private readonly client: Anthropic
  private readonly model: string

  constructor(apiKey: string, model: string) {
    this.client = new Anthropic({ apiKey })
    this.model = model
  }

  async complete(systemPrompt: string, userPrompt: string, options?: AiCompleteOptions): Promise<string> {
    const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS
    const maxTokens = options?.maxTokens ?? DEFAULT_MAX_TOKENS

    try {
      const response = await this.client.messages.create(
        {
          model: this.model,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        },
        { timeout: timeoutMs },
      )

      const block = response.content[0]
      if (!block || block.type !== 'text') {
        throw new InternalError('AI provider returned an empty response')
      }
      return block.text
    } catch (err) {
      if (err instanceof InternalError) {
        throw err
      }
      throw new InternalError('AI provider request failed')
    }
  }
}

/**
 * Stub OpenAI provider — not implemented for the hackathon build. Present so the
 * factory has a real branch to switch on and so the interface is provider-agnostic.
 */
export class OpenAiProvider implements AiProvider {
  constructor(_apiKey: string, _model: string) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async complete(_systemPrompt: string, _userPrompt: string, _options?: AiCompleteOptions): Promise<string> {
    throw new InternalError('OpenAI provider is not implemented')
  }
}

export function createAiProvider(config: AiProviderConfig): AiProvider {
  if (!config.apiKey) {
    throw new InternalError('AI provider is not configured')
  }

  switch (config.provider) {
    case 'anthropic':
      return new AnthropicProvider(config.apiKey, config.model)
    case 'openai':
      return new OpenAiProvider(config.apiKey, config.model)
    default:
      throw new InternalError(`Unsupported AI provider: ${String(config.provider)}`)
  }
}
