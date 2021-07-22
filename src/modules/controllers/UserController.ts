import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
    public async list(request: Request, response: Response): Promise<Response> {
        const userService = new UserService(request.conn);
        const users = await userService.list();
        return response.json(users);
    }

    public async save(request: Request, response: Response): Promise<Response> {
        const userService = new UserService(request.conn);
        const user = await userService.save({ ...request.body });
        return response.json(user);
    }
}
