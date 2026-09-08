/**
 * Verifies that app-wide discovery preferences change predictably.
 */

import { describe, expect, it } from 'vitest';
import { preferencesReducer, setSelectedCity } from './preferencesSlice';

describe('preferencesReducer', () => {
  it('stores the selected discovery city', () => {
    const nextState = preferencesReducer(undefined, setSelectedCity('Istanbul'));

    expect(nextState.selectedCity).toBe('Istanbul');
  });
});
