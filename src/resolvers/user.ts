import {
	Arg,
	Ctx,
	Field,
	Mutation,
	ObjectType,
	Resolver,
	InputType,
} from 'type-graphql';
import { ContextType } from '../types';
import { validateRegister } from '../utils/validateRegister';
import { validateLogin } from '../utils/validateLogin';
import argon2 from 'argon2';
import { gravatar } from '../utils/gravatar';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { mongoose } from '@typegoose/typegoose';

@InputType()
export class LoginInput {
	@Field()
	usernameOrEmail: string;

	@Field()
	password: string;
}

@InputType()
export class RegisterInput {
	@Field()
	username: string;

	@Field()
	email: string;

	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => String, { nullable: true })
	token?: string;
}

@Resolver()
export class UserResolver {
	@Mutation(() => UserResponse)
	async register(
		@Arg('input') input: RegisterInput,
		@Ctx() { models }: ContextType
	): Promise<UserResponse> {
		const errors = await validateRegister(input);
		if (errors) {
			return { errors };
		}

		const hashed = await argon2.hash(input.password);
		const avatar = gravatar(input.email);
		try {
			const user = await models.User.create({
				_id: new mongoose.Types.ObjectId(),
				email: input.email,
				username: input.username,
				password: hashed,
				avatar,
			});

			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
			return { token };
		} catch (err) {
			return {
				errors: [
					{
						field: '',
						message: 'Something went wrong on signing up.',
					},
				],
			};
		}
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg('input') input: LoginInput,
		@Ctx() models: ContextType
	): Promise<UserResponse> {
		const errors = await validateLogin(input);
		if (errors) {
			return { errors };
		}
		const user = await models.models.User.findOne({
			$or: [
				{ email: input.usernameOrEmail },
				{ username: input.usernameOrEmail },
			],
		});

		const token = jwt.sign({ id: user!._id }, process.env.JWT_SECRET!);
		return { token };
	}
}
