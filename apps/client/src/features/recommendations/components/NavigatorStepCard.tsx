/**
 * Renders a single AI-generated next step with title, description, and Why This.
 *
 * Each step is grounded in deterministic candidates and includes backend-provided
 * reasoning. The card uses design-system primitives and supports RTL via logical
 * properties.
 */

import { Link } from 'react-router-dom';
import type { AIRecommendationStep } from '@wasl/contracts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WhyThis } from './WhyThis';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface NavigatorStepCardProps {
  step: AIRecommendationStep;
  index: number;
}

function getPriorityVariant(priority: AIRecommendationStep['priority']): 'default' | 'secondary' | 'outline' {
  if (priority === 'High') return 'default';
  if (priority === 'Medium') return 'secondary';
  return 'outline';
}

export function NavigatorStepCard({ step, index }: NavigatorStepCardProps) {
  const { t } = useTranslation();
  const stepNumber = String(index + 1).padStart(2, '0');

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {stepNumber}
            </span>
            <Badge variant={getPriorityVariant(step.priority)}>{step.priority}</Badge>
          </div>
          {step.relatedCommunityId ? (
            <Button asChild variant="ghost" size="sm" className="h-7 rounded-full">
              <Link to={`/communities/${step.relatedCommunityId}`} state={{ recommendationReason: step.reason }}>
                {t('communities.card.viewDetails')}
              </Link>
            </Button>
          ) : step.relatedResourceId ? (
            <Badge variant="outline">{step.relatedResourceId.slice(0, 8)}</Badge>
          ) : null}
        </div>
        <CardTitle className="mt-3 text-base leading-tight text-start">{step.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 pt-0">
        <p className="text-sm leading-relaxed text-muted-foreground text-start">{step.description}</p>
        <WhyThis reason={step.reason} />
        {step.relatedCommunityId ? (
          <div className="mt-2 flex gap-2">
            <Button asChild size="sm" className="rounded-full">
              <Link to={`/communities/${step.relatedCommunityId}`} state={{ recommendationReason: step.reason }}>
                {t('communities.card.viewDetails')}
              </Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
