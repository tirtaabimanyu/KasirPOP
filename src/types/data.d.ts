type ProductData = {
  id: string;
  name: string;
  price: number;
  isAlwaysInStock: boolean;
  stock: number;
  imgUri?: ImageSourcePropType;
};

type CreateProductData = {
  name: string;
  stock: number;
  isAlwaysInStock: boolean;
  price: number;
  imgUri?: string;
  categories?: CategoryModel[];
};

type ProductCategoryData = {
  id: string;
  name: string;
};
