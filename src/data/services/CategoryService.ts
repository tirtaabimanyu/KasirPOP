import { DataSource, In, Repository } from "typeorm";
import { CategoryModel } from "../entities/CategoryModel";
import {
  CategoryData,
  CreateCategoryData,
  UpdateCategoryData,
} from "../../types/data";

export class CategoryService {
  private ormRepository: Repository<CategoryModel>;

  constructor(connection: DataSource) {
    this.ormRepository = connection.getRepository(CategoryModel);
  }

  public async getAll(options?: {
    withProducts: boolean;
  }): Promise<CategoryModel[]> {
    const categories = await this.ormRepository.find({
      relations: {
        products: options?.withProducts,
      },
      order: { displayOrder: "ASC" },
    });

    return categories;
  }

  public async getByIds(ids: number[]): Promise<CategoryModel[]> {
    const categories = await this.ormRepository.find({
      where: {
        id: In(ids),
      },
    });

    return categories;
  }

  public async create(data: CreateCategoryData): Promise<CategoryModel> {
    const category = this.ormRepository.create(data);

    return this.ormRepository.save(category);
  }

  public async update(data: UpdateCategoryData): Promise<CategoryModel> {
    const { id, ...rest } = data;

    const category = await this.ormRepository.save({ id, ...rest });

    return category;
  }

  public async swapDisplayOrder(
    data: [CategoryData, CategoryData]
  ): Promise<CategoryModel[]> {
    const categoryA = await this.ormRepository.findOneBy({ id: data[0].id });
    const categoryB = await this.ormRepository.findOneBy({ id: data[1].id });

    if (!(categoryA && categoryB)) return Promise.reject("id not found");

    categoryA.displayOrder = data[1].displayOrder;
    categoryB.displayOrder = data[0].displayOrder;

    const result = await this.ormRepository.save([categoryA, categoryB]);
    return result;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteAll(): Promise<void> {
    const products = await this.ormRepository.find();
    await this.ormRepository.remove(products);
  }
}
