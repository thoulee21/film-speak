import { createSlice } from '@reduxjs/toolkit';

import StateKeys from '@/src/constants/stateKeys';
import { RootState } from '@/src/store/store';

const initialState = {
  value: __DEV__,
};

export const devModeSlice = createSlice({
  name: StateKeys.DevMode,
  initialState,
  reducers: {
    toggleDevMode: (state) => {
      state.value = !state.value;
    },
    setDevMode: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { toggleDevMode, setDevMode } = devModeSlice.actions;

export const selectDevMode = (state: RootState) => state.devMode.value;
