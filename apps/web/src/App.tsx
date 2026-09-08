import React, { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { Shell } from './components/layout/Shell'
import { LandingPage } from './pages/LandingPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PlanPage } from './pages/PlanPage'
import { CommunitiesPage } from './pages/CommunitiesPage'
import { CommunityDetailPage } from './pages/CommunityDetailPage'
import { GuideDetailPage } from './pages/GuideDetailPage'
import { ProfilePage } from './pages/ProfilePage'
import { AiChatWidget } from './components/common/AiChatWidget'

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing')
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null)
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null)

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'community-detail' && param) {
      setSelectedCommunityId(param)
      setCurrentTab('community-detail')
    } else if (tab === 'guide-detail') {
      setSelectedGuideId(param || 'default')
      setCurrentTab('guide-detail')
    } else {
      setCurrentTab(tab)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AuthProvider>
      <Shell currentTab={currentTab} onNavigate={handleNavigate}>
        {currentTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}

        {currentTab === 'onboarding' && (
          <OnboardingPage onComplete={() => handleNavigate('plan')} />
        )}

        {currentTab === 'plan' && <PlanPage onNavigate={handleNavigate} />}

        {currentTab === 'communities' && (
          <CommunitiesPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'community-detail' && selectedCommunityId && (
          <CommunityDetailPage
            communityId={selectedCommunityId}
            onBack={() => handleNavigate('communities')}
          />
        )}

        {currentTab === 'guide-detail' && (
          <GuideDetailPage
            guideId={selectedGuideId}
            onBack={() => handleNavigate('plan')}
          />
        )}

        {currentTab === 'profile' && <ProfilePage onNavigate={handleNavigate} />}

        {/* Global AI Assistant Floating Widget (GPT-4o) */}
        <AiChatWidget onNavigate={handleNavigate} />
      </Shell>
    </AuthProvider>
  )
}

export default App
