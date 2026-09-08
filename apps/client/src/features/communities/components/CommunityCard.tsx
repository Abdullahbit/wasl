/**
 * Renders a scannable community summary for discovery grids.
 *
 * Shows the most useful fields (name, category, languages, university
 * relevance, trust badges) and keeps the card lightweight so the details
 * page can hold the full information.
 */

import { Link } from 'react-router-dom';
import type { Community } from '@wasl/contracts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface CommunityCardProps {
  community: Community;
  recommendationReason?: string | undefined;
}

export function CommunityCard({ community, recommendationReason }: CommunityCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{community.category}</Badge>
          {community.verified ? (
            <Badge variant="default">{t('communities.card.verified')}</Badge>
          ) : (
            <Badge variant="outline">{t('communities.card.notVerified')}</Badge>
          )}
          {community.newcomerFriendly ? (
            <Badge variant="outline" className="border-success text-success">
              {t('communities.card.newcomerFriendly')}
            </Badge>
          ) : null}
        </div>
        <CardTitle className="mt-2 line-clamp-2 text-start text-base leading-tight">{community.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground text-start">{community.description || t('communities.details.noDescription')}</p>
        <div className="flex flex-wrap gap-1.5">
          {community.languages.map((language) => (
            <Badge key={language} variant="outline" className="text-xs">
              {language}
            </Badge>
          ))}
        </div>
        {community.universities.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">{t('communities.card.university')}:</span> {community.universities.slice(0, 2).join(', ')}
            {community.universities.length > 2 ? ` +${community.universities.length - 2}` : ''}
          </p>
        ) : null}
        {recommendationReason ? (
          <p className="rounded-lg bg-muted p-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium">{t('communities.details.recommendationContext')}:</span> {recommendationReason}
          </p>
        ) : null}
        <div className="mt-auto flex gap-2 pt-2">
          <Button asChild size="sm" className="rounded-full">
            <Link
              to={`/communities/${community.id}`}
              state={recommendationReason ? { recommendationReason } : undefined}
            >
              {t('communities.card.viewDetails')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
