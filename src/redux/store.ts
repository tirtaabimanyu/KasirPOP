import { configureStore } from "@reduxjs/toolkit";
import { default as cartReducer } from "./slices/cartSlice";
import { default as categoryReducer } from "./slices/categorySlice";
import { default as productReducer } from "./slices/productSlice";
import { default as layoutReducer } from "./slices/layoutSlice";
import { default as transactionReducer } from "./slices/transactionSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    category: categoryReducer,
    layout: layoutReducer,
    transaction: transactionReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
