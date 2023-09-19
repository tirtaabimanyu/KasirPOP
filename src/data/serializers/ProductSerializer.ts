import { ProductData } from "../../types/data";
import { ProductModel } from "../entities/ProductModel";
import CategorySerializer from "./CategorySerializer";

const ProductSerializer = class {
  static serialize = (product: ProductModel): ProductData => {
    const serializedCategories = CategorySerializer.serializeMany(
      product.categories
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

  static serializeMany = (
    products?: ProductModel[]
  ): ProductData[] | undefined => {
    const serializedProducts = products?.reduce((obj, product) => {
      obj.push(this.serialize(product));
      return obj;
    }, [] as ProductData[]);

    return serializedProducts;
  };
};

export default ProductSerializer;
