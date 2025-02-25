/**
 * @module Mediator
 */
import { jwtDecode } from 'jwt-decode';
import initUrl from './initUrl.js';
import { Login } from './../strapi-login/login.js';
import { User } from './../strapi-login/user.js';
// ... si tienes una función initLocalStorage, la importas, p.ej.:
// import { initLocalStorage } from './localStorageUtil.js';

export class Mediator {
	constructor() {
		this.modules = {};
		this.managers = {};
		this.inputScreens = [];
		this.forms = [];
		this.structure = {};
		this.isFilledForm = {};
	}

	async init() {
		// Setea la URL de backend en sessionStorage (http://localhost:1337, etc.)
		initUrl();
		this.initLogin();
	}

	initLogin() {
		const userData = sessionStorage.getItem('user');
		const jwtToken = sessionStorage.getItem('jwt');
		let user = null;
		let userIsLogged = false;

		// Instanciamos el CustomLogin
		this.modules.login = new Login({ register: false, container: 'login' });
		document.getElementById('splash').dataset.visible = false;

		if (
			userData && userData !== 'null' &&
			jwtToken && jwtToken !== 'null'
		) {
			document.getElementById('splash').dataset.visible = false;
			const decodedUserData = JSON.parse(userData);
			user = new User(decodedUserData);

			// Decodificamos el token para validar
			const decryptedToken = jwtDecode(jwtToken);
			if (decryptedToken.id === user.id) {
				this.modules.login._initLoggedInUI(user);
				this.modules.login.trigger('onLogin', user.getUserName(), user);
				userIsLogged = true;
			}
		}

		// Suscribimos eventos del login
		this.modules.login.subscribe('onLogin', async (userName) => {
			const loginContainer = document.getElementById('loginContainer');
			if (loginContainer) {
				loginContainer.style.display = 'none';
			}
			this.onLogin(userName);
		});

		this.modules.login.subscribe('onLogout', () => {
			console.log('Received onLogout event, reloading page...');
			window.onbeforeunload = null;
			document.location.reload();
		});

		// Ejemplo de openHtmlDialog y openAlertMessage
		this.modules.login.subscribe('openHtmlDialog', (e) => {
			console.log('Recibido openHtmlDialog:', e);
			// Podrías inyectar e.html en tu feedBackContainer
			const fb = document.getElementById('feedBackContainer');
			if (fb) {
				fb.innerHTML = e.html;
			}
		});
		this.modules.login.subscribe('openAlertMessage', (message) => {
			console.log('Mostrando alert:', message);
		});

		if (userIsLogged) {
			this.onLogin();
		} else {
			this.modules.login.openLoginForm();
		}
		document.getElementById('splash').dataset.visible = false;
	}

	async onLogin() {
		// Mostramos la UI
		document.querySelector('#login').dataset.hide = '';
		document.querySelector('header').dataset.hide = '';
		document.querySelector('main').dataset.hide = '';
		document.querySelector('aside').dataset.hide = 'hide';
	}

	onLogout() {
		// Ocultamos la UI
		document.querySelector('#login').dataset.hide = '';
		document.querySelector('header').dataset.hide = 'hide';
		document.querySelector('main').dataset.hide = 'hide';
		document.querySelector('aside').dataset.hide = 'hide';
		document.querySelector('nav').dataset.hide = 'hide';

		// Limpiamos la sesión
		sessionStorage.clear();
		// Aquí puedes cargar landing page o recargar
		// document.location.reload();
	}
}
