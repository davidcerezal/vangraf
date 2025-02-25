import FeedBack from 'digicon-web-feedback/feedBack';
import { Login } from '../login';
import { Localization } from 'digicon-web-localization/localization';
import { initLocalStorage } from 'digicon-web-local-storage/localStorage';


let login;
initLocalization();

function initLocalization() {
	initLocalStorage('LOGIN_MODULE_');
	const localization = new Localization({
		container: 'localizationContainer',
		uiPrefix:'',
		languages: [{
			code: 'en-EN',
			txt: 'en'
		}, {
			code: 'es-ES',
			txt: 'es'
		}, {
			code: 'eu-ES',
			txt: 'eu'
		}],
		uiType: 'horizontal'
	});
	localization.subscribe('onInitialized', () => {
		init();
	});
	localization.init();
}

function init() {
	sessionStorage.setItem('backendUrl', 'http://localhost:1337');
	login = new Login({ register: true, container: 'login' });
	login.subscribe('onLogin', (userName) => {
		console.log('Logged in as ' + userName);
	});
	login.subscribe('openHtmlDialog', (dialogData) => {
		FeedBack.openHtmlDialog(dialogData.html, dialogData.buttons);
	});
	login.subscribe('onLogout', (logoutData) => {
		FeedBack.openHtmlDialog(logoutData.html, logoutData.buttons);
	});
	login.subscribe('closeFeedback', () => {
		FeedBack.closeFeedBack();
	});
	login.subscribe('openAlertMessage', (message) => {
		FeedBack.openAlertMessage(message);
	});
	login.subscribe('openInfoMessage', (message) => {
		FeedBack.openInfoMessage(message);
	});
	login.subscribe('onLogin', (userName) => {
		FeedBack.openInfoMessage(`Hola ${userName}`);
	});
	login.checkForgotPassword();
}
