import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryRepository } from "../../data/repositories/CategoryRepository";

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAll",
  async (repository: CategoryRepository) => {
    const fetchedCategories = await repository.getAll();
    const serializedCategories: CategoryData[] = [];

    fetchedCategories.forEach((category) => {
      serializedCategories.push({
        id: category.id,
        name: category.name,
      });
    });

    return serializedCategories;
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
