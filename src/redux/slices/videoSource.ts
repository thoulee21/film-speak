import { createSlice } from '@reduxjs/toolkit';

import StateKeys from '@/src/constants/stateKeys';
import VIDEO_SOURCE from '@/src/constants/video-source';
import { RootState } from '@/src/redux/store';

const initialState = {
  value: VIDEO_SOURCE,
};

export const videoSourceSlice = createSlice({
  name: StateKeys.VideoSource,
  initialState,
  reducers: {
    setVideoSource: (state, action: { payload: string }) => {
      state.value = action.payload;
    },
    resetVideoSource: (state) => {
      state.value = VIDEO_SOURCE;
    },
  },
});

export const { setVideoSource, resetVideoSource } = videoSourceSlice.actions;

export const selectVideoSource = (state: RootState) => state.videoSource.value;
