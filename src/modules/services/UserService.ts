import UsersRepository from '../repositories/UsersRepository';
import { Connection } from 'typeorm';
import User from '../entities/User';
import AppError from '../../shared/errors/AppError';

interface IRequest {
    id?: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export default class UserService {
    userRepository: UsersRepository;

    constructor(conn: Connection) {
        this.userRepository = conn.getCustomRepository(UsersRepository);
    }

    public async list(): Promise<User[]> {
        return this.userRepository.find();
    }

    public async save(obj: IRequest): Promise<User> {
        const email = await this.userRepository.findByEmail(obj.email);
        if (email) {
            throw new AppError('Email already in use');
        }
        const user = await this.userRepository.create(obj);
        await this.userRepository.save(user);
        return user;
    }
}
