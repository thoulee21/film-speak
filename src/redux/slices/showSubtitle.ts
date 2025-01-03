import { createSlice } from '@reduxjs/toolkit';

import StateKeys from '@/src/constants/stateKeys';
import { RootState } from '@/src/redux/store';

const initialState = {
  value: false,
};

export const showSubtitleSlice = createSlice({
  name: StateKeys.showSubtitle,
  initialState,
  reducers: {
    toggleShowSubtitle: (state) => {
      state.value = !state.value;
    },
    setShowSubtitle: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { toggleShowSubtitle, setShowSubtitle } = showSubtitleSlice.actions;

export const selectShowSubtitle = (state: RootState) => state.showSubtitle.value;
