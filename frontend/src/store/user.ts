import { defineStore } from 'pinia';
import { login, register, getMe } from '~/use/api';
import type { User } from '~/types';

export const useUserStore = defineStore('user', {
	state: () =>
		({
			token: '',
			loggedIn: false,
			username: '',
			uuid: '',
			isAdmin: false
		} as User),
	actions: {
		checkToken() {
			const user = localStorage.getItem('chibisafe-user');
			if (user) {
				const { token } = JSON.parse(user);
				if (!token) return;
				this.token = token;
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				void this.loginWithToken();
			}
		},
		async loginWithToken() {
			const response = await getMe();
			if (!response) return;

			this.username = response.username;
			this.uuid = response.uuid;
			this.apiKey = response.apiKey;
			this.isAdmin = response.isAdmin;
			this.loggedIn = true;
		},
		async login(username: string, password: string) {
			if (!username || !password) return;
			const response = await login(username, password);

			// TODO: Error handling
			if (!response) return;
			if (!response.token) return;

			this.token = response.token;
			this.username = response.username;
			this.uuid = response.uuid;
			this.apiKey = response.apiKey;
			this.isAdmin = response.isAdmin;
			this.loggedIn = true;

			localStorage.setItem(
				'chibisafe-user',
				JSON.stringify({
					username: this.username,
					uuid: this.uuid,
					apiKey: this.apiKey,
					isAdmin: this.isAdmin,
					token: this.token
				})
			);
		},
		async register(username: string, password: string) {
			if (!username || !password) return;
			const response = await register(username, password);

			// TODO: Error handling
			if (!response) return;

			// eslint-disable-next-line no-alert
			alert('Successfully registered! You can now login.');
		},
		logout() {
			localStorage.removeItem('chibisafe-user');
			// @ts-ignore
			window.location.reload(true);
		}
	}
});
