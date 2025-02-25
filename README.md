Vangraf Skeleton
================

Este proyecto es un **skeleton** que combina un **frontend** en Node + Vite (o similar), un **backend** basado en **Strapi**, y otros servicios auxiliares (proxy NGINX, base de datos PostgreSQL, etc.) orquestados con **Docker Compose**. Su principal objetivo es mostrar cómo funciona el flujo de autenticación (login) contra la API de Strapi, así como servir de base para futuras mejoras (doble factor de autenticación, mejoras de UI, etc.).

Requisitos previos
------------------

*   **Docker** y **Docker Compose** instalados en tu máquina.
    
*   Un archivo .env con las variables de entorno necesarias (ver ejemplo en la raíz del proyecto).
    


Servicios con Docker Compose
----------------------------

El fichero docker-compose.yml (versión 3) define varios servicios:

1.  **proxy** (NGINX):
    
    *   Construido con el Dockerfile dentro de ./nginx\_reverse\_proxy/.
        
    *   Usa el archivo nginx.conf para enrutar las peticiones entrantes a los contenedores internos.
        
    *   Exponen los puertos 80 y 443.
        
2.  **frontend**:
    
    *   Imagen base node:22-alpine3.20.
        
    *   Expone el puerto 9002.
        
    *   Se monta el directorio ./frontend como /app dentro del contenedor.
        
    *   Realiza instalación con npm install y levanta el servidor de desarrollo con npm run dev.
        
    *   En producción, se podría cambiar a un build estático y servir archivos minificados.
        
3.  **backend** (Strapi):
    
    *   Se construye con el Dockerfile en ./backend/strapi.
        
    *   Expone el puerto 1337.
        
    *   Configurado para conectarse a la base de datos PostgreSQL (usando variables de entorno definidas en .env).
        
    *   Levanta un contenedor con Strapi.
        
4.  **database** (PostgreSQL):
    
    *   Imagen oficial de Postgres 16.
        
    *   Expone el puerto interno 5432.
        
    *   Se monta el directorio ./database/postgresql/ para persistir datos.
        
    *   Puede incluir scripts de inicialización en ./database/init.sql.
        
5.  **dbeaver** (opcional):
    
    *   Para acceder gráficamente a la base de datos a través de un navegador.
        
    *   Corre en el puerto indicado por la variable de entorno ${DBEAVER\_PORT} (por defecto 8978).
        

### Comandos básicos

*   bashCopiarEditardocker-compose up -dEsto descargará (o construirá) las imágenes necesarias, creará contenedores y los levantará en segundo plano.
    
*   bashCopiarEditardocker-compose logs -f(Puedes filtrar con docker-compose logs -f nombre\_del\_servicio)
    
*   bashCopiarEditardocker-compose down(Usar --volumes si quieres borrar también los volúmenes; ¡cuidado con datos importantes!)
    

URLs de acceso
--------------

*   **Frontend** (desarrollo): [http://localhost:9002/](http://localhost:9002/)
    
*   **Backend (Strapi)**: [http://localhost:1337/](http://localhost:1337/)
    
    *   Usuario admin de Strapi:**Email:** admin@vangraf.com**Password:** Van!t2pass
        
*   **Nginx Proxy**: [http://localhost/](http://localhost/) (si así estuviera configurado en el proxy)
    
*   **DBeaver** (opcional): http://localhost:8978/ (o el puerto que se haya definido)
    

Descripción del Flujo de Autenticación
--------------------------------------

1.  El **frontend** cuenta con un módulo Login (./frontend/src/strapi-login/login.js) y un **mediador** (./frontend/src/mediator/) que centraliza la lógica de inicialización y gestión de eventos (login, logout, cambio de contraseña, etc.).
    
2.  Se conecta al **backend** (Strapi) usando las rutas estándar de autenticación (/auth/local, /auth/local/register, etc.).
    
3.  En caso de credenciales correctas, Strapi devuelve un **JWT** y los datos del usuario. El frontend guarda:
    
    *   sessionStorage.setItem('jwt', token)
        
    *   sessionStorage.setItem('user', JSON.stringify(user))
        
4.  Dicho token se utiliza posteriormente para proteger llamadas a endpoints que requieran autenticación (autorización vía cabecera Bearer ).
    

Más información en la documentación oficial de Strapi:[Guide on Authenticating Requests with the REST API](https://strapi.io/blog/guide-on-authenticating-requests-with-the-rest-api)

### Cómo probar el login en local

1.  Ve a [http://localhost:9002/](http://localhost:9002/) y localiza el botón de **Login**.
    
2.  Haz clic en **Login** e introduce tus credenciales. (Si no tienes credenciales creadas, puedes ir al panel de Strapi en [http://localhost:1337/](http://localhost:1337/) y crear un nuevo usuario o usar los endpoints de registro).
    
3.  Al iniciar sesión con éxito, se mostrará la UI de usuario logueado, ocultándose el formulario de login.
    
4.  Desde ahí puedes probar cambio de contraseña, logout, etc.
    

Tareas Pendientes
-----------------

1.  **Implementar doble factor de autenticación (2FA)**
    
    *   Permitir habilitar/deshabilitar el 2FA por usuario.
        
    *   Utilizar sistemas como Google Authenticator o envío de código vía email/SMS.
        
    *   Integrar la verificación adicional dentro del flujo de Strapi.
        
2.  **Mejorar la visual de la funcionalidad de cambiar contraseña**
    
    *   Actualmente se abre un diálogo muy básico.
        
    *   Se podría crear un modal más elegante, con validaciones en tiempo real, mensajes más claros, iconos, etc.
        
3.  **Mover a templates lo que se tenga que mover**
    
    *   Gran parte de la interfaz (HTML) en el login y los formularios está embebida directamente en Javascript.
        
    *   Se podría refactorizar para usar un motor de plantillas (o marcos como React/Vue) y separar la lógica de la vista.
        