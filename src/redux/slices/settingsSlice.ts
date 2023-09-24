import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SettingsService } from "../../data/services/SettingsService";
import SettingsSerializer from "../../data/serializers/SettingsSerializer";
import {
  PaymentSettingsData,
  PrinterSettingsData,
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
  paymentSettings: PaymentSettingsData;
  printerSettings: PrinterSettingsData;
};

const initialState: SettingsState = {
  paymentSettings: { cash: false, qris: false },
  printerSettings: {
    receiptFooter: "",
    paperSize: 58,
    showLogo: false,
    showQueueNumber: false,
  },
};

export const settingsSlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
    builder.addCase(updateSettings.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = settingsSlice.actions;

export default settingsSlice.reducer;
