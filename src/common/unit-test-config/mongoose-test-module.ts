import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';

let mongod: MongoMemoryServer;

export const RootMongooseTestModule = (options: MongooseModuleOptions = {}) => MongooseModule.forRootAsync({
    useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        const mongoUri = mongod.getUri();

        return {
            uri: mongoUri,
            ...options,
        }
    },
});

export const CloseInMongodConnection = async () => {
    await disconnect();
    if (mongod) await mongod.stop();
}