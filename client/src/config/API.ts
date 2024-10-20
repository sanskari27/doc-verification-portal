import axios from 'axios';
import AuthService from '../services/auth.service';
import { RoutePath, SERVER_URL } from './const';

const API = axios.create({
	baseURL: SERVER_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	withCredentials: true,
});

API.interceptors.response.use(
	async (response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.data?.title === 'SESSION_INVALIDATED' && !originalRequest._retry) {
			originalRequest._retry = true;
			const success = await AuthService.isAuthenticated();
			if (success) {
				return API(originalRequest);
			} else {
				window.location.assign(RoutePath.Login);
			}
		}

		return Promise.reject(error);
	}
);

export default API;
