---
sidebar_position: 1
---

# Login
Este módulo crea una ventana para insertar las credenciales de usuario y gestiona la sesion del usuario y sus permisos.

## Instalación
```shell
npm install digicon-web-login 
```
## Ejemplo de uso
```javascript
import { Login } from 'digicon-web-login';

this.modules.login = new Login({ register: true, container: 'login-div' });	
```

## Css
Añadir el import en el fichero main.css
```css
@import url("~digicon-web-login/login.css");
```
## Localización
Añadir en project/locale/localeConfig.json las siguientes lineas. Dentro de apps -> modules
```javascript
"modules": [
    "./node_modules/digicon-web-login/locale/login",
]
```
## Eventos 
```javascript
this.modules.login.subscribe('onLogin', (userName) => {
// userName string
// your code here
});
```
```javascript
this.modules.login.subscribe('onLogout', () => {
// your code here
});
```
```javascript
this.modules.login.subscribe('onUserRegistered', () => {	
// your code here
});
```
```javascript
this.modules.login.subscribe('onPasswordChanged', () => {	
// your code here
});
```
```javascript
this.modules.login.subscribe('closeFeedback', () => {	
// your code here
});
```
```javascript
this.modules.login.subscribe('openHtmlDialog', (data) => {	
// data Object {html, formButtons} 
// your code here
});
```
```javascript
this.modules.login.subscribe('openAlertMessage', (message) => {	
// message string
// your code here
});
```
### Como suscribirte a un evento
```javascript 
let instance = new EventTriggerClass();
instance.subscribe ('eventKey',(params)=> { });
```
## Dependencias digicon
- [digicon-web-model](https://git.code.tecnalia.com/stack-digicon/presentation/digicon-web-model)
- [digicon-web-localization](https://git.code.tecnalia.com/stack-digicon/presentation/digicon-web-localization)
- [digicon-web-forms](https://git.code.tecnalia.com/stack-digicon/presentation/digicon-web-forms)
