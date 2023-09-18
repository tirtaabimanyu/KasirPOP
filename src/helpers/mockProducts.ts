import { ProductData } from "../types/data";

const mockProducts: ProductData[] = [
  {
    id: 1,
    name: "Bakso Komplit",
    price: 50000,
    isAlwaysInStock: true,
    stock: 5,
    imgUri: undefined,
  },
  {
    id: 2,
    name: "Bakso Halus",
    price: 20000,
    isAlwaysInStock: false,
    stock: 10,
    imgUri: undefined,
  },
  {
    id: 3,
    name: "Bakso Ayam",
    price: 30000,
    isAlwaysInStock: false,
    stock: 0,
    imgUri: undefined,
  },
];

export default mockProducts;
