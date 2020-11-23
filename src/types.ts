import models from './models';

export type ContextType = {
	models: typeof models;
	user: { id: string; iat: number };
};
