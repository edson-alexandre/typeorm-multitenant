import { Router } from 'express';
import UserController from '../controllers/UserController';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/', userController.save);
userRouter.get('/', userController.list);

export default userRouter;
