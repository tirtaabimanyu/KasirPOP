import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type SnackBarPayload = { message: string; duration?: number };
export type LayoutState = {
  snackbar: { visible: boolean; message: string; duration: number };
};

const initialState: LayoutState = {
  snackbar: { visible: false, message: "", duration: 3000 },
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState: initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<SnackBarPayload>) => {
      state.snackbar.message = action.payload.message;
      state.snackbar.duration =
        action.payload.duration || state.snackbar.duration;
      state.snackbar.visible = true;
    },
    hideSnackbar: (state) => {
      state.snackbar.visible = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { showSnackbar, hideSnackbar } = layoutSlice.actions;

export default layoutSlice.reducer;
