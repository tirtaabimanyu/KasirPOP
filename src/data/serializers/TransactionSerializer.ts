import { CategoryData, TransactionData } from "../../types/data";
import { CategoryModel } from "../entities/CategoryModel";
import { TransactionModel } from "../entities/TransactionModel";

const TransactionSerializer = class {
  static serialize = (transaction: TransactionModel): TransactionData => ({
    id: transaction.id,
    created_at: transaction.created_at.toDateString(),
    total_price: transaction.total_price,
    products: transaction.products,
  });

  static serializeMany = (
    transactions: TransactionModel[]
  ): TransactionData[] => {
    const serializedTransactions: TransactionData[] = [];
    transactions.forEach((transaction) => {
      serializedTransactions.push(TransactionSerializer.serialize(transaction));
    });

    return serializedTransactions;
  };
};

export default TransactionSerializer;
