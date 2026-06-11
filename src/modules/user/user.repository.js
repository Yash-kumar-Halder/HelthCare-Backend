import { UserModel } from './user.model.js';

export class UserRepository {
    async create(userData) {
        return await UserModel.create(userData);
    }

    async findById(id, options = {}) {
        const { populate = [], select = '' } = options;

        let query = UserModel.findById(id);

        if (select) {
            query = query.select(select);
        }

        populate.forEach((field) => {
            query = query.populate(field);
        });

        return await query;
    }

    async findByEmail(email, options = {}) {
        const { populate = [], select = '' } = options;

        let query = UserModel.findOne({ email });

        if (select) {
            query = query.select(select);
        }

        populate.forEach((field) => {
            query = query.populate(field);
        });

        return await query;
    }

    async findByEmailWithPassword(email) {
        return await UserModel.findOne({ email })
            .select('+password')
            .populate('role');
    }

    async findAll(filter = {}, options = {}) {
        const { populate = [], select = '' } = options;

        let query = UserModel.find(filter);

        if (select) {
            query = query.select(select);
        }

        populate.forEach((field) => {
            query = query.populate(field);
        });

        return await query;
    }

    async findByPhone(phone, options = {}) {
        const { populate = [], select = '' } = options;

        let query = UserModel.findOne({ phone });

        if (select) {
            query = query.select(select);
        }

        populate.forEach((field) => {
            query = query.populate(field);
        });

        return await query;
    }

    async updateById(id, update) {
        return await UserModel.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        });
    }

    async deleteById(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}
