import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryService } from "../../data/services/CategoryService";
import CategorySerializer from "../../data/serializers/CategorySerializer";
import { CategoryData } from "../../types/data";

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAll",
  async (service: CategoryService) => {
    const categories = await service.getAll();

    return CategorySerializer.serializeMany(categories);
  }
);

export type CategoryState = {
  categories: CategoryData[];
};

const initialState: CategoryState = { categories: [] };

export const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.categories = action.payload || [];
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = categorySlice.actions;

export default categorySlice.reducer;
