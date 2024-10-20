export const DATABASE_URL = process.env.DATABASE_URL as string;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_WINDOWS = process.env.OS === 'WINDOWS';

export const PORT = process.env.PORT as string;

export const MASTER_KEY = process.env.MASTER_KEY as string;

export const JWT_SECRET = process.env.JWT_SECRET ?? 'jwt-secret';
export const JWT_EXPIRE = process.env.JWT_EXPIRE ?? '3m';
export const API_SECRET = process.env.API_SECRET ?? 'api-secret';
export const REFRESH_SECRET = process.env.REFRESH_SECRET ?? 'refresh-secret';
export const REFRESH_EXPIRE = process.env.REFRESH_EXPIRE ?? '28d';
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60;

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';

export const LOGO_PATH = '/static/assets/logo-primary.svg';

export enum Cookie {
	Auth = 'auth-cookie',
	Refresh = 'refresh-cookie',
}
export enum UserLevel {
	DummyAgent = 10,
	Agent = 20,
	Admin = 50,
	Master = 100,
}

export enum Path {
	Misc = '/static/misc/',
	Media = '/static/media/',
}

export enum TaskStatus {
	Pending = 'pending',
	InProgress = 'in-progress',
	Paused = 'paused',
	AcceptedUnderReview = 'accepted-under-review',
	RejectedUnderReview = 'rejected-under-review',
	Completed = 'completed',
	Rejected = 'rejected',
}
