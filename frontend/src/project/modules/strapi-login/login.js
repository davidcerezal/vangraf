import { User } from './user';

export class Login {
  /**
   * Crea el módulo de Login
   * @constructor
   * @param {Object} props - {boolean register, string container, string strapiVersion}
   */
  constructor(props) {
    this.props = props;
    this.user = null;
    // Mapa de eventos con suscriptores. Clave = nombreEvento, Valor = array de callbacks
    this.events = {};

    this.apiPath = props.strapiVersion === 4 ? '/api' : '';
    this._initLoggedOutUI();
    this.setRegisterFormDefaultData();
  }

  /**
   * Método para suscribirse a un evento
   * @param {string} eventName - Nombre del evento, ej: 'onLogin'
   * @param {Function} callback - Función que se ejecutará cuando se dispare el evento
   */
  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  /**
   * Método para disparar un evento y notificar a todos los suscriptores
   * @param {string} eventName - Nombre del evento
   * @param {*} data - Datos que quieras pasar a los suscriptores
   */
  trigger(eventName, data) {
    console.log(`Trigger event: ${eventName}`, data);
    const callbacks = this.events[eventName];
    if (callbacks && callbacks.length) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  /**
   * Inicializa la interfaz para usuarios deslogueados
   * @private
   */
  _initLoggedOutUI() {
    // Limpia el sessionStorage
    sessionStorage.setItem('user', null);
    sessionStorage.setItem('jwt', null);
    sessionStorage.setItem('email', null);

    // Crea un botón "Login"
    const containerEl = document.getElementById(this.props.container);
    containerEl.innerHTML = '';
    const loginBtn = document.createElement('button');
    loginBtn.id = 'loginBtn';
    loginBtn.className = 'accessButton';
    loginBtn.textContent = 'Login';
    containerEl.appendChild(loginBtn);

    loginBtn.addEventListener('click', () => {
      this.openLoginForm();
    });
  }

  /**
   * Inicializa la interfaz para usuarios logueados
   * @private
   * @param {Object} user - Datos del usuario
   */
  _initLoggedInUI(user) {
    const containerEl = document.getElementById(this.props.container);
    containerEl.innerHTML = '';
  
    // Contenedor principal
    const userOptions = document.createElement('div');
    userOptions.id = 'userOptions';
    userOptions.className = 'userOptions';
  
    // Zona superior (nombre de usuario) que actúa como disparador del menú
    const userHeader = document.createElement('div');
    userHeader.id = 'userNick';
    userHeader.className = 'userNickHeader';
    userHeader.textContent = user.username;
  
    // Menú desplegable (por defecto, oculto)
    const menu = document.createElement('div');
    menu.id = 'userMenu';
    menu.style.display = 'none';
  
    // Botones del menú
    const changePassBtn = document.createElement('button');
    changePassBtn.id = 'changePassword';
    changePassBtn.className = 'userOption';
    changePassBtn.textContent = 'Change password';
    // Evento para abrir formulario de cambio de contraseña
    changePassBtn.addEventListener('click', () => {
      this.changePasswordForm();
    });
  
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logOut';
    logoutBtn.className = 'userOption';
    logoutBtn.textContent = 'Logout';
    // Evento para cerrar sesión
    logoutBtn.addEventListener('click', () => {
      this.logout();
    });
  
    // Añadimos los botones al menú
    menu.appendChild(changePassBtn);
    menu.appendChild(logoutBtn);
  
    // Al hacer click en el encabezado, se oculta/muestra el menú
    userHeader.addEventListener('click', () => {
      menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
    });
  
    // Agregamos todo al contenedor principal
    userOptions.appendChild(userHeader);
    userOptions.appendChild(menu);
    containerEl.appendChild(userOptions);
  }  

  /**
   * Cierra sesión
   */
  logout() {
    this._initLoggedOutUI();
    this.trigger('onLogout');
  }

  /**
   * Verifica si hay un código de recuperación de contraseña en la URL
   */
  checkForgotPassword() {
    if (new URL(location.href).searchParams.get('code') !== null) {
      this.resetPasswordForm();
    }
  }

  /**
   * Abre formulario de Login
   */
  openLoginForm() {
    // Crea un contenedor modal (o usa tu propio sistema de diálogo)
    const dialog = this._createDialog('Login');
    // Espacio para mensajes de error
    const errorPanel = document.createElement('div');
    errorPanel.id = 'lgnLoginErrorPanel';
    errorPanel.style.color = 'red';

    // Inputs
    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email:';
    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.id = 'email';

    const passLabel = document.createElement('label');
    passLabel.textContent = 'Password:';
    const passInput = document.createElement('input');
    passInput.type = 'password';
    passInput.id = 'password';

    // Botones
    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'Login';
    loginBtn.addEventListener('click', () => {
      this._doLogin(emailInput.value, passInput.value, errorPanel);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      this._closeDialog(dialog);
    });

    // Si se permite registro
    if (this.props.register === true) {
      const forgotBtn = document.createElement('button');
      forgotBtn.textContent = 'Forgot password';
      forgotBtn.addEventListener('click', () => {
        this._closeDialog(dialog);
        this.openRecoverPasswordForm();
      });

      const registerBtn = document.createElement('button');
      registerBtn.textContent = 'Register';
      registerBtn.addEventListener('click', () => {
        this._closeDialog(dialog);
        this.openRegisterUserForm();
      });

      dialog.content.appendChild(forgotBtn);
      dialog.content.appendChild(registerBtn);
    }

    dialog.content.appendChild(emailLabel);
    dialog.content.appendChild(emailInput);
    dialog.content.appendChild(passLabel);
    dialog.content.appendChild(passInput);
    dialog.content.appendChild(errorPanel);
    dialog.content.appendChild(loginBtn);
    dialog.content.appendChild(cancelBtn);

    // Añade el diálogo al DOM
    document.body.appendChild(dialog.container);
  }

  /**
   * Llamada a login (petición fetch)
   */
  async _doLogin(email, password, errorPanel) {
    if (!email || !password) {
      errorPanel.textContent = 'Please fill all fields.';
      return;
    }
    errorPanel.textContent = 'Logging in...';

    try {
      const rawResponse = await fetch(
        `${sessionStorage.getItem('backendUrl')}${this.apiPath}/auth/local`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            identifier: email,
            password: password
          })
        }
      );
      const userData = await rawResponse.json();

      if (rawResponse.status === 200) {
        sessionStorage.setItem('user', JSON.stringify(userData.user));
        sessionStorage.setItem('email', userData.user.email);
        sessionStorage.setItem('jwt', userData.jwt);
        this._closeAllDialogs(); // Cierra cualquier diálogo
        this._initLoggedInUI(userData.user);
        this.trigger('onLogin', userData.user.username);
      } else {
        errorPanel.textContent = 'Invalid email or password.';
      }
    } catch (error) {
      errorPanel.textContent = 'Error contacting server.';
    }
  }

  /**
   * Abre formulario de registro
   */
  openRegisterUserForm() {
    const dialog = this._createDialog('Register');
    const errorPanel = document.createElement('div');
    errorPanel.id = 'lgnRegisterErrorPanel';
    errorPanel.style.color = 'red';

    // Creamos inputs de registro (definidos en this.registerFormData)
    const inputs = {};
    this.registerFormData.forEach((field) => {
      const label = document.createElement('label');
      label.textContent = field.placeholder + ':';
      const input = document.createElement('input');
      input.type = (field.type === 'password') ? 'password'
        : (field.type === 'email') ? 'email'
          : 'text';
      input.id = field.id;
      dialog.content.appendChild(label);
      dialog.content.appendChild(input);
      inputs[field.id] = input;
    });

    const registerBtn = document.createElement('button');
    registerBtn.textContent = 'Register';
    registerBtn.addEventListener('click', () => {
      errorPanel.textContent = '';
      this._doRegister(inputs, errorPanel);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      this._closeDialog(dialog);
    });

    dialog.content.appendChild(errorPanel);
    dialog.content.appendChild(registerBtn);
    dialog.content.appendChild(cancelBtn);

    document.body.appendChild(dialog.container);
  }

  /**
   * Llamada fetch para registro
   */
  async _doRegister(inputs, errorPanel) {
    // Validaciones básicas
    for (let key in inputs) {
      if (!inputs[key].value) {
        errorPanel.textContent = 'All fields are required.';
        return;
      }
    }

    // Chequeo de contraseñas idénticas si existen password/repassword
    if (inputs['password'] && inputs['repassword'] &&
      inputs['password'].value !== inputs['repassword'].value) {
      errorPanel.textContent = 'Passwords do not match.';
      return;
    }

    // Construimos el usuario
    const newUser = this._importRegistrationDataFromFormData({
      username: inputs['username']?.value,
      email: inputs['email']?.value
    });

    try {
      const rawResponse = await fetch(
        `${sessionStorage.getItem('backendUrl')}${this.apiPath}/auth/local/register`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: newUser.username,
            email: newUser.email,
            password: inputs['password'].value
          })
        }
      );

      if (rawResponse.status === 200) {
        // Cerramos formulario
        this._closeAllDialogs();
        // Se inicia sesión de forma "inmediata" o muestra UI logueado
        this._initLoggedInUI(newUser);
        this.trigger('onUserRegistered');
      } else {
        errorPanel.textContent = 'Registration error. Check your data.';
      }
    } catch (error) {
      errorPanel.textContent = 'Error contacting server.';
    }
  }

  /**
   * Abre formulario de recuperación de contraseña
   */
  openRecoverPasswordForm() {
    const dialog = this._createDialog('Recover Password');

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email:';
    const emailInput = document.createElement('input');
    emailInput.type = 'email';

    const errorPanel = document.createElement('div');
    errorPanel.style.color = 'red';

    const recoverBtn = document.createElement('button');
    recoverBtn.textContent = 'Recover';
    recoverBtn.addEventListener('click', () => {
      this.forgotPasswordCall(emailInput.value, errorPanel);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      this._closeDialog(dialog);
    });

    dialog.content.appendChild(emailLabel);
    dialog.content.appendChild(emailInput);
    dialog.content.appendChild(errorPanel);
    dialog.content.appendChild(recoverBtn);
    dialog.content.appendChild(cancelBtn);

    document.body.appendChild(dialog.container);
  }

  /**
   * Llamada fetch para recuperar contraseña
   */
  async forgotPasswordCall(email, errorPanel) {
    if (!email) {
      errorPanel.textContent = 'Please provide an email.';
      return;
    }
    try {
      const rawResponse = await fetch(
        `${sessionStorage.getItem('backendUrl')}${this.apiPath}/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            url: 'http://localhost'
          })
        }
      );

      if (rawResponse.status === 200) {
        this._closeAllDialogs();
        alert('Check your email for a recovery link.');
      } else {
        errorPanel.textContent = 'Error sending recovery email.';
      }
    } catch (error) {
      errorPanel.textContent = 'Error contacting server.';
    }
  }

  /**
   * Abre formulario para resetear contraseña (cuando hay un code en la URL)
   */
  resetPasswordForm() {
    const dialog = this._createDialog('Reset Password');

    const passLabel = document.createElement('label');
    passLabel.textContent = 'New Password:';
    const passInput = document.createElement('input');
    passInput.type = 'password';

    const repassLabel = document.createElement('label');
    repassLabel.textContent = 'Confirm Password:';
    const repassInput = document.createElement('input');
    repassInput.type = 'password';

    const errorPanel = document.createElement('div');
    errorPanel.id = 'lgnChangePasswordErrorPanel';
    errorPanel.style.color = 'red';

    const changeBtn = document.createElement('button');
    changeBtn.textContent = 'Change Password';
    changeBtn.addEventListener('click', () => {
      if (!passInput.value || !repassInput.value) {
        errorPanel.textContent = 'Please fill all fields.';
        return;
      }
      this.resetPasswordCall(passInput.value, repassInput.value, errorPanel);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      this._closeDialog(dialog);
    });

    dialog.content.appendChild(passLabel);
    dialog.content.appendChild(passInput);
    dialog.content.appendChild(repassLabel);
    dialog.content.appendChild(repassInput);
    dialog.content.appendChild(errorPanel);
    dialog.content.appendChild(changeBtn);
    dialog.content.appendChild(cancelBtn);

    document.body.appendChild(dialog.container);
  }

  /**
   * Llamada fetch para resetear contraseña
   */
  async resetPasswordCall(password, rePassword, errorPanel) {
    if (password !== rePassword) {
      errorPanel.textContent = 'Passwords do not match.';
      return;
    }
    try {
      const rawResponse = await fetch(
        `${sessionStorage.getItem('backendUrl')}${this.apiPath}/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code: new URL(location.href).searchParams.get('code'),
            password: password,
            passwordConfirmation: rePassword
          })
        }
      );

      if (rawResponse.status === 200) {
        this._closeAllDialogs();
        alert('Your password has been changed successfully.');
      } else {
        errorPanel.textContent = 'Error changing password.';
      }
    } catch (error) {
      errorPanel.textContent = 'Error contacting server.';
    }
  }

  /**
   * Abre formulario para cambiar contraseña
   */
  changePasswordForm() {
    const dialog = this._createDialog('Change Password');

    const oldPassLabel = document.createElement('label');
    oldPassLabel.textContent = 'Current Password:';
    const oldPassInput = document.createElement('input');
    oldPassInput.type = 'password';

    const passLabel = document.createElement('label');
    passLabel.textContent = 'New Password:';
    const passInput = document.createElement('input');
    passInput.type = 'password';

    const repassLabel = document.createElement('label');
    repassLabel.textContent = 'Confirm New Password:';
    const repassInput = document.createElement('input');
    repassInput.type = 'password';

    const errorPanel = document.createElement('div');
    errorPanel.id = 'lgnChangePasswordErrorPanel';
    errorPanel.style.color = 'red';

    const changeBtn = document.createElement('button');
    changeBtn.textContent = 'Change';
    changeBtn.addEventListener('click', () => {
      if (!oldPassInput.value || !passInput.value || !repassInput.value) {
        errorPanel.textContent = 'Please fill all fields.';
        return;
      }
      this._doChangePassword(
        oldPassInput.value,
        passInput.value,
        repassInput.value,
        errorPanel
      );
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      this._closeDialog(dialog);
    });

    dialog.content.appendChild(oldPassLabel);
    dialog.content.appendChild(oldPassInput);
    dialog.content.appendChild(passLabel);
    dialog.content.appendChild(passInput);
    dialog.content.appendChild(repassLabel);
    dialog.content.appendChild(repassInput);
    dialog.content.appendChild(errorPanel);
    dialog.content.appendChild(changeBtn);
    dialog.content.appendChild(cancelBtn);

    document.body.appendChild(dialog.container);
  }

  /**
   * Llamada fetch para cambiar contraseña (con usuario logueado)
   */
  async _doChangePassword(oldPassword, newPassword, rePassword, errorPanel) {
    if (newPassword !== rePassword) {
      errorPanel.textContent = 'New passwords do not match.';
      return;
    }
    let requestData = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: sessionStorage.getItem('email'),
        password: oldPassword,
        newPassword: newPassword,
        confirmPassword: rePassword
      })
    };
    if (sessionStorage.getItem('jwt') !== null) {
      requestData.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('jwt');
    }
    try {
      const rawResponse = await fetch(
        `${sessionStorage.getItem('backendUrl')}${this.apiPath}/password`,
        requestData
      );
      if (rawResponse.status === 200) {
        this._closeAllDialogs();
        alert('Your password has been changed successfully.');
      } else {
        errorPanel.textContent = 'Error: current password may be incorrect.';
      }
    } catch (error) {
      errorPanel.textContent = 'Error contacting server.';
    }
  }

  /**
   * Define los campos de formulario para el registro básico
   */
  setRegisterFormDefaultData() {
    // Usamos strings en lugar de i18n
    this.registerFormData = [
      {
        type: 'text',
        id: 'username',
        placeholder: 'Username'
      },
      {
        type: 'email',
        id: 'email',
        placeholder: 'Email'
      },
      {
        type: 'password',
        id: 'password',
        placeholder: 'Password'
      },
      {
        type: 'password',
        id: 'repassword',
        placeholder: 'Repeat password'
      }
    ];
  }

  /**
   * Añade campos extra al registro
   */
  setRegisterFormExtraData(formExtraData) {
    this.registerFormData = this.registerFormData.concat(formExtraData);
  }

  /**
   * Sustituye totalmente los campos de registro
   */
  setRegisterFormFullData(formFullData) {
    this.registerFormData = formFullData;
  }

  /**
   * Extrae el usuario de los datos de registro
   * @private
   */
  _importRegistrationDataFromFormData(formData) {
    const params = {
      username: formData.username,
      email: formData.email,
      confirmed: false
    };
    const user = new User(params);
    return user;
  }

  /**
   * Crea un diálogo nativo (contenedor) con título y contenido
   * @private
   */
  _createDialog(titleText) {
    // Contenedor principal
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';

    // Contenido
    const content = document.createElement('div');
    content.style.backgroundColor = '#fff';
    content.style.padding = '20px';
    content.style.minWidth = '300px';
    content.style.borderRadius = '4px';

    const titleEl = document.createElement('h3');
    titleEl.textContent = titleText;
    content.appendChild(titleEl);

    container.appendChild(content);

    return { container, content };
  }

  /**
   * Cierra un diálogo concreto
   * @private
   */
  _closeDialog(dialog) {
    if (dialog && dialog.container) {
      document.body.removeChild(dialog.container);
    }
  }

  /**
   * Cierra todos los diálogos
   * @private
   */
  _closeAllDialogs() {
    const dialogs = document.querySelectorAll('body > div[style*="position: fixed"]');
    dialogs.forEach((dlg) => {
      document.body.removeChild(dlg);
    });
  }
}
