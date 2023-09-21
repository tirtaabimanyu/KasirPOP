import { TransactionData } from "../../types/data";
import { TransactionModel } from "../entities/TransactionModel";

const TransactionSerializer = class {
  static serialize = (transaction: TransactionModel): TransactionData => ({
    id: transaction.id,
    createdAt: transaction.createdAt.toISOString(),
    totalPrice: transaction.totalPrice,
    paymentType: transaction.paymentType,
    products: transaction.products,
  });

  static serializeMany = (
    transactions?: TransactionModel[]
  ): TransactionData[] | undefined => {
    const serializedTransactions = transactions?.reduce((obj, transaction) => {
      obj.push(this.serialize(transaction));
      return obj;
    }, [] as TransactionData[]);

    return serializedTransactions;
  };
};

export default TransactionSerializer;
