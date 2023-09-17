import { DataSource, In, Repository } from "typeorm";
import { CategoryModel } from "../entities/CategoryModel";

export class CategoryRepository {
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

  public async getWithProducts(
    category: CategoryModel
  ): Promise<CategoryModel | null> {
    const newCategory = await this.ormRepository.findOne({
      relations: {
        products: true,
      },
      where: {
        id: category.id,
      },
    });

    return newCategory;
  }

  public async create({ name }: CreateCategoryData): Promise<CategoryModel> {
    const category = this.ormRepository.create({
      name,
    });

    await this.ormRepository.save(category);

    return category;
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.softDelete(id);
  }

  public async deleteAll(): Promise<void> {
    const products = await this.ormRepository.find();
    await this.ormRepository.remove(products);
  }
}
