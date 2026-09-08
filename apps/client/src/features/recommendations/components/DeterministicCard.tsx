/**
 * Renders a deterministic community recommendation with trust indicators and Why This.
 *
 * Used as fallback when AI navigator is unavailable. The score breakdown and
 * reason codes come directly from the backend recommendation engine.
 */

import { Link } from 'react-router-dom';
import type { DeterministicRecommendation } from '@wasl/contracts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WhyThis } from './WhyThis';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface DeterministicCardProps {
  recommendation: DeterministicRecommendation;
}

export function DeterministicCard({ recommendation }: DeterministicCardProps) {
  const { t } = useTranslation();
  const { community, score } = recommendation;
  const reasonText = Object.keys(score.breakdown).join(', ') || t('plan.deterministicTitle');

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{community.category}</Badge>
          {community.verified ? (
            <Badge variant="default">{t('communities.card.verified')}</Badge>
          ) : (
            <Badge variant="outline">{t('communities.card.notVerified')}</Badge>
          )}
          {community.newcomerFriendly ? <Badge variant="outline">{t('communities.card.newcomerFriendly')}</Badge> : null}
        </div>
        <CardTitle className="mt-2 line-clamp-2 text-base leading-tight text-start">{community.name}</CardTitle>
        <p className="text-xs text-muted-foreground">Score {score.score}/100</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground text-start">{community.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {community.languages.map((language) => (
            <Badge key={language} variant="outline" className="text-xs">
              {language}
            </Badge>
          ))}
        </div>
        <WhyThis reason={reasonText} reasonCodes={score.reasonCodes} breakdown={score.breakdown} />
        <div className="mt-auto flex gap-2 pt-2">
          <Button asChild size="sm" className="rounded-full">
            <Link to={`/communities/${community.id}`} state={{ recommendationReason: reasonText }}>
              {t('communities.card.viewDetails')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
