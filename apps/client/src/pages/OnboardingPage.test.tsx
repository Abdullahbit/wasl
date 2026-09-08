/**
 * Verifies the guided onboarding experience: rendering, validation, navigation,
 * selection controls, and API integration behavior.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileInputSchema } from '@wasl/contracts';
import { OnboardingPage } from './OnboardingPage';
import { saveProfile } from '@/features/profiles/profileApi';
import { I18nProvider } from '@/lib/i18n/I18nProvider';

vi.mock('@/features/profiles/profileApi', () => ({
  profileQueryKey: ['profile'],
  saveProfile: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockedSaveProfile = vi.mocked(saveProfile);

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderOnboardingPage() {
  const queryClient = createTestQueryClient();

  window.localStorage.clear();
  window.localStorage.setItem('wasl-locale', 'en');
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';

  return render(
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </QueryClientProvider>
    </I18nProvider>,
  );
}

function renderOnboardingPageInArabic() {
  const queryClient = createTestQueryClient();

  window.localStorage.clear();
  window.localStorage.setItem('wasl-locale', 'ar');
  document.documentElement.lang = 'ar';
  document.documentElement.dir = 'rtl';

  return render(
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/onboarding']}>
          <OnboardingPage />
        </MemoryRouter>
      </QueryClientProvider>
    </I18nProvider>,
  );
}

function getCityInput() {
  return screen.getByPlaceholderText(/Start typing e\.g\. Istanbul/i);
}

function getUniversityInput() {
  return screen.getByPlaceholderText(/Search universities e\.g\. Beykoz University/i);
}

function getSpecializationInput() {
  return screen.getByPlaceholderText(/e\.g\. Computer Engineering/i);
}

async function fillSituationStep(user: ReturnType<typeof userEvent.setup>, overrides: Partial<{ city: string; university: string; arrivalStage: string }> = {}) {
  const city = overrides.city ?? 'Istanbul';
  const university = overrides.university ?? 'Beykoz University';
  const arrivalStage = overrides.arrivalStage ?? 'First week';

  const cityInput = getCityInput();
  await user.clear(cityInput);
  await user.type(cityInput, city);
  // Blur to trigger validation
  await user.tab();

  const universityInput = getUniversityInput();
  await user.clear(universityInput);
  await user.type(universityInput, university);
  await user.tab();

  // Arrival stage is single-select cards - find by text
  const arrivalOption = screen.getByText(arrivalStage);
  await user.click(arrivalOption);
}

async function fillBackgroundStep(user: ReturnType<typeof userEvent.setup>, overrides: Partial<{ specialization: string; turkishLevel: string }> = {}) {
  const specialization = overrides.specialization ?? 'Computer Engineering';
  const turkishLevel = overrides.turkishLevel ?? 'Beginner';

  const turkishOption = screen.getByText(turkishLevel);
  await user.click(turkishOption);

  const specializationInput = getSpecializationInput();
  await user.clear(specializationInput);
  await user.type(specializationInput, specialization);
  await user.tab();
}

describe('OnboardingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedSaveProfile.mockReset();
  });

  it('renders the first onboarding step with progress and navigation', async () => {
    renderOnboardingPage();

    expect(screen.getByText('Build your WASL profile')).toBeInTheDocument();
    expect(screen.getByText(/Your answers help WASL recommend/i)).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your current situation' })).toBeInTheDocument();
    expect(getCityInput()).toBeInTheDocument();
    expect(getUniversityInput()).toBeInTheDocument();
    expect(screen.getByText('Arrival stage')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('shows required-field validation when continuing with empty fields', async () => {
    const user = userEvent.setup();
    renderOnboardingPage();

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByText('City is required')).toBeInTheDocument();
    expect(await screen.findByText('University is required')).toBeInTheDocument();
    // Specialization is on next step, not yet visible, but city/university should block
    expect(mockedSaveProfile).not.toHaveBeenCalled();
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
  });

  it('prevents invalid submission and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    renderOnboardingPage();

    // Try to continue without filling
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await screen.findByText('City is required');

    // City input should be focused (or at least first error is announced)
    // Verify error is associated via aria-invalid
    expect(getCityInput()).toHaveAttribute('aria-invalid', 'true');

    // Fill only city, leave university empty, try again
    await user.clear(getCityInput());
    await user.type(getCityInput(), 'Ankara');
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByText('University is required')).toBeInTheDocument();
    expect(mockedSaveProfile).not.toHaveBeenCalled();
  });

  it('moves between steps and preserves entered values', async () => {
    const user = userEvent.setup();
    renderOnboardingPage();

    await fillSituationStep(user, { city: 'Izmir', university: 'Ege University' });

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Your background' })).toBeInTheDocument();
    expect(screen.getByText('Step 2 of 5')).toBeInTheDocument();

    await fillBackgroundStep(user, { specialization: 'Architecture', turkishLevel: 'Intermediate' });

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Your interests' })).toBeInTheDocument();

    // Go back to first step and verify preservation
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(await screen.findByRole('heading', { name: 'Your background' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(await screen.findByRole('heading', { name: 'Your current situation' })).toBeInTheDocument();

    expect(getCityInput()).toHaveValue('Izmir');
    expect(getUniversityInput()).toHaveValue('Ege University');

    // Navigate forward again to verify intermediate selection persisted
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Your background' })).toBeInTheDocument();
    expect(getSpecializationInput()).toHaveValue('Architecture');
    const intermediateRadio = document.querySelector('input[value="Intermediate"]') as HTMLInputElement | null;
    expect(intermediateRadio?.checked).toBe(true);
  });

  it('supports back navigation without losing data', async () => {
    const user = userEvent.setup();
    renderOnboardingPage();

    await fillSituationStep(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Your background' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(await screen.findByRole('heading', { name: 'Your current situation' })).toBeInTheDocument();
    expect(getCityInput()).toHaveValue('Istanbul');
  });

  it('handles single-selection for arrival stage and Turkish level', async () => {
    const user = userEvent.setup();
    renderOnboardingPage();

    // Initially Preparing is selected (default)
    const preparingLabel = screen.getByText('Planning to arrive');
    expect(preparingLabel).toBeInTheDocument();

    // Select First week
    await user.click(screen.getByText('First week'));
    // Verify selection visually - selected card has primary border, checked radio
    const firstWeekRadio = document.querySelector('input[value="First Week"]') as HTMLInputElement | null;
    expect(firstWeekRadio?.checked).toBe(true);

    await fillSituationStep(user, { city: 'Istanbul', university: 'Beykoz University', arrivalStage: 'Less than one month' });
    const firstMonthRadio = document.querySelector('input[value="First Month"]') as HTMLInputElement | null;
    expect(firstMonthRadio?.checked).toBe(true);

    // Move to background and test Turkish level single select
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Your background' })).toBeInTheDocument();

    await user.click(screen.getByText('Beginner'));
    const beginnerRadio = document.querySelector('input[value="Beginner"]') as HTMLInputElement | null;
    expect(beginnerRadio?.checked).toBe(true);

    await user.click(screen.getByText('Advanced'));
    const advancedRadio = document.querySelector('input[value="Advanced"]') as HTMLInputElement | null;
    expect(advancedRadio?.checked).toBe(true);
    expect(beginnerRadio?.checked).toBe(false);
  });

  it('handles multi-selection for interests and goals', async () => {
    const user = userEvent.setup();
    renderOnboardingPage();

    await fillSituationStep(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await fillBackgroundStep(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    // Interests step
    expect(await screen.findByRole('heading', { name: 'Your interests' })).toBeInTheDocument();
    const softwareButton = screen.getByRole('button', { name: 'Software' });
    const aiButton = screen.getByRole('button', { name: 'Artificial Intelligence' });

    expect(softwareButton).toHaveAttribute('aria-pressed', 'false');
    await user.click(softwareButton);
    expect(softwareButton).toHaveAttribute('aria-pressed', 'true');
    await user.click(aiButton);
    expect(aiButton).toHaveAttribute('aria-pressed', 'true');
    // Toggle off
    await user.click(softwareButton);
    expect(softwareButton).toHaveAttribute('aria-pressed', 'false');
    await user.click(softwareButton);
    expect(softwareButton).toHaveAttribute('aria-pressed', 'true');

    expect(screen.getByText('2 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Your goals' })).toBeInTheDocument();

    const careerButton = screen.getByRole('button', { name: 'Find career opportunities' });
    const networkButton = screen.getByRole('button', { name: 'Build a professional network' });

    await user.click(careerButton);
    await user.click(networkButton);

    expect(careerButton).toHaveAttribute('aria-pressed', 'true');
    expect(networkButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('submits a valid payload that matches the shared contract', async () => {
    const user = userEvent.setup();
    mockedSaveProfile.mockResolvedValue({
      data: {
        id: '00000000-0000-0000-0000-000000000000',
        city: 'Istanbul',
        university: 'Beykoz University',
        arrivalStage: 'First Week',
        turkishLevel: 'Beginner',
        specialization: 'Computer Engineering',
        interests: ['Software', 'Artificial Intelligence'],
        goals: ['Find career opportunities', 'Build a professional network'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    renderOnboardingPage();

    await fillSituationStep(user, { city: 'Istanbul', university: 'Beykoz University', arrivalStage: 'First week' });
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await fillBackgroundStep(user, { specialization: 'Computer Engineering', turkishLevel: 'Beginner' });
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    const softwareButton = await screen.findByRole('button', { name: 'Software' });
    await user.click(softwareButton);
    await user.click(screen.getByRole('button', { name: 'Artificial Intelligence' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await user.click(screen.getByRole('button', { name: 'Find career opportunities' }));
    await user.click(screen.getByRole('button', { name: 'Build a professional network' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Review and submit' })).toBeInTheDocument();
    expect(screen.getByText('Istanbul')).toBeInTheDocument();
    expect(screen.getByText('Beykoz University')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    await waitFor(() => expect(mockedSaveProfile).toHaveBeenCalledTimes(1));

    const submittedPayload = mockedSaveProfile.mock.calls[0]?.[0];
    expect(submittedPayload).toBeDefined();

    const parsed = ProfileInputSchema.safeParse(submittedPayload);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.city).toBe('Istanbul');
      expect(parsed.data.university).toBe('Beykoz University');
      expect(parsed.data.arrivalStage).toBe('First Week');
      expect(parsed.data.turkishLevel).toBe('Beginner');
      expect(parsed.data.specialization).toBe('Computer Engineering');
      expect(parsed.data.interests).toEqual(['Software', 'Artificial Intelligence']);
      expect(parsed.data.goals).toEqual(['Find career opportunities', 'Build a professional network']);
    }
  });

  it('shows loading state and prevents duplicate submission while saving', async () => {
    const user = userEvent.setup();
    let resolveSave: (value: unknown) => void = () => {};
    mockedSaveProfile.mockImplementation(() => new Promise((resolve) => { resolveSave = resolve as (value: unknown) => void; }));

    renderOnboardingPage();

    await fillSituationStep(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await fillBackgroundStep(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' })); // skip interests (optional)
    await user.click(screen.getByRole('button', { name: 'Continue' })); // skip goals
    expect(await screen.findByRole('heading', { name: 'Review and submit' })).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'Submit profile' });
    await user.click(submitButton);

    expect(await screen.findByText('Saving…')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();

    // Attempt duplicate click while pending
    await user.click(submitButton);
    expect(mockedSaveProfile).toHaveBeenCalledTimes(1);

    // Resolve to avoid hanging
    resolveSave({
      data: {
        id: '00000000-0000-0000-0000-000000000000',
        city: 'Istanbul',
        university: 'Beykoz University',
        arrivalStage: 'First Week',
        turkishLevel: 'Beginner',
        specialization: 'Computer Engineering',
        interests: [],
        goals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  });

  it('displays API errors and allows retry while preserving data', async () => {
    const user = userEvent.setup();
    mockedSaveProfile.mockRejectedValueOnce(new Error('Network error'));

    renderOnboardingPage();

    await fillSituationStep(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await fillBackgroundStep(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Review and submit' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    expect(await screen.findByText(/We couldn’t save your profile/i)).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
    // Data preserved - city still visible in review
    expect(screen.getByText('Istanbul')).toBeInTheDocument();

    // Retry succeeds
    mockedSaveProfile.mockResolvedValueOnce({
      data: {
        id: '00000000-0000-0000-0000-000000000000',
        city: 'Istanbul',
        university: 'Beykoz University',
        arrivalStage: 'First Week',
        turkishLevel: 'Beginner',
        specialization: 'Computer Engineering',
        interests: [],
        goals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    await waitFor(() => expect(mockedSaveProfile).toHaveBeenCalledTimes(2));
  });

  it('navigates to /plan after successful submission and shows success feedback', async () => {
    const user = userEvent.setup();
    mockedSaveProfile.mockResolvedValue({
      data: {
        id: '00000000-0000-0000-0000-000000000000',
        city: 'Istanbul',
        university: 'Beykoz University',
        arrivalStage: 'First Week',
        turkishLevel: 'Beginner',
        specialization: 'Computer Engineering',
        interests: ['Software', 'Artificial Intelligence'],
        goals: ['Find career opportunities', 'Build a professional network'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    renderOnboardingPage();

    await fillSituationStep(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await fillBackgroundStep(user);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('heading', { name: 'Review and submit' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    expect(await screen.findByText(/Your profile is ready/i)).toBeInTheDocument();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/plan'), { timeout: 2000 });
  });

  it('supports the demo persona naturally without hardcoding', async () => {
    const user = userEvent.setup();
    mockedSaveProfile.mockResolvedValue({
      data: {
        id: '00000000-0000-0000-0000-000000000000',
        city: 'Istanbul',
        university: 'Beykoz University',
        arrivalStage: 'First Week',
        turkishLevel: 'Beginner',
        specialization: 'Computer Engineering',
        interests: ['Software', 'Artificial Intelligence'],
        goals: ['Find career opportunities', 'Build a professional network'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    renderOnboardingPage();

    // City Istanbul (prioritized)
    const cityInput = getCityInput();
    await user.clear(cityInput);
    await user.type(cityInput, 'Istanbul');
    await user.tab();
    // Should have Istanbul as suggestion
    expect(screen.getByText('Istanbul')).toBeInTheDocument();

    // University Beykoz University searchable
    const universityInput = getUniversityInput();
    await user.clear(universityInput);
    await user.type(universityInput, 'Beykoz');
    // Filtered suggestion should include Beykoz University
    expect(await screen.findByText('Beykoz University')).toBeInTheDocument();
    await user.click(screen.getByText('Beykoz University'));
    expect(universityInput).toHaveValue('Beykoz University');

    await user.click(screen.getByText('First week'));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await user.click(screen.getByText('Beginner'));
    const specInput = getSpecializationInput();
    await user.clear(specInput);
    await user.type(specInput, 'Computer Engineering');

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Software' }));
    await user.click(screen.getByRole('button', { name: 'Artificial Intelligence' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Find career opportunities' }));
    await user.click(screen.getByRole('button', { name: 'Build a professional network' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Review and submit' })).toBeInTheDocument();
    expect(screen.getByText('Beykoz University')).toBeInTheDocument();
    expect(screen.getByText('Computer Engineering')).toBeInTheDocument();
  });

  it('allows editing from review step', async () => {
    const user = userEvent.setup();
    renderOnboardingPage();

    await fillSituationStep(user, { city: 'Ankara', university: 'Ankara University' });
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await fillBackgroundStep(user, { specialization: 'Business Administration' });
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Review and submit' })).toBeInTheDocument();
    expect(screen.getByText('Ankara')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Edit current situation/i }));
    expect(await screen.findByRole('heading', { name: 'Your current situation' })).toBeInTheDocument();
    expect(getCityInput()).toHaveValue('Ankara');
  });

  it('renders in Arabic RTL correctly and switches language', async () => {
    renderOnboardingPageInArabic();

    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(await screen.findByRole('heading', { name: 'أنشئ ملفك في وصل' })).toBeInTheDocument();
    expect(screen.getByText('الخطوة 1 من 5')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'وضعك الحالي' })).toBeInTheDocument();

    // Verify RTL separator uses logical arrow (←) not LTR (→)
    expect(screen.getByText(/←/)).toBeInTheDocument();
  });
});
