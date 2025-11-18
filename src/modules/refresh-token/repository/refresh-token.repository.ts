import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/bases/base.repository';
import { RefreshToken, RefreshTokenDocument } from '../schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshTokenDocument> {
    constructor(
        @InjectModel(RefreshToken.name) RefreshTokenModel: Model<RefreshTokenDocument>,
    ) {
        super(RefreshTokenModel);
    }
}