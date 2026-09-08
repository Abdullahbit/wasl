/**
 * Creates the Redux store for long-lived, client-owned application state.
 */

import { configureStore } from '@reduxjs/toolkit';
import { preferencesReducer } from './slices/preferencesSlice';

export const store = configureStore({
  reducer: { preferences: preferencesReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
