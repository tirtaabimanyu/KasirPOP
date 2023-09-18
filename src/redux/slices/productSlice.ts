import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProductService } from "../../data/services/ProductService";
import ProductSerializer from "../../data/serializers/ProductSerializer";
import { resetCart } from "./cartSlice";
import { ProductData } from "../../types/data";
import { DatabaseConnectionContextData } from "../../types/connection";

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (service: ProductService): Promise<ProductData[]> => {
    const products = await service.getAll();

    return ProductSerializer.serializeMany(products);
  }
);

export const createProduct = createAsyncThunk(
  "product/create",
  async (payload: {
    data: ProductData;
    repositories: DatabaseConnectionContextData;
  }): Promise<ProductData> => {
    const { productService, categoryService } = payload.repositories;
    const { id, ...data } = payload.data;
    const categoryIds = data.categories?.map((category) => category.id) || [];
    const categories = await categoryService.getByIds(categoryIds);
    const product = await productService.create({
      ...data,
      categories,
    });

    return ProductSerializer.serialize(product);
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async (
    payload: {
      data: ProductData;
      services: DatabaseConnectionContextData;
    },
    thunkApi
  ): Promise<ProductData> => {
    const { productService, categoryService } = payload.services;
    const categoryIds =
      payload.data.categories?.map((category) => category.id) || [];
    const categories = await categoryService.getByIds(categoryIds);
    const product = await productService.update({
      ...payload.data,
      categories,
    });

    thunkApi.dispatch(resetCart());
    return ProductSerializer.serialize(product);
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (
    payload: {
      id: number;
      service: ProductService;
    },
    thunkApi
  ): Promise<number> => {
    await payload.service.delete(payload.id);

    thunkApi.dispatch(resetCart());
    return payload.id;
  }
);

export type ProductState = {
  products: ProductData[];
};

const initialState: ProductState = { products: [] };

export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.id == action.payload.id
      );
      state.products[productIndex] = action.payload;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (product) => product.id != action.payload
      );
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = productSlice.actions;

export default productSlice.reducer;
