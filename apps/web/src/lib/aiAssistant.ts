/**
 * AI Assistant Service for Wasl (وصل)
 * Powered by llmapi.ai (gpt-4o / gpt-4o-mini)
 * Provides real-time guidance, advice, translation, and community/settlement recommendations
 * for Arab international students and newcomers in Türkiye.
 */

import type { ApiProfile, ApiCommunity } from './api'

const LLM_API_URL = 'https://api.llmapi.ai/v1/chat/completions'
const LLM_API_KEY = 'llmapi_12098ea79a5e63da86df7b962a2335b63ba92adcc9fb7d80750bd50a2fe7ebd6'
const DEFAULT_MODEL = 'gpt-4o' // or 'gpt-4o-mini'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface AssistantContext {
  profile?: ApiProfile | null
  currentCommunity?: ApiCommunity | null
}

function buildSystemPrompt(context?: AssistantContext): string {
  let prompt = `أنت "مستشار وصل الذكي" (Wasl AI Navigator)، المساعد والمستشار المتخصص للطلاب والمغتربين العرب في الجمهورية التركية.
دورك:
1. الإجابة بدقة ووضوح وبلهجة دافئة ومشجعة على استفسارات الطلاب حول:
   - الإقامة الطلابية والأوراق الرسمية (GÖÇ، الموعد، التأمين الصحي، قيد الطالب Öğrenci Belgesi).
   - بطاقة المواصلات المخفضة (İstanbulkart)، السكن الطلابي (KYK والسكن الخاص)، وفتح الحسابات البنكية.
   - تعلم اللغة التركية والاندماج الأكاديمي والاجتماعي.
   - توجيه الطالب للمجتمعات الطلابية والمهنية المناسبة حسب اهتماماته.
2. التحدث باللغة العربية الفصحى الواضحة والودودة، مع توضيح المصطلحات التركية الرسمية بين قوسين لتسهيل تعامل الطالب في الدوائر الحكومية والجامعة.
3. التنسيق الجذاب والمنظم باستخدام النقاط والعناوين الفرعية لتسهيل القراءة.`

  if (context?.profile) {
    const p = context.profile
    prompt += `\n\nمعلومات الطالب الحالي:`
    if (p.currentCity) prompt += `\n- المدينة الحالية: ${p.currentCity}`
    if (p.originCountry) prompt += `\n- بلد الأصل: ${p.originCountry}`
    if (p.languages && p.languages.length > 0) prompt += `\n- اللغات: ${p.languages.join(', ')}`
    if (p.interests && p.interests.length > 0) prompt += `\n- الاهتمامات: ${p.interests.join(', ')}`
    if (p.goals) prompt += `\n- الأهداف: ${p.goals}`
  }

  if (context?.currentCommunity) {
    const c = context.currentCommunity
    prompt += `\n\nالمجتمع الذي يتصفحه الطالب حالياً:
- اسم المجتمع: ${c.name}
- الوصف: ${c.description}
- الفئة: ${c.category?.name || 'عام'}
- اللغات: ${c.languages.map((l) => l.name).join(', ')}`
  }

  return prompt
}

export async function askAiAssistant(
  userQuery: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  context?: AssistantContext,
  model: string = DEFAULT_MODEL
): Promise<string> {
  const systemMessage = {
    role: 'system',
    content: buildSystemPrompt(context),
  }

  // Take the last 6 messages to preserve token context efficiently
  const recentHistory = history.slice(-6).map((m) => ({
    role: m.role,
    content: m.content,
  }))

  const messages = [
    systemMessage,
    ...recentHistory,
    { role: 'user', content: userQuery },
  ]

  try {
    const response = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 900,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('LLM API error response:', errText)
      throw new Error(`خطأ من خادم الذكاء الاصطناعي (${response.status})`)
    }

    const json = await response.json()
    const reply = json.choices?.[0]?.message?.content
    if (!reply) {
      throw new Error('لم يتم استلام استجابة صالحة من النموذج')
    }

    return reply
  } catch (error: any) {
    console.error('AI Navigator service exception:', error)
    // If gpt-4o had any rate or connection issue, fall back to gpt-4o-mini gracefully
    if (model !== 'gpt-4o-mini') {
      console.log('Retrying with gpt-4o-mini fallback...')
      return askAiAssistant(userQuery, history, context, 'gpt-4o-mini')
    }
    throw error
  }
}
