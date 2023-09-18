import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ProductData } from "../../types/data";

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
    updateCartAmount: (state, action: PayloadAction<CartItemData>) => {
      const { id, quantity, price } = action.payload;
      const currentQuantity = state.products[id].quantity;
      state.products[id].quantity = quantity;
      state.totalItem += quantity - currentQuantity;
      state.totalPrice += (quantity - currentQuantity) * price;
    },
    resetCart: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, updateCartAmount, resetCart } =
  cartSlice.actions;

export default cartSlice.reducer;
