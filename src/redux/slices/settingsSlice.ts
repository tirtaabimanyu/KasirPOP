import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SettingsService } from "../../data/services/SettingsService";
import SettingsSerializer from "../../data/serializers/SettingsSerializer";
import {
  PaymentSettingsData,
  StoreSettingsData,
  UpdateCombinedSettingsData,
} from "../../types/data";

export const fetchSettings = createAsyncThunk(
  "settings/fetch",
  async (service: SettingsService) => {
    const settings = await service.get();

    return SettingsSerializer.serialize(settings);
  }
);

export const updateSettings = createAsyncThunk(
  "settings/update",
  async (payload: {
    data: UpdateCombinedSettingsData;
    service: SettingsService;
  }) => {
    const settings = await payload.service.update(payload.data);

    return SettingsSerializer.serialize(settings);
  }
);

export type SettingsState = {
  storeSettings?: StoreSettingsData;
  paymentSettings?: PaymentSettingsData;
};

const initialState: SettingsState = {};

export const settingsSlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(updateSettings.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = settingsSlice.actions;

export default settingsSlice.reducer;
