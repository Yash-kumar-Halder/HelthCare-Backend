import { DoctorModel } from './doctor.model.js';

export class DoctorRepository {
    create(data) {
        return DoctorModel.create(data);
    }

    async findById(id, options = {}) {
        const { populate = [], select = '' } = options;

        let query = DoctorModel.findById(id);

        if (select) {
            query = query.select(select);
        }

        populate.forEach((field) => {
            query = query.populate(field);
        });

        return await query.lean();
    }

    findAll(filter = {}, options = {}) {
        const query = DoctorModel.find(filter).sort({
            createdAt: -1,
        });

        if (options.populate) {
            options.populate.forEach((field) => {
                query.populate(field);
            });
        }

        return query.lean();
    }

    findOne(filter) {
        return DoctorModel.findOne(filter).lean();
    }

    async updateById(id, update, options = {}) {
        return await DoctorModel.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
            ...options,
        });
    }

    deleteById(id) {
        return DoctorModel.findByIdAndDelete(id).lean();
    }

    async approveById(id) {
        const data = await DoctorModel.findByIdAndUpdate(
            id,
            {
                isVerified: true,
            },
            {
                returnDocument: 'after',
            },
        ).lean();
        console.log(data);
        return data;
    }
}
