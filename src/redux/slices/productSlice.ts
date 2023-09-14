import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ProductModel } from "../../data/entities/ProductModel";

export type ProductState = {
  products: CashierItemData[];
};

const initialState: ProductState = { products: [] };

export const productSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    fetchProducts: (state, action: PayloadAction<CashierItemData[]>) => {
      state.products = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { fetchProducts } = productSlice.actions;

export default productSlice.reducer;
