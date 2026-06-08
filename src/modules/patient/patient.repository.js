import { PatientModel } from './patient.model.js';

export class PatientRepository {
    create(data) {
        return PatientModel.create(data);
    }

    findById(id, options = {}) {
        const query = PatientModel.findById(id);

        if (options.populate) {
            options.populate.forEach((field) => {
                query.populate(field);
            });
        }

        return query.lean();
    }

    findAll(filter = {}, options = {}) {
        const query = PatientModel.find(filter).sort({
            lastName: 1,
            firstName: 1,
        });

        if (options.populate) {
            options.populate.forEach((field) => {
                query.populate(field);
            });
        }

        return query.lean();
    }

    findOne(filter) {
        return PatientModel.findOne(filter).lean();
    }

    updateById(id, update) {
        return PatientModel.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        }).lean();
    }

    deleteById(id) {
        return PatientModel.findByIdAndDelete(id).lean();
    }
}
