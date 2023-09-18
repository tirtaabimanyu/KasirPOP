import { ProductData } from "../../types/data";
import { ProductModel } from "../entities/ProductModel";
import CategorySerializer from "./CategorySerializer";

const ProductSerializer = class {
  static serialize = (product: ProductModel): ProductData => {
    const serializedCategories = product.categories.map((category) =>
      CategorySerializer.serialize(category)
    );

    return {
      id: product.id,
      name: product.name,
      stock: product.stock,
      isAlwaysInStock: product.isAlwaysInStock,
      price: product.price,
      imgUri: product.imgUri,
      categories: serializedCategories,
    };
  };

  static serializeMany = (products: ProductModel[]): ProductData[] => {
    const serializedProducts: ProductData[] = [];
    products.forEach((product) => {
      serializedProducts.push(this.serialize(product));
    });

    return serializedProducts;
  };
};

export default ProductSerializer;
