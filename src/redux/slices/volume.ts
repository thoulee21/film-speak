import { createSlice } from '@reduxjs/toolkit';

import StateKeys from '@/src/constants/stateKeys';
import { RootState } from '@/src/redux/store';

const initialState = {
  // number from 0 to 1, -1 for unset
  value: -1,
};

export const volumeSlice = createSlice({
  name: StateKeys.Volume,
  initialState,
  reducers: {
    setVolume: (state, action: { payload: number }) => {
      state.value = action.payload;
    },
    resetVolume: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { resetVolume, setVolume } = volumeSlice.actions;

export const selectVolume = (state: RootState) => state.volume.value;
