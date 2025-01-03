import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { devModeSlice } from '@/src/redux/slices/devMode';
import { MMKVStorage } from '@/src/utils/mmkvStorage';
import { showSubtitleSlice } from './slices/showSubtitle';
import { subtitlesSlice } from './slices/subtitles';
import { videoSourceSlice } from './slices/videoSource';

const rootReducers = combineReducers({
  devMode: devModeSlice.reducer,
  subtitles: subtitlesSlice.reducer,
  showSubtitle: showSubtitleSlice.reducer,
  videoSource: videoSourceSlice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: MMKVStorage,
    blacklist: [],
  },
  rootReducers
);

export const store = configureStore({
  reducer: persistedReducer,
  enhancers: (getDefaultEnhancers) => (
    getDefaultEnhancers()
  ),
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    })
  ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const persister = persistStore(store);
