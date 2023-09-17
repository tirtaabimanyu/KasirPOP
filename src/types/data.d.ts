type ProductData = {
  id: number;
  name: string;
  price: number;
  isAlwaysInStock: boolean;
  stock: number;
  imgUri?: ImageSourcePropType;
  categories?: CategoryData[];
};

type CategoryData = {
  id: number;
  name: string;
};

type CreateProductData = {
  name: string;
  stock: number;
  isAlwaysInStock: boolean;
  price: number;
  imgUri?: string;
  categories?: CategoryModel[];
};

interface UpdateProductData extends CreateProductData {
  id: number;
}

type CreateCategoryData = {
  name: string;
};

type ProductStockData = { isAlwaysInStock: boolean; stock: number };
