import { AppointmentModel } from './appoinment.model.js';

export class AppointmentRepository {
    async create(appointmentData) {
        const appointment = new AppointmentModel(appointmentData);

        return appointment.save();
    }

    async find(filter = {}, options = {}) {
        const {
            populate = [],
            sort = { appointmentDate: -1 },
            skip = 0,
            limit = 0,
        } = options;

        let query = AppointmentModel.find(filter);

        populate.forEach((field) => {
            query = query.populate(field);
        });

        return query.sort(sort).skip(skip).limit(limit);
    }

    async findOne(filter = {}) {
        return AppointmentModel.findOne(filter);
    }

    async findById(appointmentId) {
        return AppointmentModel.findById(appointmentId)
            .populate('patientId')
            .populate('doctorId');
    }

    async findByPatientId(patientId, query = {}) {
        const {
            page = 1,
            limit = 10,
            status,
            sortBy = 'appointmentDate',
            sortOrder = 'desc',
        } = query;

        const skip = (page - 1) * limit;

        const filter = { patientId };

        if (status) {
            filter.status = status;
        }

        const sortObj = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };

        const [appointments, total] = await Promise.all([
            this.find(filter, {
                populate: [
                    {
                        path: 'doctorId',
                        populate: [
                            {
                                path: 'userId',
                            },
                        ],
                    },
                    {
                        path: 'patientId',
                        populate: [
                            {
                                path: 'userId',
                            },
                        ],
                    },
                ],
                sort: sortObj,
                skip,
                limit,
            }),

            AppointmentModel.countDocuments(filter),
        ]);

        return {
            appointments,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }

    async findByDoctorId(doctorId, query = {}) {
        const {
            page = 1,
            limit = 10,
            status,
            sortBy = 'appointmentDate',
            sortOrder = 'desc',
        } = query;

        const skip = (page - 1) * limit;

        const filter = { doctorId };

        if (status) {
            filter.status = status;
        }

        const sortObj = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };

        const [appointments, total] = await Promise.all([
            this.find(filter, {
                populate: [
                    {
                        path: 'patientId',
                        populate: {
                            path: 'userId',
                        },
                    },
                    {
                        path: 'doctorId',
                        populate: {
                            path: 'userId',
                        },
                    },
                ],
                sort: sortObj,
                skip,
                limit,
            }),

            AppointmentModel.countDocuments(filter),
        ]);

        return {
            appointments,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }

    async findAll(query = {}) {
        const {
            page = 1,
            limit = 10,
            status,
            sortBy = 'appointmentDate',
            sortOrder = 'desc',
        } = query;

        const skip = (page - 1) * limit;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        const sortObj = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };

        const [appointments, total] = await Promise.all([
            this.find(filter, {
                populate: ['patientId', 'doctorId'],
                sort: sortObj,
                skip,
                limit,
            }),

            AppointmentModel.countDocuments(filter),
        ]);

        return {
            appointments,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }

    async update(appointmentId, updateData) {
        return AppointmentModel.findByIdAndUpdate(appointmentId, updateData, {
            new: true,
        })
            .populate('patientId')
            .populate('doctorId');
    }

    async delete(appointmentId) {
        return AppointmentModel.findByIdAndDelete(appointmentId);
    }

    async getAppointmentStats() {
        return AppointmentModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
    }

    async getDoctorAppointmentStats(doctorId) {
        return AppointmentModel.aggregate([
            {
                $match: {
                    doctorId,
                },
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
    }
}

export const appointmentRepository = new AppointmentRepository();
