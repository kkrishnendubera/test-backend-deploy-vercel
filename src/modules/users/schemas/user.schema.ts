import { Schema as MongoSchema, Types, HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { compareSync, hashSync, genSaltSync, genSalt } from "bcrypt";
import { synchronizeNameFields } from "@helpers/utils.helper";

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: "Role", index: true })
  role: Types.ObjectId | string;

  @Prop({ type: String, default: "", index: true })
  firstName: string;

  @Prop({ type: String, default: "", index: true })
  lastName: string;

  @Prop({ type: String, default: "", index: true })
  fullName: string;

  @Prop({ type: String, default: "", index: true })
  email: string;

  @Prop({ type: String, default: "", index: true })
  userName: string;

  @Prop({ type: String, default: "" })
  password: string;

  @Prop({ type: String, default: "" })
  profileImage: string;

  @Prop({ type: String, default: "" })
  resetPasswordToken: string;

  @Prop({
    type: String,
    default: "Active",
    enum: ["Active", "Inactive"],
    index: true,
  })
  status: string;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  { email: 1, isDeleted: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

UserSchema.methods.validPassword = function (password: string) {
  return compareSync(password, this.password);
};
UserSchema.methods.generateHash = function (password: string) {
  return hashSync(password, genSaltSync(+process.env.SALT_ROUND));
};

UserSchema.pre("save", async function (next: any) {
  let user = this as Partial<UserDocument>;
  user = synchronizeNameFields(user);
  if (!user.isModified("password")) return next();
  const salt = await genSalt(10);
  const hash = hashSync(user.password, salt);
  user.password = hash;

  next();
});

UserSchema.pre("findOneAndUpdate", async function (next: any) {
  let update = this.getUpdate() as Partial<UserDocument>;
  if (!update) return next();
  update = synchronizeNameFields(update);
  if (update.password) {
    const salt = await genSalt(10);
    update.password = hashSync(update.password, salt);
  }
  this.setUpdate(update);
  next();
});

export type UserDocument = HydratedDocument<User> & {
  validPassword: (password: string) => boolean;
  generateHash: (password: string) => string;
};
