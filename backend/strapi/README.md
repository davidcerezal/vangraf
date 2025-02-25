# Aegir backend

## deploy
First of all create a .env file with the following content:

```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS=2nL+O932rwBkWfNVVz1jhA==,MKNKzlNJpgDjzzjpI0i1Xg==,D1zpSGRL6Koir6ICQ3kEgA==,mq/KV4c3nnuCtk973z8KrA==
API_TOKEN_SALT=g9BGUJG9QU7q8TibVnQ5vA==
ADMIN_JWT_SECRET=PZk8m3koZBoPTv39FA4TWA==
TRANSFER_TOKEN_SALT=DcWeA63xRJIM9U35tG6Mpg==
# Database
DATABASE_CLIENT=postgres
JWT_SECRET=gb6vTSKQwp35Kun8feQfRQ==
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=.....
DATABASE_NAME=aegir_db
DATABASE_SCHEMA=public
```

After that create a postgres database aegir_db and restore the dump from the backups folder.

Then you can deploy the backend with the following command:

```bash
npm i
npm run develop
```

After that you should run docker-compose to make the backend available to the internet:

```bash
docker-compose up -d
```

# Usage

- After starting the backend you can access it via localhost:1337.


# Strapi 4 socket.io

In the 'index.ts' file, in the bootstrap method its possible to create a global variable where all the connections are stored. This global variable is then available system-wide, an can be used to notify clients. This can be used to notify a change on the database using webhooks. See bellow.

```bash
import { Strapi } from '@strapi/strapi';

export default {

  register({ strapi }: { strapi: Strapi }) {


  },

  bootstrap(/* { strapi } */) {
    
    //strapi.server.httpServer is the new update for Strapi V4
    const io = require("socket.io")(strapi.server.httpServer, {
      cors: { // cors setup
        origin: '*',
        methods: ["GET", "POST"],
        credentials: false,
      },
    });

    io.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    io.on('connection', function (socket) {
      // send message on user connection
      socket.emit('aegirconnection', JSON.stringify({
        date: new Date().toISOString(),
        message: 'Welcome to my AEGIR notification service!',
      }));

    });

    /* HANDLE CLIENT SOCKET LOGIC HERE */
    // store the server.io instance to global var to use elsewhere
    // @ts-ignore:
    strapi.ioServer = io;

  },
};
```

# Strapi 4 Content-Type hooks (https://strapi.io/blog/understanding-the-different-types-categories-of-strapi-hooks)

Content-Type hooks are used to trigger an event when something happen in a table, for instance: Update a registry, add a registry... you can configure the hook to run before or after the event is executed.  To do so, capitalize the first letter of the event name and prefix it with before or after.

To create a web hooks its mandatory to create a file named 'lifecycles.ts' in the table we are going to watch over.   the model file ./api/[api-name]/content-types/[content-type-name]/lifecycles.ts with its respective lifecycle hooks. In this projet the path for Alert api is: ./api/alert/content-types/alert/lifecycles.ts
Inside this file here is the content: (watching update and insert events):

```bash
export default {
    async afterCreate(event) {
        // @ts-ignore:
        strapi.ioServer.sockets.emit(
            'alertUpdated', JSON.stringify({
                date: new Date().toISOString(),
                message: ' Alert table registry created!',
            }));
    },

    async afterUpdate(event) {

        // @ts-ignore:
        strapi.ioServer.sockets.emit(
            'alertUpdated', JSON.stringify({
                date: new Date().toISOString(),
                message: ' Alert table registry updated!',
            }));

    },
}
```
