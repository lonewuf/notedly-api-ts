import { ContextType } from 'src/types';
import { mongoose } from '@typegoose/typegoose';
import {
	Arg,
	Ctx,
	FieldResolver,
	Mutation,
	Resolver,
	Root,
} from 'type-graphql';
import { NoteClass } from '../models/notes';
import { UserClass } from '../models/users';
import checkAuth from '../utils/checkAuth';
import { AuthenticationError } from 'apollo-server-express';

@Resolver(NoteClass)
export class NoteResolver {
	@FieldResolver(() => UserClass)
	async author(@Root() user: any, @Ctx() { models }: ContextType) {
		const foundUser = await models.User.findById(user.author);
		return foundUser;
	}

	@Mutation(() => NoteClass, { nullable: true })
	async newNote(
		@Arg('content') content: string,
		@Ctx() { user, models }: ContextType
	) {
		checkAuth(user.id);
		const note = await models.Note.create({
			_id: new mongoose.Types.ObjectId(),
			content,
			favoriteCount: 0,
			author: user.id,
			favoritedBy: [],
		});

		return note;
	}

	@Mutation(() => NoteClass, { nullable: true })
	async updateNote(
		@Arg('content') content: string,
		@Arg('id') id: string,
		@Ctx() { user, models }: ContextType
	) {
		checkAuth(user.id);
		const note = await models.Note.findById(id);
		if (note) {
			if (note?.author?.toString() === user.id) {
				return await models.Note.findOneAndUpdate(
					{
						_id: id,
					},
					{
						$set: { content },
					},
					{
						new: true,
					}
				);
			} else {
				throw new AuthenticationError(`You don't have permission to do thath.`);
			}
		} else {
			return null;
		}
	}
}
