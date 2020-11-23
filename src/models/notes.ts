import {
	addModelToTypegoose,
	buildSchema,
	mongoose,
	prop,
	Ref,
} from '@typegoose/typegoose';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { UserClass } from './users';

@ObjectType()
export class NoteClass {
	@Field(() => ID)
	readonly _id: mongoose.Types.ObjectId;

	@prop({ required: true })
	@Field()
	public content: string;

	@Field(() => UserClass)
	@prop({ ref: () => UserClass, required: true })
	public author: Ref<UserClass>;

	@Field(() => Int)
	@prop({ default: 0 })
	public favoriteCount: number;

	@Field(() => [UserClass])
	@prop({ ref: () => UserClass })
	public favoritedBy: Ref<UserClass>[];
}

const noteSchema = buildSchema(NoteClass);
const Note = addModelToTypegoose(mongoose.model('Note', noteSchema), NoteClass);

export { Note };
