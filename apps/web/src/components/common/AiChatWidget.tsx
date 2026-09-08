import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ChevronDown,
  Minimize2,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Compass,
} from 'lucide-react'
import { askAiAssistant, type ChatMessage } from '../../lib/aiAssistant'
import { useAuth } from '../../context/AuthContext'

interface AiChatWidgetProps {
  onNavigate?: (tab: string, param?: string) => void
}

const QUICK_PROMPTS = [
  'ما هي متطلبات إقامة الطالب (Öğrenci İkamet İzni)؟',
  'كيف أستخرج كرت المواصلات المخفض (İstanbulkart)؟',
  'ما هي أفضل المجتمعات لممارسة التركية وبناء علاقات؟',
  'كيف أفتح حساب بنكي كطالب أجنبي في تركيا؟',
]

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({ onNavigate }) => {
  const { profile } = useAuth()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content:
        'مرحباً بك! أنا «مستشار وصل الذكي» 🌟. كيف يمكنني مساعدتك اليوم في رحلتك الدراسية والاستقرار في تركيا؟ يمكنك سؤالي عن الإقامة، الجامعات، كروت المواصلات، أو ترشيح المجتمعات الأنسب لاهتماماتك.',
      timestamp: 'الآن',
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  // Listen for global custom event to trigger AI assistant from anywhere (e.g. community detail page)
  useEffect(() => {
    const handleOpenAi = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>
      setIsOpen(true)
      if (customEvent.detail?.query) {
        setTimeout(() => {
          handleSend(customEvent.detail.query)
        }, 200)
      }
    }

    window.addEventListener('open_ai_chat', handleOpenAi)
    return () => window.removeEventListener('open_ai_chat', handleOpenAi)
  }, [messages, profile])

  const handleSend = async (queryText?: string) => {
    const text = (queryText || input).trim()
    if (!text || isSending) return

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!queryText) setInput('')
    setIsSending(true)

    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      const reply = await askAiAssistant(text, history, { profile })

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (err: any) {
      console.error('Error getting AI reply:', err)
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'عذراً، حدث خطأ أثناء الاتصال بالمستشار الذكي. يرجى المحاولة مرة أخرى بعد قليل.',
          timestamp: 'الآن',
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            left: '1.75rem',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(15, 118, 110, 0.35)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
          title="تحدث مع مستشار وصل الذكي"
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} />
          </div>
          <span>اسأل مستشار وصل الذكي</span>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '1.5rem',
            zIndex: 70,
            width: 'min(420px, calc(100vw - 3rem))',
            height: 'min(580px, calc(100vh - 4rem))',
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>مستشار وصل الذكي</span>
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.88 }}>
                  مستشارك لجميع إجراءات الدراسة والحياة في تركيا
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.85,
              }}
              title="إغلاق المحادثة"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
              backgroundColor: 'var(--bg)',
            }}
          >
            {messages.map((m) => {
              const isBot = m.role === 'assistant'
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: isBot ? 'row' : 'row-reverse',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isBot ? 'var(--primary-light)' : 'var(--accent)',
                      color: isBot ? 'var(--primary)' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {isBot ? <Sparkles size={14} /> : <User size={14} />}
                  </div>

                  <div
                    style={{
                      maxWidth: '82%',
                      backgroundColor: isBot ? 'var(--surface)' : 'var(--primary)',
                      color: isBot ? 'var(--foreground)' : '#ffffff',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      border: isBot ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    {m.content}
                    <div
                      style={{
                        fontSize: '0.68rem',
                        marginTop: '0.35rem',
                        textAlign: isBot ? 'left' : 'right',
                        opacity: 0.65,
                      }}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              )
            })}

            {isSending && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RefreshCw size={14} className="animate-spin" />
                </div>
                <div
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    padding: '0.55rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem',
                    color: 'var(--muted)',
                  }}
                >
                  جاري صياغة الإجابة الدقيقة...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div
              style={{
                padding: '0.65rem 1rem',
                backgroundColor: 'var(--surface)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '0.4rem',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              {QUICK_PROMPTS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="btn btn-ghost btn-xs"
                  style={{
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--surface-hover)',
                    border: '1px solid var(--border)',
                    padding: '0.25rem 0.65rem',
                    flexShrink: 0,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--surface)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب سؤالك هنا (مثل: أوراق الإقامة، السكن...)"
              disabled={isSending}
              style={{
                flex: 1,
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--foreground)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isSending}
              className="btn btn-primary btn-sm"
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '42px',
              }}
              title="إرسال"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
