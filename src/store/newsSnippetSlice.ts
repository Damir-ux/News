import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NewsSnippetState {
  expanded: boolean;
  filter: string;
  showDuplicates: boolean;
  showAllTags: boolean;
}

const initialState: NewsSnippetState = {
  expanded: false,
  filter: 'By Relevance',
  showDuplicates: false,
  showAllTags: false,
};

const newsSnippetSlice = createSlice({
  name: 'newsSnippet',
  initialState,
  reducers: {
    toggleExpanded(state) {
      state.expanded = !state.expanded;
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
    toggleDuplicates(state) {
      state.showDuplicates = !state.showDuplicates;
    },
    toggleTags(state) {
      state.showAllTags = !state.showAllTags;
    },
  },
});

export const {
  toggleExpanded,
  setFilter,
  toggleDuplicates,
  toggleTags,
} = newsSnippetSlice.actions;

export default newsSnippetSlice.reducer;
