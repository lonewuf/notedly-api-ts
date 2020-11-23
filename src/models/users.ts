import {
	addModelToTypegoose,
	buildSchema,
	mongoose,
	prop,
} from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class UserClass {
	@Field(() => ID)
	public _id: mongoose.Types.ObjectId;

	@Field()
	@prop({ required: true, unique: true })
	public username: string;

	@Field()
	@prop({ required: true, unique: true })
	public email: string;

	@prop()
	public password: string;

	@Field()
	@prop()
	public avatar: string;
}

const userSchema = buildSchema(UserClass);
const User = addModelToTypegoose(mongoose.model('User', userSchema), UserClass);

export { User };

// import mongoose from 'mongoose';

// export interface UserDocument extends mongoose.Document {
// 	username: string;
// 	email: string;
// 	password: string;
// }

// interface IUser {
// 	username: string;
// 	email: string;
// 	password: string;
// }

// interface UserModelInterface extends mongoose.Model<UserDocument> {
// 	build(attr: IUser): any;
// }

// const userSchema = new mongoose.Schema({
// 	username: {
// 		type: String,
// 		required: true,
// 		index: { unique: true },
// 	},
// 	email: {
// 		type: String,
// 		required: true,
// 		index: { unique: true },
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 	},
// });

// userSchema.statics.build = (attr: IUser) => {
// 	return new User(attr);
// };

// const User = mongoose.model<UserDocument, UserModelInterface>(
// 	'User',
// 	userSchema
// );

// export { User };
