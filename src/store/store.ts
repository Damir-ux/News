import { configureStore } from '@reduxjs/toolkit';
import newsSnippetReducer from './newsSnippetSlice';

export const store = configureStore({
  reducer: {
    newsSnippet: newsSnippetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
