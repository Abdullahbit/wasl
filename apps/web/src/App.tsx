import React, { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { Shell } from './components/layout/Shell'
import { LandingPage } from './pages/LandingPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PlanPage } from './pages/PlanPage'
import { CommunitiesPage } from './pages/CommunitiesPage'
import { CommunityDetailPage } from './pages/CommunityDetailPage'
import { ProfilePage } from './pages/ProfilePage'

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing')
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null)

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'community-detail' && param) {
      setSelectedCommunityId(param)
      setCurrentTab('community-detail')
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

        {currentTab === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
      </Shell>
    </AuthProvider>
  )
}

export default App
