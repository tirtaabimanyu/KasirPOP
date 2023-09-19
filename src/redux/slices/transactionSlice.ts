import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CreateTransactionData,
  PaymentType,
  TransactionData,
} from "../../types/data";
import { TransactionService } from "../../data/services/TransactionService";
import TransactionSerializer from "../../data/serializers/TransactionSerializer";
import { fetchAllProducts } from "./productSlice";
import { DatabaseConnectionContextData } from "../../types/connection";

export const fetchTransactions = createAsyncThunk(
  "transaction/fetch",
  async (payload: {
    dateRange?: { start: Date; end: Date };
    service: TransactionService;
  }) => {
    const transactions = await payload.service.getAll({
      dateRange: payload.dateRange,
    });

    return TransactionSerializer.serializeMany(transactions);
  }
);

export const createTransaction = createAsyncThunk(
  "transaction/create",
  async (
    payload: {
      data: CreateTransactionData;
      services: DatabaseConnectionContextData;
    },
    thunkApi
  ) => {
    const transaction = await payload.services.transactionService.create(
      payload.data
    );

    thunkApi.dispatch(fetchAllProducts(payload.services.productService));
    return TransactionSerializer.serialize(transaction);
  }
);

export const fetchTransactionSummary = createAsyncThunk(
  "transaction/summary",
  async (payload: {
    dateRange: { start: Date; end: Date };
    service: TransactionService;
  }) => {
    const transactions = await payload.service.getAll({
      dateRange: payload.dateRange,
    });
    const cash = transactions.reduce((obj, transaction) => {
      if (transaction.payment_type == PaymentType.CASH)
        obj += transaction.total_price;
      return obj;
    }, 0);
    const qris = transactions.reduce((obj, transaction) => {
      if (transaction.payment_type == PaymentType.QRIS)
        obj += transaction.total_price;
      return obj;
    }, 0);
    return { cash, qris };
  }
);

export type TransactionState = {
  transactions: TransactionData[];
  summary: {
    cash: number;
    qris: number;
  };
};

const initialState: TransactionState = {
  transactions: [],
  summary: { cash: 0, qris: 0 },
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });
    builder.addCase(fetchTransactionSummary.fulfilled, (state, action) => {
      const { cash, qris } = action.payload;
      state.summary = { cash, qris };
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = transactionSlice.actions;

export default transactionSlice.reducer;
