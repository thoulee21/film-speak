import { createSlice } from '@reduxjs/toolkit';

import StateKeys from '@/src/constants/stateKeys';
import { RootState } from '@/src/redux/store';

const initialState = {
  value: 10.0,
};

export const volumeFactorSlice = createSlice({
  name: StateKeys.VolumeFactor,
  initialState,
  reducers: {
    setVolumeFactor: (state, action: { payload: number }) => {
      state.value = action.payload;
    },
    resetVolumeFactor: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { setVolumeFactor, resetVolumeFactor } = volumeFactorSlice.actions;

export const selectVolumeFactor = (state: RootState) => state.volumeFactor.value;
