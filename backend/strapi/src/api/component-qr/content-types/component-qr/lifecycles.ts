export default {
    async afterCreate(event) {
        // @ts-ignore:
        strapi.ioServer.sockets.emit(
            'componentQRCreated', JSON.stringify({
                date: new Date().toISOString(),
                message: 'Registry inserted in ComponentQR table',
                event:event,
            }));
    },

    async afterUpdate(event) {

        // @ts-ignore:
        strapi.ioServer.sockets.emit(
            'componentQRUpdated', JSON.stringify({
                date: new Date().toISOString(),
                message: 'Registry updated in ComponentQR table',
                event:event,
            }));

    },
}