import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProductService } from "../../data/services/ProductService";
import ProductSerializer from "../../data/serializers/ProductSerializer";
import { resetCart } from "./cartSlice";
import {
  CreateProductData,
  ProductData,
  UpdateProductData,
} from "../../types/data";

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (service: ProductService): Promise<ProductData[] | undefined> => {
    const products = await service.getAll();

    return ProductSerializer.serializeMany(products);
  }
);

export const createProduct = createAsyncThunk(
  "product/create",
  async (payload: {
    data: CreateProductData;
    service: ProductService;
  }): Promise<ProductData> => {
    const product = await payload.service.create(payload.data);

    return ProductSerializer.serialize(product);
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async (
    payload: {
      data: UpdateProductData;
      service: ProductService;
    },
    thunkApi
  ): Promise<ProductData> => {
    const product = await payload.service.update(payload.data);

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
      state.products = action.payload || [];
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
      state.products.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      );
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.id == action.payload.id
      );
      state.products[productIndex] = action.payload;
      state.products.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      );
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
