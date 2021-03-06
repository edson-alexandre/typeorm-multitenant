import { Router } from 'express';
import ProductController from '../controllers/ProductsController';
import { celebrate, Joi, Segments } from 'celebrate';

const productsRouter = Router();
const productsController = new ProductController();

productsRouter.get('/', productsController.index);

productsRouter.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    productsController.show,
);

productsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            price: Joi.number().precision(2).required(),
            quantity: Joi.number().precision(0).required(),
        },
    }),
    productsController.create,
);

productsRouter.put(
    '/:id',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            price: Joi.number().precision(2).required(),
            quantity: Joi.number().precision(0).required(),
        },
        [Segments.PARAMS]: {
            id: Joi.string().uuid(),
        },
    }),
    productsController.update,
);

productsRouter.delete(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    productsController.delete,
);

export default productsRouter;
