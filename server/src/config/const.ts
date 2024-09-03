export const DATABASE_URL = process.env.DATABASE_URL as string;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_WINDOWS = process.env.OS === 'WINDOWS';

export const PORT = process.env.PORT !== undefined ? process.env.PORT : undefined;

export const JWT_SECRET = process.env.JWT_SECRET ?? 'jwt-secret';
export const JWT_EXPIRE = process.env.JWT_EXPIRE ?? '3m';
export const API_SECRET = process.env.API_SECRET ?? 'api-secret';
export const REFRESH_SECRET = process.env.REFRESH_SECRET ?? 'refresh-secret';
export const REFRESH_EXPIRE = process.env.REFRESH_EXPIRE ?? '28d';
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60;

export const COOKIE_DOMAIN_VALUE = process.env.COOKIE_DOMAIN_VALUE ?? 'localhost';

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';

export const LOGO_PATH = '/static/assets/logo-primary.svg';

export enum Cookie {
	Auth = 'auth-cookie',
	Refresh = 'refresh-cookie',
	Device = 'device-cookie',
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

export const CACHE_TIMEOUT = 60 * 60; //seconds
export const REFRESH_CACHE_TIMEOUT = 30 * 24 * 60 * 60; //seconds
