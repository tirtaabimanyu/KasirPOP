import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryService } from "../../data/services/CategoryService";
import CategorySerializer from "../../data/serializers/CategorySerializer";
import { CategoryData, UpdateCategoryData } from "../../types/data";
import { fetchAllProducts } from "./productSlice";
import { DatabaseConnectionContextData } from "../../types/connection";

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAll",
  async (service: CategoryService) => {
    const categories = await service.getAll();

    return CategorySerializer.serializeMany(categories);
  }
);

export const createCategory = createAsyncThunk(
  "category/create",
  async (
    payload: {
      data: { name: string };
      service: CategoryService;
    },
    thunkApi
  ): Promise<CategoryData> => {
    const { category: categoryState } = thunkApi.getState() as {
      category: CategoryState;
    };
    const displayOrder =
      categoryState.categories.length == 0
        ? 1
        : categoryState.categories[categoryState.categories.length - 1]
            .displayOrder + 1;

    const category = await payload.service.create({
      name: payload.data.name,
      displayOrder,
    });

    return CategorySerializer.serialize(category);
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async (
    payload: {
      data: UpdateCategoryData;
      services: DatabaseConnectionContextData;
    },
    thunkApi
  ): Promise<CategoryData> => {
    const category = await payload.services.categoryService.update(
      payload.data
    );

    return CategorySerializer.serialize(category);
  }
);

export const swapDisplayOrder = createAsyncThunk(
  "category/swapDisplayOrder",
  async (payload: {
    categories: [CategoryData, CategoryData];
    service: CategoryService;
  }): Promise<CategoryData[]> => {
    const categories = await payload.service.swapDisplayOrder(
      payload.categories
    );

    return CategorySerializer.serializeMany(categories) || [];
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (payload: {
    id: number;
    service: CategoryService;
  }): Promise<number> => {
    await payload.service.delete(payload.id);

    return payload.id;
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
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.categories.push(action.payload);
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      const categoryIndex = state.categories.findIndex(
        (category) => category.id == action.payload.id
      );
      state.categories[categoryIndex] = action.payload;
    });
    builder.addCase(swapDisplayOrder.fulfilled, (state, action) => {
      const [categoryA, categoryB] = action.payload;
      const categoryAIndex = state.categories.findIndex(
        (category) => category.id == categoryA.id
      );
      const categoryBIndex = state.categories.findIndex(
        (category) => category.id == categoryB.id
      );
      state.categories[categoryAIndex] = categoryB;
      state.categories[categoryBIndex] = categoryA;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(
        (category) => category.id != action.payload
      );
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = categorySlice.actions;

export default categorySlice.reducer;
