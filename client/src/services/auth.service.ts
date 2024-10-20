/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import API from '../config/API';
import { SERVER_URL } from '../config/const';

export default class AuthService {
	static async requestLoginOTP(email: string): Promise<string | null> {
		try {
			const { data } = await API.post('/auth/request-login', { email });
			return data.token;
		} catch (error: unknown) {
			return null;
		}
	}
	static async verifyOTP(token: string, otp: string): Promise<boolean> {
		try {
			const { data } = await API.post('/auth/login', { token, otp });
			return data.success;
		} catch (error: unknown) {
			return false;
		}
	}
	static async isAuthenticated() {
		try {
			const { data } = await axios.get(SERVER_URL + 'auth/validate-auth', {
				withCredentials: true,
			});
			return data.success;
		} catch (error: unknown) {
			return false;
		}
	}

	
}
