import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { MMKVStorage } from '@/src/utils/mmkvStorage';
import { devModeSlice } from '@/src/redux/slices/devMode';

const rootReducers = combineReducers({
  devMode: devModeSlice.reducer,
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
