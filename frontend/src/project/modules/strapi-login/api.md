## Classes

<dl>
<dt><a href="#Login">Login</a></dt>
<dd><p>This module created a window to register a new user or login with existing credentials and manages the 
    session of the user and his permissions.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#Constructor">Constructor(props)</a></dt>
<dd><p>Create login module</p>
</dd>
<dt><a href="#openLoginForm">openLoginForm()</a></dt>
<dd><p>Opens login form</p>
</dd>
<dt><a href="#openRegisterUserForm">openRegisterUserForm()</a></dt>
<dd><p>Opens register user form</p>
</dd>
<dt><a href="#openRecoverPasswordForm">openRecoverPasswordForm()</a></dt>
<dd><p>Opens password recovery form</p>
</dd>
<dt><a href="#changePasswordForm">changePasswordForm()</a></dt>
<dd><p>Opens password change form</p>
</dd>
<dt><a href="#logout">logout()</a></dt>
<dd><p>Logs out from the system</p>
</dd>
<dt><a href="#setRegisterFormDefaultData">setRegisterFormDefaultData()</a></dt>
<dd><p>Sets the default form registration data</p>
</dd>
<dt><a href="#setRegisterFormExtraData">setRegisterFormExtraData(formExtraData)</a></dt>
<dd><p>Allows to add extra data to the registration form</p>
</dd>
</dl>

<a name="Login"></a>

## Login
This module created a window to register a new user or login with existing credentials and manages the 
	session of the user and his permissions.

**Kind**: global class  
<a name="Constructor"></a>

## Constructor(props)
Create login module

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | props {boolean register,Element container} |

<a name="openLoginForm"></a>

## openLoginForm()
Opens login form

**Kind**: global function  
**Example**  
```js
this.modules.login.openLoginForm();
```
<a name="openRegisterUserForm"></a>

## openRegisterUserForm()
Opens register user form

**Kind**: global function  
**Example**  
```js
this.modules.login.openRegisterUserForm();
```
<a name="openRecoverPasswordForm"></a>

## openRecoverPasswordForm()
Opens password recovery form

**Kind**: global function  
**Example**  
```js
this.modules.login.openRecoverPasswordForm();
```
<a name="changePasswordForm"></a>

## changePasswordForm()
Opens password change form

**Kind**: global function  
**Example**  
```js
this.modules.login.changePasswordForm();
```
<a name="logout"></a>

## logout()
Logs out from the system

**Kind**: global function  
**Example**  
```js
this.modules.login.logout();
```
<a name="setRegisterFormDefaultData"></a>

## setRegisterFormDefaultData()
Sets the default form registration data

**Kind**: global function  
**Example**  
```js
this.modules.login.setRegisterFormDefaultData();
```
<a name="setRegisterFormExtraData"></a>

## setRegisterFormExtraData(formExtraData)
Allows to add extra data to the registration form

**Kind**: global function  

| Param | Type |
| --- | --- |
| formExtraData | <code>object</code> | 

**Example**  
```js
let formExtraData = [
			{
				type: formInput.TEXT,
				id: 'company',
				defAttributeId: 113, //id metabackend de definición de atributo
				attributeTypeId: 1041,//id metabackend del tipo de atributo
				mandatory: false,
				placeholder: i18n('company')
			},
			{
				type: formInput.TEXT,
				id: 'name',
				mandatory: true,
				placeholder: i18n('lgnUserNamePlc')
			},
			{
				type: formInput.TEXT,
				id: 'lastName',
				mandatory: true,
				placeholder: i18n('lgnLastNamePlc')
			},
			{
				type: formInput.TEXT,
				id: 'address',
				mandatory: true,
				placeholder: i18n('lgnAddressPlc')
			},
			{
				type: formInput.TEXT,
				id: 'city',
				mandatory: false,
				defAttributeId: 94, //id metabackend de definición de atributo
				attributeTypeId: 1035,//id metabackend del tipo de atributo
				placeholder: i18n('city')
			}, {
				type: formInput.COUNTRY,
				id: 'country',
				mandatory: false,
				defAttributeId: 110, //id metabackend de definición de atributo
				attributeTypeId: 1040,//id metabackend del tipo de atributo
				placeholder: i18n('country')
			}, {
				type: formInput.EMAIL,
				id: 'email',
				mandatory: true,
				placeholder: i18n('lgnEmailPlc')
			},
			{
				type: formInput.PASSWORD,
				id: 'password',
				mandatory: true,
				placeholder: i18n('lgnPasswordPlc')
			},
			{
				type: formInput.PASSWORD,
				id: 'repassword',
				mandatory: true,
				placeholder: i18n('lgnRepeatPasswordPlc')
			}

		];
		this.modules.login.setRegisterFormFullData(formExtraData);
```
