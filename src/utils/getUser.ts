import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const getUser = (token: string) => {
	if (token) {
		try {
			return token ? jwt.verify(token, process.env.JWT_SECRET!) : '';
		} catch {
			return new Error('Session Invalid');
		}
	}
	return '';
};
