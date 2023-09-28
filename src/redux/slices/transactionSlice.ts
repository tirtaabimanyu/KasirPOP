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
      if (transaction.paymentType == PaymentType.CASH)
        obj += transaction.totalPrice;
      return obj;
    }, 0);
    const qris = transactions.reduce((obj, transaction) => {
      if (transaction.paymentType == PaymentType.QRIS)
        obj += transaction.totalPrice;
      return obj;
    }, 0);
    return { cash, qris };
  }
);

export const fetchQueueNumber = createAsyncThunk(
  "transaction/fetchQueueNumber",
  async (payload: { date: Date; service: TransactionService }) => {
    const dateRange = {
      start: new Date(payload.date.setHours(0, 0, 0, 0)),
      end: new Date(payload.date.setHours(23, 59, 59, 999)),
    };
    const result = await payload.service.countByDate(dateRange);

    return result + 1;
  }
);

export const fetchReport = createAsyncThunk(
  "transaction/fetchReport",
  async (payload: {
    dateRange: { start: Date; end: Date };
    service: TransactionService;
  }) => {
    const result = await payload.service.getAll({
      dateRange: payload.dateRange,
      ascending: true,
    });

    return TransactionSerializer.serializeMany(result);
  }
);

export type TransactionState = {
  transactions: TransactionData[];
  summary: {
    cash: number;
    qris: number;
  };
  nextQueue: number;
};

const initialState: TransactionState = {
  transactions: [],
  summary: { cash: 0, qris: 0 },
  nextQueue: 0,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.transactions = action.payload || [];
    });
    builder.addCase(fetchTransactionSummary.fulfilled, (state, action) => {
      const { cash, qris } = action.payload;
      state.summary = { cash, qris };
    });
    builder.addCase(createTransaction.fulfilled, (state, action) => {
      state.nextQueue = action.payload.queueNumber + 1;
    });
    builder.addCase(fetchQueueNumber.fulfilled, (state, action) => {
      state.nextQueue = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = transactionSlice.actions;

export default transactionSlice.reducer;
