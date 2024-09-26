import api from '@/lib/api';
import { signupSchema } from '@/schema/auth';
import { z } from 'zod';

export default class AuthService {
	static async isAuthenticated() {
		try {
			const { data } = await api.get('sessions/validate-auth', {
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					Expires: '0',
				},
				withCredentials: true,
			});
			return {
				authenticated: true,
				admin: data.isAdmin,
				agent: data.isAgent,
				master: data.isMaster,
			};
		} catch (err) {
			return {
				authenticated: false,
				admin: false,
				agent: false,
				master: false,
			};
		}
	}

	static async login(email: string, password: string) {
		try {
			const { data } = await api.post(`/sessions/login`, {
				email,
				password,
			});
			return {
				authenticated: true,
				admin: data.isAdmin,
				agent: data.isAgent,
				master: data.isMaster,
			};
		} catch (err) {
			return {
				authenticated: false,
				admin: false,
				agent: false,
				master: false,
			};
		}
	}

	static async logout() {
		try {
			await api.post(`/sessions/logout`);
			return true;
		} catch (err) {
			return false;
		}
	}

	static async register(details: z.infer<typeof signupSchema>) {
		try {
			const { data } = await api.post(`/sessions/register`, {
				name: `${details.firstName} ${details.lastName}`.trim(),
				phone: details.phone,
				email: details.email,
				password: details.password,
			});
			return {
				authenticated: true,
				admin: data.isAdmin,
				agent: data.isAgent,
				master: data.isMaster,
			};
		} catch (err) {
			return {
				authenticated: false,
				admin: false,
				agent: false,
				master: false,
			};
		}
	}

	static async forgotPassword(email: string, callbackURL: string) {
		try {
			await api.post(`/sessions/forgot-password`, {
				email,
				callbackURL,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async resetPassword(password: string, code: string) {
		try {
			await api.post(`/sessions/reset-password/${code}`, {
				password,
			});
			return true;
		} catch (err) {
			return false;
		}
	}

	static async userDetails() {
		try {
			const { data } = await api.get(`/sessions/details`);
			return {
				name: data.account.name ?? '',
				email: data.account.email ?? '',
				phone: data.account.phone ?? '',
				isMaster: data.account.isMaster ?? false,
				isAdmin: data.account.isAdmin ?? false,
				isAgent: data.account.isAgent ?? false,
			} as {
				name: string;
				email: string;
				phone: string;
				isMaster: boolean;
				isAdmin: boolean;
				isAgent: boolean;
			};
		} catch (err) {
			return null;
		}
	}

	static async updateProfileDetails(details: { name: string; email: string; phone: string }) {
		await api.post(`/sessions/details`, details);
	}
}
