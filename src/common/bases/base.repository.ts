import {
    FilterQuery,
    Model,
    ProjectionFields,
    Types,
    UpdateQuery,
} from 'mongoose';
import mongodb from 'mongodb';

export class BaseRepository<T> {
    private readonly model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async getAll(params: FilterQuery<T>): Promise<T[]> {
        return this.model.find(params);
    }

    async getAllByField(params: FilterQuery<T>): Promise<T[]> {
        return this.model.find(params);
    }

    async getByField(params: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(params);
    }

    async getById(id: Types.ObjectId | string): Promise<T | null> {
        return this.model.findById(id);
    }

    async getCountByParam(params: FilterQuery<T>): Promise<number> {
        return this.model.countDocuments(params);
    }

    async save(body: Partial<T>): Promise<T> {
        return this.model.create(body);
    }

    async updateById(
        data: UpdateQuery<T>,
        id: string | Types.ObjectId,
    ): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, {
            returnDocument: 'after',
        });
    }
    async saveMany(body: Partial<T> | Partial<T>[]): Promise<T[]> {
        return (await this.model.insertMany(body)) as T[];
    }
    async getDistinctDocument(
        field: string,
        params: FilterQuery<T>,
    ): Promise<unknown[]> {
        return this.model.distinct(field, params);
    }

    async getAllByFieldWithProjection(
        params: FilterQuery<T>,
        projection: ProjectionFields<T>,
    ): Promise<T[]> {
        return this.model.find(params, projection);
    }

    async getByFieldWithProjection(
        params: FilterQuery<T>,
        projection: ProjectionFields<T>,
    ): Promise<T | null> {
        return this.model.findOne(params, projection);
    }

    async delete(id: string | Types.ObjectId): Promise<T | null> {
        return this.model.findByIdAndDelete(id);
    }

    async bulkDelete(params: FilterQuery<T>): Promise<mongodb.DeleteResult> {
        return this.model.deleteMany(params);
    }

    async updateByField(
        data: UpdateQuery<T>,
        param: FilterQuery<T>,
    ): Promise<mongodb.UpdateResult> {
        return this.model.updateOne(param, data);
    }

    async updateAllByParams(
        data: UpdateQuery<T>,
        params: FilterQuery<T>,
    ): Promise<mongodb.UpdateResult> {
        return this.model.updateMany(params, { $set: data });
    }

    async bulkDeleteSoft(
        ids: Types.ObjectId[] | string[],
    ): Promise<mongodb.UpdateResult> {
        return this.model.updateMany(
            { _id: { $in: ids } },
            { $set: { isDeleted: true } },
        );
    }

    async saveOrUpdate(
        data: UpdateQuery<T>,
        id?: string | Types.ObjectId,
    ): Promise<T> {
        const isExists = id ? await this.model.findById(id) : null;
        if (isExists) {
            return this.model.findByIdAndUpdate(id, data, {
                returnDocument: 'after',
            });
        }
        return this.model.create(data);
    }
}