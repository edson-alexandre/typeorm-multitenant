import { Request, Response } from 'express';
import ProductService from '../services/ProductService';

export default class ProductController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const productService = new ProductService(request.conn);
        const products = await productService.listProducts();

        return response.json(products);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const productService = new ProductService(request.conn);
        const product = await productService.show(id);
        return response.json(product);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        // const { name, price, quantity } = request.body;

        const productService = new ProductService(request.conn);
        const product = await productService.createProduct({
            ...request.body,
        });

        return response.json(product);
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const productService = new ProductService(request.conn);
        const product = await productService.updateProduct({
            id,
            ...request.body,
        });
        return response.json(product);
    }

    public async delete(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const productService = new ProductService(request.conn);
        await productService.delete(id);
        return response.json([]);
    }
}
