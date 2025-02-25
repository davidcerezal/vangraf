
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