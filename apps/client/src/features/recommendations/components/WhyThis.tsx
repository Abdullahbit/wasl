/**
 * Renders the "Why this?" explanation for a recommendation.
 *
 * Uses the backend-provided reason string or reason codes so no fake
 * logic is invented in the frontend. Displayed as an accessible
 * disclosure pattern using the design-system Card.
 */

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';

interface WhyThisProps {
  reason: string;
  reasonCodes?: readonly string[] | undefined;
  breakdown?: Record<string, number> | undefined;
}

function formatReasonCode(code: string, t: ReturnType<typeof useTranslation>['t']): string {
  const map: Record<string, string> = {
    UNIVERSITY_MATCH: t('plan.whyReasons.university'),
    INTEREST_MATCH: t('plan.whyReasons.interest'),
    GOAL_MATCH: t('plan.whyReasons.goal'),
    LANGUAGE_MATCH: t('plan.whyReasons.language'),
    ARRIVAL_MATCH: t('plan.whyReasons.arrival'),
    NEWCOMER_FRIENDLY: t('plan.whyReasons.newcomer'),
  };

  return map[code] ?? code;
}

export function WhyThis({ reason, reasonCodes, breakdown }: WhyThisProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const buttonId = useId();

  return (
    <div className="mt-3">
      <Button
        id={buttonId}
        type="button"
        variant="ghost"
        size="sm"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="h-8 rounded-full border px-3 text-xs"
      >
        {t('plan.whyThis')}
        <span aria-hidden className={cn('ms-1 inline-block transition-transform', isOpen && 'rotate-180')}>
          ⌄
        </span>
      </Button>
      {isOpen ? (
        <Card id={contentId} role="region" aria-labelledby={buttonId} className="mt-2 border-dashed bg-muted/30">
          <CardContent className="p-3 text-sm leading-relaxed text-muted-foreground">
            <p>{reason}</p>
            {reasonCodes && reasonCodes.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {reasonCodes.map((code) => (
                  <li key={code} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {formatReasonCode(code, t)}
                  </li>
                ))}
              </ul>
            ) : null}
            {breakdown && Object.keys(breakdown).length > 0 ? (
              <div className="mt-2 grid gap-1 text-xs">
                {Object.entries(breakdown).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span>{label}</span>
                    <span className="font-medium">+{value}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
