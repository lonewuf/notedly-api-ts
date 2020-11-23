import { User } from '../models/users';
import { RegisterInput } from '../resolvers/user';

export const validateRegister = async (input: RegisterInput) => {
	if (!input.email.includes('@')) {
		return [
			{
				field: 'email',
				message: 'Invalid email',
			},
		];
	}

	if (input.username.includes('@')) {
		return [
			{
				field: 'username',
				message: 'Invalid username',
			},
		];
	}

	if (input.username.length < 4) {
		return [
			{
				field: 'username',
				message: 'Length must be 5 or more characters',
			},
		];
	}

	if (input.password.length < 4) {
		return [
			{
				field: 'password',
				message: 'Length must be 5 or more characters',
			},
		];
	}

	const user = await User.findOne({ username: input.username });
	if (user) {
		return [
			{
				field: 'username',
				message: 'Username is already registered.',
			},
		];
	}

	const checkEmail = await User.findOne({ email: input.username });
	if (checkEmail) {
		return [
			{
				field: 'email',
				message: 'Email is already registered.',
			},
		];
	}

	return null;
};
