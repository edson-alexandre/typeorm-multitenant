import { Connection } from 'typeorm';
import { ProductRepository } from '../repositories/ProductsReposiroty';
import AppError from '../../shared/errors/AppError';
import Product from '../entities/Product';

interface IRequest {
    id?: string;
    name: string;
    price: number;
    quantity: number;
}

class ProductService {
    private productRepository: ProductRepository;

    constructor(conn: Connection) {
        this.productRepository = conn.getCustomRepository(ProductRepository);
    }

    public async createProduct(obj: IRequest): Promise<Product> {
        const productExists = await this.productRepository.findByName(obj.name);

        if (productExists) {
            throw new AppError('There is already a product with this name');
        }

        const product = this.productRepository.create(obj);
        await this.productRepository.save(product);

        return product;
    }

    public async updateProduct(obj: IRequest): Promise<Product | undefined> {
        const product = await this.productRepository.findOne(obj.id);

        if (!product) {
            throw new AppError('Product not found');
        }

        const productExists = await this.productRepository.findByName(obj.name);
        if (productExists) {
            throw new AppError('There is already a product with this name');
        }
        return this.productRepository.save(obj);
    }

    public async listProducts(): Promise<Product[] | undefined> {
        return this.productRepository.find();
    }

    public async delete(id: string): Promise<void> {
        const product = await this.productRepository.findOne(id);
        if (!product) {
            throw new AppError('Product not found');
        }
        await this.productRepository.remove(product);
    }

    public async show(id: string): Promise<Product | undefined> {
        return await this.productRepository.findOne(id);
    }
}

export default ProductService;
