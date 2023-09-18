import { CategoryData } from "../../types/data";
import { CategoryModel } from "../entities/CategoryModel";

const CategorySerializer = class {
  static serialize = (category: CategoryModel): CategoryData => ({
    id: category.id,
    name: category.name,
  });

  static serializeMany = (categories: CategoryModel[]): CategoryData[] => {
    const serializedCategories: CategoryData[] = [];
    categories.forEach((category) => {
      serializedCategories.push(CategorySerializer.serialize(category));
    });

    return serializedCategories;
  };
};

export default CategorySerializer;
