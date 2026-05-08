import { DoctorModel } from './doctor.model.js';

export class DoctorRepository {
    create(data) {
        return DoctorModel.create(data);
    }

    findById(id) {
        return DoctorModel.findById(id).lean();
    }

    findAll(filter = {}) {
        return DoctorModel.find(filter)
            .sort({ lastName: 1, firstName: 1 })
            .lean();
    }

    findOne(filter) {
        return DoctorModel.findOne(filter).lean();
    }

    updateById(id, update) {
        return DoctorModel.findByIdAndUpdate(id, update, {
            returnDocument: 'after',
            runValidators: true,
        }).lean();
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
