import { application, Router } from 'express';
import productsRouter from '../../../modules/routes/products.routes';
import userRouter from '@modules/routes/user.routes';

const routes = Router();

routes.use('/products', productsRouter);

routes.use('/users', userRouter);

export default routes;
