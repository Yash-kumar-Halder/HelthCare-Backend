import { ApiError } from '../../common/utils/api/api-error.js';
import bcrypt from 'bcrypt';
import { RoleModel } from '../role/role.model.js';
import { UserRepository } from './user.repository.js';

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser({ name, email, password, phone, role }) {
        if (!name || !email || !password || !phone || !role) {
            throw ApiError.badRequest('All fields are required');
        }

        const existUserWithEmail = await this.userRepository.findByEmail(email);
        if (existUserWithEmail) {
            throw ApiError.badRequest('User already exist with this email');
        }
        const existUserWithPhone = await this.userRepository.findByPhone(phone);
        if (existUserWithPhone) {
            throw ApiError.badRequest(
                'User already exist with this phone number',
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const roleDb = await RoleModel.findOne({
            name: String(role).toUpperCase(),
        });

        if (!roleDb) {
            return ApiError.badRequest('Invalid role');
        }

        const newUser = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: roleDb._id,
        });
        return newUser;
    }
    async findById(id) {
        return await this.userRepository.findById(id);
    }
    async findByEmail(email) {
        return await this.userRepository.findByEmailWithPassword(email);
    }
}
