import { TransactionData } from "../../types/data";
import { TransactionModel } from "../entities/TransactionModel";

const TransactionSerializer = class {
  static serialize = (transaction: TransactionModel): TransactionData => ({
    id: transaction.id,
    createdAt: transaction.created_at.toISOString(),
    totalPrice: transaction.total_price,
    paymentType: transaction.payment_type,
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
