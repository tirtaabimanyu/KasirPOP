import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryRepository } from "../../data/repositories/CategoryRepository";
import CategorySerializer from "../../data/serializers/CategorySerializer";

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAll",
  async (repository: CategoryRepository) => {
    const categories = await repository.getAll();

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
      state.categories = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = categorySlice.actions;

export default categorySlice.reducer;
