import { createSlice } from '@reduxjs/toolkit';
import type { Line } from 'srt-parser-2';

import StateKeys from '@/src/constants/stateKeys';
import { RootState } from '@/src/redux/store';

export interface Subtitle {
  fileUri: string;
  value: Line[];
}

const initialState = {
  value: [] as Subtitle[],
};

export const subtitlesSlice = createSlice({
  name: StateKeys.Subtitles,
  initialState,
  reducers: {
    setSubtitles: (state) => {
      state.value = state.value;
    },

    addSubtitle: (state, action) => {
      state.value.push(action.payload);
    },

    removeSubtitle: (state, action) => {
      state.value = state.value.filter(
        (subtitle) => subtitle.fileUri !== action.payload
      );
    },

    clearSubtitles: (state) => {
      state.value = [];
    },

    updateSubtitle: (state, action) => {
      const index = state.value.findIndex(
        (subtitle) => subtitle.fileUri === action.payload.fileUri
      );

      if (index !== -1) {
        state.value[index].value = action.payload.value;
      }
    },
  },
});

export const { setSubtitles, addSubtitle, clearSubtitles, removeSubtitle, updateSubtitle } = subtitlesSlice.actions;

export const selectSubtitles = (state: RootState) => state.subtitles.value;
