/**
 * Renders the guided onboarding page that collects and submits a newcomer profile.
 *
 * This page coordinates the visual steps and delegates all workflow logic,
 * validation, and submission to the onboarding hook so business logic stays
 * separate from presentation and remains easy to test.
 */

import type { ProfileInput } from '@wasl/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BackgroundStep } from '@/features/onboarding/components/BackgroundStep';
import { GoalsStep } from '@/features/onboarding/components/GoalsStep';
import { InterestsStep } from '@/features/onboarding/components/InterestsStep';
import { OnboardingProgress } from '@/features/onboarding/components/OnboardingProgress';
import { ReviewStep } from '@/features/onboarding/components/ReviewStep';
import { SituationStep } from '@/features/onboarding/components/SituationStep';
import { onboardingSteps } from '@/features/onboarding/onboardingConstants';
import { useOnboardingFlow } from '@/features/onboarding/useOnboardingFlow';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function OnboardingPage() {
  const { t, translateError } = useTranslation();
  const {
    currentStepIndex,
    isReviewStep,
    form,
    formValues,
    isSubmitting,
    apiErrorMessage,
    isSuccess,
    handleContinue,
    handleBack,
    handleEditStep,
    handleFieldChange,
    handleBlurField,
    handleInvalidSubmit,
    handleValidSubmit,
  } = useOnboardingFlow();

  return (
    <section className="mx-auto w-full max-w-2xl">
      <title>{t('onboarding.pageTitle')}</title>

      <div className="space-y-2 text-center sm:text-start">
        <h1 id="onboarding-step-heading" tabIndex={-1} className="text-3xl font-bold tracking-tight outline-none">
          {t('onboarding.heading')}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">{t('onboarding.subheading')}</p>
      </div>

      <div className="mt-6">
        <OnboardingProgress currentStepIndex={currentStepIndex} />
      </div>

      <Card className="mt-6">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={form.handleSubmit(handleValidSubmit, handleInvalidSubmit)} noValidate aria-busy={isSubmitting}>
            <div className="min-h-[320px]">
              {currentStepIndex === 0 ? (
                <SituationStep
                  city={formValues.city ?? ''}
                  university={formValues.university ?? ''}
                  arrivalStage={formValues.arrivalStage}
                  onCityChange={(value) => handleFieldChange('city', value)}
                  onUniversityChange={(value) => handleFieldChange('university', value)}
                  onArrivalStageChange={(value) => handleFieldChange('arrivalStage', value as ProfileInput['arrivalStage'])}
                  onBlurField={handleBlurField}
                  errors={{
                    city: translateError(form.formState.errors.city?.message as string | undefined),
                    university: translateError(form.formState.errors.university?.message as string | undefined),
                    arrivalStage: translateError(form.formState.errors.arrivalStage?.message as string | undefined),
                  }}
                  disabled={isSubmitting}
                />
              ) : null}

              {currentStepIndex === 1 ? (
                <BackgroundStep
                  turkishLevel={formValues.turkishLevel}
                  specialization={formValues.specialization ?? ''}
                  onTurkishLevelChange={(value) => handleFieldChange('turkishLevel', value as ProfileInput['turkishLevel'])}
                  onSpecializationChange={(value) => handleFieldChange('specialization', value)}
                  onBlurField={handleBlurField}
                  errors={{
                    turkishLevel: translateError(form.formState.errors.turkishLevel?.message as string | undefined),
                    specialization: translateError(form.formState.errors.specialization?.message as string | undefined),
                  }}
                  disabled={isSubmitting}
                />
              ) : null}

              {currentStepIndex === 2 ? (
                <InterestsStep
                  interests={formValues.interests ?? []}
                  onInterestsChange={(values) => handleFieldChange('interests', values)}
                  error={translateError(form.formState.errors.interests?.message as string | undefined)}
                  disabled={isSubmitting}
                />
              ) : null}

              {currentStepIndex === 3 ? (
                <GoalsStep
                  goals={formValues.goals ?? []}
                  onGoalsChange={(values) => handleFieldChange('goals', values)}
                  error={translateError(form.formState.errors.goals?.message as string | undefined)}
                  disabled={isSubmitting}
                />
              ) : null}

              {currentStepIndex === 4 ? (
                <ReviewStep
                  values={{
                    city: formValues.city ?? '',
                    university: formValues.university ?? '',
                    arrivalStage: (formValues.arrivalStage ?? 'Preparing') as ProfileInput['arrivalStage'],
                    turkishLevel: (formValues.turkishLevel ?? 'None') as ProfileInput['turkishLevel'],
                    specialization: formValues.specialization ?? '',
                    interests: formValues.interests ?? [],
                    goals: formValues.goals ?? [],
                  }}
                  onEditStep={handleEditStep}
                  disabled={isSubmitting}
                />
              ) : null}
            </div>

            {apiErrorMessage ? (
              <div role="alert" aria-live="assertive" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                <p className="text-sm font-medium text-destructive">{t('onboarding.messages.apiErrorTitle')}</p>
                <p className="mt-1 text-sm text-destructive/80">{apiErrorMessage}</p>
              </div>
            ) : null}

            {isSuccess ? (
              <div role="status" aria-live="polite" className="mt-6 rounded-lg border border-success/30 bg-success-muted px-4 py-3">
                <p className="text-sm font-medium text-success">{t('onboarding.messages.success')}</p>
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button type="button" variant="outline" onClick={handleBack} disabled={currentStepIndex === 0 || isSubmitting} className="min-h-11 min-w-24">
                {t('onboarding.actions.back')}
              </Button>

              {!isReviewStep ? (
                <Button key="continue" type="button" onClick={() => void handleContinue()} disabled={isSubmitting} className="min-h-11 flex-1 sm:flex-none sm:min-w-32">
                  {t('onboarding.actions.continue')}
                </Button>
              ) : (
                <Button key="submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="min-h-11 flex-1 sm:flex-none sm:min-w-32">
                  {isSubmitting ? t('onboarding.actions.saving') : t('onboarding.actions.submit')}
                </Button>
              )}
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {t('onboarding.actions.progressHint', { current: String(currentStepIndex + 1), total: String(onboardingSteps.length) })}
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
