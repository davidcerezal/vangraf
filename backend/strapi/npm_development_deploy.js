
const {execSync} = require('child_process');

execSync('npm install', { stdio: 'inherit' });
execSync('npm run start', { stdio: 'inherit' });