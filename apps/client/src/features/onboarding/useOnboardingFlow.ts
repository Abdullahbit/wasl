/**
 * Coordinates the multi-step onboarding workflow and profile submission.
 *
 * This hook owns the React Hook Form state, step navigation, field
 * validation, focus management, and the TanStack Query mutation that
 * persists the profile. Keeping this logic in a hook lets the page
 * component stay focused on rendering and user interaction.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileInputSchema, type ProfileInput } from '@wasl/contracts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';
import { onboardingSteps, SUCCESS_NAVIGATION_DELAY_MS } from './onboardingConstants';
import { profileQueryKey, saveProfile } from '../profiles/profileApi';

type ProfileFormInput = z.input<typeof ProfileInputSchema>;

/**
 * Maps profile field names to the DOM id of their primary input for focus management.
 * Radio groups are handled via name fallback when no id exists.
 */
const fieldToElementId: Record<string, string> = {
  city: 'onboarding-city',
  university: 'onboarding-university',
  specialization: 'onboarding-specialization',
};

export function useOnboardingFlow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigationTimeoutReference = useRef<number | null>(null);

  const form = useForm<ProfileFormInput, unknown, ProfileInput>({
    resolver: zodResolver(ProfileInputSchema),
    mode: 'onBlur',
    defaultValues: {
      city: '',
      university: '',
      arrivalStage: 'Preparing',
      turkishLevel: 'None',
      specialization: '',
      interests: [],
      goals: [],
    },
  });

  const formValues = form.watch();
  const isReviewStep = currentStepIndex === onboardingSteps.length - 1;

  const profileMutation = useMutation({
    mutationFn: saveProfile,
    onSuccess: (profileResponse) => {
      queryClient.setQueryData(profileQueryKey, profileResponse);
      navigationTimeoutReference.current = window.setTimeout(() => {
        navigate('/plan');
      }, SUCCESS_NAVIGATION_DELAY_MS);
    },
  });

  useEffect(() => {
    return () => {
      if (navigationTimeoutReference.current !== null) {
        window.clearTimeout(navigationTimeoutReference.current);
      }
    };
  }, []);

  /**
   * Focuses the first field in the provided list that currently has a validation error.
   *
   * Tries an explicit element id first (for text inputs), then falls back to
   * querying by radio group name, then to React Hook Form's focus helper.
   * This ensures keyboard users are guided to the exact problem.
   */
  const focusFirstInvalidField = useCallback(
    (fieldNames: readonly string[]) => {
      for (const fieldName of fieldNames) {
        const hasError = Boolean(form.formState.errors[fieldName as keyof ProfileFormInput]);

        if (!hasError) {
          continue;
        }

        const elementId = fieldToElementId[fieldName];

        if (elementId) {
          const element = document.getElementById(elementId);

          if (element) {
            element.focus();

            if (element.tagName === 'FIELDSET') {
              const firstInput = element.querySelector('input');
              (firstInput as HTMLElement | null)?.focus();
            }

            return;
          }

          const namedElements = document.getElementsByName(fieldName);

          if (namedElements.length > 0) {
            (namedElements[0] as HTMLElement).focus();
            return;
          }
        } else {
          // Field is a radio group identified by name (arrivalStage, turkishLevel)
          const namedElements = document.getElementsByName(fieldName);

          if (namedElements.length > 0) {
            (namedElements[0] as HTMLElement).focus();
            return;
          }
        }

        try {
          form.setFocus(fieldName as Parameters<typeof form.setFocus>[0]);
        } catch (focusError) {
          // Focus may fail for custom controls that are not registered inputs.
          // The error is non-critical and visible validation messages still guide the user.
          console.warn(`Unable to focus field "${fieldName}"`, focusError);
        }

        return;
      }
    },
    [form],
  );

  /**
   * Validates the current step's fields and advances when they pass.
   *
   * Shows inline errors and moves focus to the first invalid field when
   * validation fails, so users understand why they cannot continue.
   */
  const handleContinue = useCallback(async () => {
    const currentStep = onboardingSteps[currentStepIndex];

    if (!currentStep) {
      return;
    }

    const fieldsToValidate = currentStep.fields;

    if (fieldsToValidate.length === 0) {
      setCurrentStepIndex((previous) => Math.min(previous + 1, onboardingSteps.length - 1));
      return;
    }

    const isStepValid = await form.trigger(fieldsToValidate as unknown as Array<keyof ProfileFormInput>, {
      shouldFocus: false,
    });

    if (isStepValid) {
      setCurrentStepIndex((previous) => Math.min(previous + 1, onboardingSteps.length - 1));

      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => {
          const heading = document.getElementById('onboarding-step-heading');

          if (heading) {
            heading.focus();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      }

      return;
    }

    focusFirstInvalidField(fieldsToValidate);
  }, [currentStepIndex, focusFirstInvalidField, form]);

  const handleBack = useCallback(() => {
    setCurrentStepIndex((previous) => Math.max(previous - 1, 0));
  }, []);

  const handleEditStep = useCallback((stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  }, []);

  const handleFieldChange = useCallback(
    <FieldName extends keyof ProfileInput>(fieldName: FieldName, value: ProfileInput[FieldName]) => {
      form.setValue(fieldName as unknown as keyof ProfileFormInput, value as unknown as ProfileFormInput[keyof ProfileFormInput], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form],
  );

  const handleBlurField = useCallback(
    (fieldName: string) => {
      void form.trigger(fieldName as keyof ProfileFormInput);
    },
    [form],
  );

  /**
   * Handles invalid submission across all steps by jumping to the first failing step.
   * Interests and goals are optional, so they are not included in the global check.
   *
   * The validation errors passed by React Hook Form are the source of truth
   * for this callback, because formState may not yet have re-rendered.
   */
  const handleInvalidSubmit = useCallback(
    (validationErrors?: Partial<Record<keyof ProfileFormInput, { message?: string }>>) => {
      const errorSource = validationErrors ?? form.formState.errors;
      const allRequiredFields: Array<keyof ProfileFormInput> = ['city', 'university', 'arrivalStage', 'turkishLevel', 'specialization'];
      const firstErrorField = allRequiredFields.find((field) => Boolean(errorSource[field]));

    if (!firstErrorField) {
      return;
    }

    const fieldStepIndex = onboardingSteps.findIndex((step) => (step.fields as readonly string[]).includes(firstErrorField as string));

    if (fieldStepIndex !== -1 && fieldStepIndex < currentStepIndex) {
      setCurrentStepIndex(fieldStepIndex);
      window.setTimeout(() => focusFirstInvalidField([firstErrorField]), 0);
      return;
    }

      focusFirstInvalidField([firstErrorField]);
    },
    [currentStepIndex, focusFirstInvalidField, form.formState.errors],
  );

  const handleValidSubmit = useCallback(
    (profileInput: ProfileInput) => {
      profileMutation.mutate(profileInput);
    },
    [profileMutation],
  );

  return {
    currentStepIndex,
    isReviewStep,
    form,
    formValues,
    isSubmitting: profileMutation.isPending,
    apiErrorMessage: profileMutation.isError ? profileMutation.error.message : null,
    isSuccess: profileMutation.isSuccess,
    handleContinue,
    handleBack,
    handleEditStep,
    handleFieldChange,
    handleBlurField,
    handleInvalidSubmit,
    handleValidSubmit,
  };
}
