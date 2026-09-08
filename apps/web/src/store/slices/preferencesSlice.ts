/**
 * Stores app-wide discovery preferences that are owned by the browser UI.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  selectedCity: string | null;
}

const initialState: PreferencesState = { selectedCity: null };

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setSelectedCity(state, action: PayloadAction<string | null>) {
      state.selectedCity = action.payload;
    },
  },
});

export const { setSelectedCity } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
