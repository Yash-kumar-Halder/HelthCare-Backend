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
    async listUsers(query = {}) {
        const filter = {};

        if (query.status) {
            filter.status = query.status;
        }

        if (query.role) {
            filter.role = query.role;
        }

        return await this.userRepository.findAll(filter, {
            populate: ['role'],
        });
    }

    async findById(id) {
        const user = await this.userRepository.findById(id, {
            populate: ['role'],
        });

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user;
    }

    async updateUser(id, body) {
        await this.findById(id);

        const update = {};

        if (body.name !== undefined) {
            update.name = body.name;
        }

        if (body.email !== undefined) {
            const existUser = await this.userRepository.findByEmail(body.email);
            if (existUser && String(existUser._id) !== id) {
                throw ApiError.badRequest('Email already in use');
            }
            update.email = body.email;
        }

        if (body.phone !== undefined) {
            const existUser = await this.userRepository.findByPhone(body.phone);
            if (existUser && String(existUser._id) !== id) {
                throw ApiError.badRequest('Phone number already in use');
            }
            update.phone = body.phone;
        }

        if (body.status !== undefined) {
            update.status = body.status;
        }

        const updatedUser = await this.userRepository.updateById(id, update);

        return await this.userRepository.findById(updatedUser._id, {
            populate: ['role'],
        });
    }

    async deleteUser(id) {
        await this.findById(id);

        return await this.userRepository.deleteById(id);
    }

    async findByEmail(email) {
        return await this.userRepository.findByEmailWithPassword(email);
    }
}
