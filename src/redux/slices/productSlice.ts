import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ProductState = {
  products: ProductData[];
};

const initialState: ProductState = { products: [] };

export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    fetchProducts: (state, action: PayloadAction<ProductData[]>) => {
      state.products = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { fetchProducts } = productSlice.actions;

export default productSlice.reducer;
