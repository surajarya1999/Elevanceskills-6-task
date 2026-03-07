import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Locale } from "@/types";

const languageSlice = createSlice({
  name: "language",
  initialState: { currentLocale: "en" as Locale },
  reducers: {
    setLocale(state, action: PayloadAction<Locale>) {
      state.currentLocale = action.payload;
    },
  },
});

export const { setLocale } = languageSlice.actions;
export default languageSlice.reducer;
