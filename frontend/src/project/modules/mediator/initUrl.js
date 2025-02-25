function initUrl() {
	console.log('Initializing URL and setting up session storage values...');
	let backendUrl;

	if (location.host === 'localhost:9002') {
		backendUrl ='http://localhost/backend/api';
	} else {
		backendUrl = '/backend/api';
	}

	sessionStorage.setItem('backendUrl', backendUrl);
	console.log('Backend URL set to:', backendUrl);
}

export default initUrl;
