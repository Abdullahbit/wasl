import React, { useEffect, useState } from 'react'
import { Search, Filter, RotateCcw, ShieldCheck, Users } from 'lucide-react'
import { communitiesApi, type ApiCommunity } from '../lib/api'
import { CommunityCard } from '../components/community/CommunityCard'
import { WhyThisModal } from '../components/community/WhyThisModal'
import { useAuth } from '../context/AuthContext'
import { translate } from '../lib/translations'

import { SEEDED_COMMUNITIES_PREVIEW } from '../lib/seededFallback'
import { communityStore } from '../lib/communityStore'

interface CommunitiesPageProps {
  onNavigate: (tab: string, param?: string) => void
}

export const CommunitiesPage: React.FC<CommunitiesPageProps> = ({ onNavigate }) => {
  const { profile } = useAuth()
  
  // Helper to get formatted community created profiles
  const getCreatedCommunities = (): ApiCommunity[] => {
    return communityStore.getAllCommunityCreated().map((c) => ({
      id: c.id,
      name: c.communityName,
      slug: c.communityName.toLowerCase().replace(/\s+/g, '-'),
      description: c.shortDescription || c.fullDescription,
      category: {
        id: c.categoryId,
        name: c.categoryName,
        slug: c.categoryId,
      },
      languages: c.languages,
      interests: c.interests,
      city: c.city,
      location: c.location || null,
      targetAudience: c.targetAudience,
      contactEmail: c.contactEmail,
      websiteUrl: c.websiteUrl || null,
      joinUrl: c.joinUrl || null,
      logoUrl: c.logoUrl || null,
      isNewcomerFriendly: c.isNewcomerFriendly,
      isVerified: c.verificationStatus === 'VERIFIED',
      verificationStatus: c.verificationStatus,
      memberCount: c.memberCount || 1,
      activeInitiatives: 1,
      matchScore: 94,
      matchReasons: ['مجتمع جديد تم إضافته حديثاً في وصل'],
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))
  }

  // Immediate render with seeded + communityStore profiles
  const initialMerged = [...getCreatedCommunities(), ...SEEDED_COMMUNITIES_PREVIEW]
  const [communities, setCommunities] = useState<ApiCommunity[]>(initialMerged)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedInterest, setSelectedInterest] = useState<string>('')
  const [totalCount, setTotalCount] = useState<number>(initialMerged.length)

  // Why this modal state
  const [activeWhyCommunity, setActiveWhyCommunity] = useState<ApiCommunity | null>(null)

  const categories = [
    { id: '', label: 'جميع التصنيفات' },
    { id: 'cat_student_community', label: 'مجتمع طلابي وأكاديمي' },
    { id: 'cat_immigration_support', label: 'الدعم القانوني والهجرة' },
    { id: 'cat_professional_development', label: 'التطوير المهني والعمل' },
    { id: 'cat_social_integration', label: 'الاندماج الاجتماعي والأنشطة' },
  ]

  const languages = [
    { id: '', label: 'جميع اللغات' },
    { id: 'lang_arabic', label: 'العربية' },
    { id: 'lang_turkish', label: 'التركية' },
    { id: 'lang_english', label: 'الإنجليزية' },
  ]

  const interests = [
    { id: '', label: 'جميع الاهتمامات' },
    { id: 'int_employment', label: 'التوظيف وفرص العمل' },
    { id: 'int_networking', label: 'بناء الشبكات والعلاقات' },
    { id: 'int_language_learning', label: 'ممارسة وتعلم اللغات' },
    { id: 'int_cultural_events', label: 'الفعاليات الثقافية' },
    { id: 'int_legal_aid', label: 'المساعدة القانونية' },
    { id: 'int_housing', label: 'السكن والإقامة' },
  ]

  const loadCommunities = async (showSkeleton = false) => {
    if (showSkeleton) setIsLoading(true)
    const userCreated = getCreatedCommunities()
    try {
      const res = await communitiesApi.list({
        search: search || undefined,
        categoryId: selectedCategory || undefined,
        languageId: selectedLanguage || undefined,
        interestId: selectedInterest || undefined,
        limit: 50,
      })
      const apiData = res.data && res.data.length > 0 ? res.data : SEEDED_COMMUNITIES_PREVIEW
      
      // Filter userCreated if filters are active
      let filteredCreated = userCreated
      if (search) {
        const s = search.toLowerCase()
        filteredCreated = filteredCreated.filter(
          (c) => c.name.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
        )
      }
      if (selectedCategory) {
        filteredCreated = filteredCreated.filter((c) => c.category?.id === selectedCategory)
      }

      // Merge: unique by ID, created profiles first
      const seen = new Set<string>()
      const merged: ApiCommunity[] = []
      for (const item of [...filteredCreated, ...apiData]) {
        if (!seen.has(item.id)) {
          seen.add(item.id)
          merged.push(item)
        }
      }

      setCommunities(merged)
      setTotalCount(merged.length)
    } catch (err) {
      console.error('Failed to load communities:', err)
      setCommunities([...userCreated, ...SEEDED_COMMUNITIES_PREVIEW])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // If active filters or search are set, show skeleton while fetching, otherwise revalidate in background
    const hasFilter = Boolean(search || selectedCategory || selectedLanguage || selectedInterest)
    loadCommunities(hasFilter)
  }, [selectedCategory, selectedLanguage, selectedInterest])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadCommunities()
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setSelectedLanguage('')
    setSelectedInterest('')
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBlock: '2.5rem' }}>
      {/* Title & Introduction */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.4rem' }}>
          اكتشف مجتمعك
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--muted)', maxWidth: '650px' }}>
          ابحث عن المجتمعات التي تناسب اهتماماتك وأهدافك ومكانك في تركيا، وتواصل معها مباشرة.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          backgroundColor: 'var(--surface)',
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Search bar row */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="ابحث باسم المجتمع أو الوصف (مثال: برمجيات، محامين، لغات)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingInlineStart: '2.5rem' }}
              />
              <Search
                size={18}
                color="var(--muted)"
                style={{
                  position: 'absolute',
                  insetInlineStart: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm" style={{ paddingInline: '1.5rem' }}>
              بحث
            </button>
          </div>

          {/* Dropdown Filters row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
            >
              {interests.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>

            {(search || selectedCategory || selectedLanguage || selectedInterest) && (
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--muted)', gap: '0.35rem', justifySelf: 'start' }}
              >
                <RotateCcw size={14} />
                <span>مسح الفلاتر</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--muted)',
        }}
      >
        <span>
          عرض <strong>{communities.length}</strong> مجتمع من أصل {totalCount}
        </span>
      </div>

      {/* Communities Grid */}
      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="card skeleton" style={{ height: '260px' }} />
          ))}
        </div>
      ) : communities.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            backgroundColor: 'var(--surface)',
          }}
        >
          <Users size={40} color="var(--muted-light)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            لم نجد مجتمعات مطابقة للبحث
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
            جرب تعديل خيارات التصفية أو مسح كلمات البحث لعرض المزيد.
          </p>
          <button onClick={resetFilters} className="btn btn-secondary btn-sm" style={{ margin: '0 auto' }}>
            مسح جميع الفلاتر
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {communities.map((comm) => (
            <CommunityCard
              key={comm.id}
              community={comm}
              onViewDetails={(id) => onNavigate('community-detail', id)}
              onWhyThis={(community) => setActiveWhyCommunity(community)}
            />
          ))}
        </div>
      )}

      {/* Why This Explanation Modal */}
      <WhyThisModal
        community={activeWhyCommunity}
        profile={profile}
        isOpen={!!activeWhyCommunity}
        onClose={() => setActiveWhyCommunity(null)}
        onOpenCommunity={(id) => onNavigate('community-detail', id)}
      />
    </div>
  )
}
