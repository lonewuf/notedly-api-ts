import { LoginInput } from 'src/resolvers/user';
import { User } from '../models/users';
import argon2 from 'argon2';

export const validateLogin = async (input: LoginInput) => {
	const user = await User.findOne({
		$or: [
			{ email: input.usernameOrEmail },
			{ username: input.usernameOrEmail },
		],
	});
	if (!user) {
		return [
			{
				field: 'usernameOrEmail',
				message: 'Username or email is not registered.',
			},
		];
	}

	const verify = await argon2.verify(user.password, input.password);
	if (!verify) {
		return [
			{
				field: 'password',
				message: 'Password is incorrect',
			},
		];
	}

	return null;
};
