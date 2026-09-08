/**
 * Summarizes the onboarding answers before submission and allows jumping back to sections.
 */

import { useId } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileInput } from '@wasl/contracts';
import { arrivalStageOptions, turkishLevelOptions } from '../onboardingConstants';

interface ReviewStepProps {
  values: ProfileInput;
  onEditStep: (stepIndex: number) => void;
  disabled?: boolean;
}

function formatArrivalStage(value: ProfileInput['arrivalStage']) {
  return arrivalStageOptions.find((option) => option.value === value)?.label ?? value;
}

function formatTurkishLevel(value: ProfileInput['turkishLevel']) {
  return turkishLevelOptions.find((option) => option.value === value)?.label ?? value;
}

export function ReviewStep({ values, onEditStep, disabled }: ReviewStepProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          Review and submit
        </h2>
        <p className="text-sm text-muted-foreground">Check your answers. You can go back to correct anything.</p>
      </header>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Your current situation</CardTitle>
            <Button variant="ghost" size="sm" type="button" onClick={() => onEditStep(0)} disabled={disabled} aria-label="Edit current situation">
              Edit
            </Button>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm">
            <p>
              <span className="font-medium">City:</span> {values.city || '—'}
            </p>
            <p>
              <span className="font-medium">University:</span> {values.university || '—'}
            </p>
            <p>
              <span className="font-medium">Arrival stage:</span> {formatArrivalStage(values.arrivalStage)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Your background</CardTitle>
            <Button variant="ghost" size="sm" type="button" onClick={() => onEditStep(1)} disabled={disabled} aria-label="Edit background">
              Edit
            </Button>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm">
            <p>
              <span className="font-medium">Turkish level:</span> {formatTurkishLevel(values.turkishLevel)}
            </p>
            <p>
              <span className="font-medium">Specialization:</span> {values.specialization || '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Your interests</CardTitle>
            <Button variant="ghost" size="sm" type="button" onClick={() => onEditStep(2)} disabled={disabled} aria-label="Edit interests">
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {values.interests.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {values.interests.map((interest) => (
                  <li key={interest}>
                    <Badge variant="secondary">{interest}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No interests selected.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Your goals</CardTitle>
            <Button variant="ghost" size="sm" type="button" onClick={() => onEditStep(3)} disabled={disabled} aria-label="Edit goals">
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {values.goals.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {values.goals.map((goal) => (
                  <li key={goal}>
                    <Badge variant="secondary">{goal}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No goals selected.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
