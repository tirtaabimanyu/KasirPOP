import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItemData extends ProductData {
  quantity: number;
}

export type CartState = {
  products: {
    [key: string]: CartItemData;
  };
  totalPrice: number;
  totalItem: number;
};

const initialState: CartState = { products: {}, totalPrice: 0, totalItem: 0 };

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductData>) => {
      const id = action.payload.id;
      if (id in state.products) {
        state.products[id].quantity += 1;
      } else {
        state.products[id] = { ...action.payload, quantity: 1 };
      }
      state.totalItem += 1;
      state.totalPrice += action.payload.price;
    },
    removeFromCart: (state, action: PayloadAction<ProductData>) => {
      const id = action.payload.id;
      if (!(id in state.products)) {
        return;
      }

      const currentQuantity = state.products[id].quantity;
      if (currentQuantity == 1) {
        delete state.products[id];
      } else {
        state.products[id].quantity -= 1;
      }
      state.totalItem -= 1;
      state.totalPrice -= action.payload.price;
    },
    resetCart: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
