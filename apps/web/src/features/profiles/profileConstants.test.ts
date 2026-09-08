/**
 * Tests for consistency between Onboarding and Profile field definitions.
 */

import { describe, expect, it } from 'vitest';
import { ProfileInputSchema } from '@wasl/contracts';
import {
  arrivalStages,
  turkishLevels,
  commonInterests,
  commonGoals,
} from './profileConstants';

describe('profileConstants consistency', () => {
  it('arrivalStages matches exactly ProfileInputSchema.shape.arrivalStage.options', () => {
    expect(arrivalStages).toEqual(ProfileInputSchema.shape.arrivalStage.options);
    expect(arrivalStages).toContain('First Week');
    expect(arrivalStages).toContain('Preparing');
    expect(arrivalStages).toContain('First Month');
    expect(arrivalStages).toContain('Settled');
  });

  it('turkishLevels matches exactly ProfileInputSchema.shape.turkishLevel.options', () => {
    expect(turkishLevels).toEqual(ProfileInputSchema.shape.turkishLevel.options);
    expect(turkishLevels).toContain('Beginner');
    expect(turkishLevels).toContain('None');
    expect(turkishLevels).toContain('Intermediate');
    expect(turkishLevels).toContain('Advanced');
    expect(turkishLevels).toContain('Native');
  });

  it('Ahmed persona interests and goals are contained in canonical options', () => {
    expect(commonInterests).toContain('Software');
    expect(commonInterests).toContain('AI');
    expect(commonGoals).toContain('Career');
    expect(commonGoals).toContain('Networking');
  });
});
