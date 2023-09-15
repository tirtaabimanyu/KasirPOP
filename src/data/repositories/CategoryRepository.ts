import { DataSource, Repository } from "typeorm";
import { CategoryModel } from "../entities/CategoryModel";

interface ICreateProductCategoryData {
  name: string;
}

export class CategoryRepository {
  private ormRepository: Repository<CategoryModel>;

  constructor(connection: DataSource) {
    this.ormRepository = connection.getRepository(CategoryModel);
  }

  public async getAll(): Promise<CategoryModel[]> {
    const categories = await this.ormRepository.find();

    return categories;
  }

  public async create({
    name,
  }: ICreateProductCategoryData): Promise<CategoryModel> {
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
