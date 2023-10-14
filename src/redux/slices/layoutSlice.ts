import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LayoutOrientation } from "../../hooks/useCheckOrientation";

export type SnackBarPayload = { message: string; duration?: number };
export type LayoutState = {
  snackbar: { visible: boolean; message: string; duration: number };
  orientation: LayoutOrientation;
};

const initialState: LayoutState = {
  snackbar: { visible: false, message: "", duration: 3000 },
  orientation: "portrait",
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
    updateOrientation: (state, action: PayloadAction<LayoutOrientation>) => {
      state.orientation = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { showSnackbar, hideSnackbar, updateOrientation } =
  layoutSlice.actions;

export default layoutSlice.reducer;
