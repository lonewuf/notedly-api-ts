import { AuthenticationError } from 'apollo-server-express';

export default (token: string) => {
	if (!token) {
		throw new AuthenticationError('You need to login first to do that');
	}
};
