import { createSlice } from '@reduxjs/toolkit';

import StateKeys from '@/src/constants/stateKeys';
import { RootState } from '@/src/redux/store';

const initialState = {
  value: undefined as string | undefined,
};

export const videoSourceSlice = createSlice({
  name: StateKeys.VideoSource,
  initialState,
  reducers: {
    setVideoSource: (state, action: { payload: string | undefined }) => {
      state.value = action.payload;
    },
  },
});

export const { setVideoSource } = videoSourceSlice.actions;

export const selectVideoSource = (state: RootState) => state.videoSource.value;
