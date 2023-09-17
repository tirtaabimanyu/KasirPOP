import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProductRepository } from "../../data/repositories/ProductRepository";
import { CategoryModel } from "../../data/entities/CategoryModel";

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (repository: ProductRepository): Promise<ProductData[]> => {
    const fetchedProducts = await repository.getAll();
    const serializedProducts: ProductData[] = [];

    fetchedProducts.forEach((product) => {
      const serializedCategories = product.categories?.map((category) => ({
        id: category.id,
        name: category.name,
      }));
      serializedProducts.push({
        id: product.id,
        name: product.name,
        stock: product.stock,
        isAlwaysInStock: product.isAlwaysInStock,
        price: product.price,
        imgUri: product.imgUri,
        categories: serializedCategories,
      });
    });

    return serializedProducts;
  }
);

export const createProduct = createAsyncThunk(
  "product/create",
  async (payload: {
    data: CreateProductData;
    repositories: DatabaseConnectionContextData;
  }): Promise<ProductData> => {
    const { productRepository, categoryRepository } = payload.repositories;
    const categoryIds =
      payload.data.categories?.map((category) => category.id) || [];
    const categories = await categoryRepository.getByIds(categoryIds);
    const product = await productRepository.create({
      ...payload.data,
      categories,
    });

    const serializedCategories = product.categories?.map(
      (category: CategoryModel) => ({
        id: category.id,
        name: category.name,
      })
    );
    const serializedProduct = {
      id: product.id,
      name: product.name,
      stock: product.stock,
      isAlwaysInStock: product.isAlwaysInStock,
      price: product.price,
      imgUri: product.imgUri,
      categories: serializedCategories,
    };

    return serializedProduct;
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async (payload: {
    data: UpdateProductData;
    repositories: DatabaseConnectionContextData;
  }): Promise<ProductData> => {
    const { productRepository, categoryRepository } = payload.repositories;
    const categoryIds =
      payload.data.categories?.map((category) => category.id) || [];
    const categories = await categoryRepository.getByIds(categoryIds);
    const product = await productRepository.update({
      ...payload.data,
      categories,
    });

    const serializedCategories = product.categories?.map(
      (category: CategoryModel) => ({
        id: category.id,
        name: category.name,
      })
    );
    const serializedProduct = {
      id: product.id,
      name: product.name,
      stock: product.stock,
      isAlwaysInStock: product.isAlwaysInStock,
      price: product.price,
      imgUri: product.imgUri,
      categories: serializedCategories,
    };

    return serializedProduct;
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (payload: {
    id: number;
    repository: ProductRepository;
  }): Promise<number> => {
    await payload.repository.delete(payload.id);

    return payload.id;
  }
);

export type ProductState = {
  products: ProductData[];
};

const initialState: ProductState = { products: [] };

export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const productIndex = state.products.findIndex(
        (product) => product.id == action.payload.id
      );
      state.products[productIndex] = action.payload;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (product) => product.id != action.payload
      );
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = productSlice.actions;

export default productSlice.reducer;
