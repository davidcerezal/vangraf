import 'project/css/main.css';
import { Mediator } from 'project/modules/mediator/mediator';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

document.addEventListener('DOMContentLoaded', async () => {

	//version
	window.version = '?' + process.env.npm_package_version;
	//init
	new Mediator().init();
});