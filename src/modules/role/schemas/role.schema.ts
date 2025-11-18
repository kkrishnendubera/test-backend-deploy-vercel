import { StatusEnum } from '@common/enum/status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
const roleGroup = ['backend', 'frontend'];

@Schema({ timestamps: true, versionKey: false })
export class Role {
    @Prop({ type: String, required: true, index: true })
    role: string;

    @Prop({ type: String, required: true })
    roleDisplayName: string;

    @Prop({ type: String, default: 'frontend', enum: roleGroup })
    roleGroup: string;

    @Prop({ type: String, default: '' })
    description: string;

    @Prop({ type: String, default: 'Active', enum: StatusEnum, index: true })
    status: string;

    @Exclude()
    @Prop({ type: Boolean, default: false, index: true })
    isDeleted: boolean;
}

export type RoleDocument = HydratedDocument<Role>;
export const RoleSchema = SchemaFactory.createForClass(Role);

// # Index Configurations
RoleSchema.index({ role: 1, isDeleted: 1 });