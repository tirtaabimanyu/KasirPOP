import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateTransactionData, TransactionData } from "../../types/data";
import { TransactionRepository } from "../../data/repositories/TransactionRepository";
import TransactionSerializer from "../../data/serializers/TransactionSerializer";

export const fetchTransactions = createAsyncThunk(
  "transaction/fetch",
  async (payload: {
    dateRange?: { start: Date; end: Date };
    repository: TransactionRepository;
  }) => {
    const transactions = await payload.repository.getAll(payload.dateRange);

    return TransactionSerializer.serializeMany(transactions);
  }
);

export const createTransaction = createAsyncThunk(
  "transaction/create",
  async (payload: {
    data: CreateTransactionData;
    repository: TransactionRepository;
  }) => {
    const transaction = await payload.repository.create(payload.data);

    return TransactionSerializer.serialize(transaction);
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
  },
});

// Action creators are generated for each case reducer function
export const {} = transactionSlice.actions;

export default transactionSlice.reducer;
