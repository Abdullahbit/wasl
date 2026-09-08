/**
 * Renders the onboarding progress indicator with textual and visual progress.
 *
 * Progress is communicated through both a bar and explicit step counts so
 * it does not rely on color alone.
 */

import { Progress } from '@/components/ui/progress';
import { onboardingSteps } from '../onboardingConstants';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface OnboardingProgressProps {
  currentStepIndex: number;
}

export function OnboardingProgress({ currentStepIndex }: OnboardingProgressProps) {
  const { t, isRtl } = useTranslation();
  const totalSteps = onboardingSteps.length;
  const currentStepNumber = currentStepIndex + 1;
  const progressValue = (currentStepNumber / totalSteps) * 100;

  const translatedStepTitles: Record<string, string> = {
    situation: t('onboarding.steps.situation.title'),
    background: t('onboarding.steps.background.title'),
    interests: t('onboarding.steps.interests.title'),
    goals: t('onboarding.steps.goals.title'),
    review: t('onboarding.steps.review.title'),
  };

  const currentStepTitle = translatedStepTitles[onboardingSteps[currentStepIndex]?.id ?? 'situation'] ?? '';
  const stepSeparator = isRtl ? ' ← ' : ' → ';

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          {t('onboarding.progress.step', { current: String(currentStepNumber), total: String(totalSteps) })}
        </span>
        <span className="text-muted-foreground">{currentStepTitle}</span>
      </div>
      <Progress
        value={progressValue}
        max={100}
        aria-label={t('onboarding.progress.ariaLabel', { current: String(currentStepNumber), total: String(totalSteps) })}
      />
      <ol className="hidden gap-2 sm:flex" aria-label={t('onboarding.progress.stepsLabel')}>
        {onboardingSteps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-primary bg-background text-primary ring-2 ring-primary ring-offset-2',
                  !isCompleted && !isCurrent && 'border-border bg-muted text-muted-foreground',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-xs font-medium lg:inline',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {translatedStepTitles[step.id]}
              </span>
              {index < totalSteps - 1 ? <span className="ms-1 h-px flex-1 bg-border" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-muted-foreground sm:hidden">
        {onboardingSteps.map((step) => translatedStepTitles[step.id]).join(stepSeparator)}
      </p>
    </div>
  );
}
