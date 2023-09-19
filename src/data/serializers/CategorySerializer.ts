import { CategoryData } from "../../types/data";
import { CategoryModel } from "../entities/CategoryModel";

const CategorySerializer = class {
  static serialize = (category: CategoryModel): CategoryData => ({
    id: category.id,
    name: category.name,
  });

  static serializeMany = (
    categories?: CategoryModel[]
  ): CategoryData[] | undefined => {
    const serializedCategories = categories?.reduce((obj, category) => {
      obj.push(this.serialize(category));
      return obj;
    }, [] as CategoryData[]);

    return serializedCategories;
  };
};

export default CategorySerializer;
