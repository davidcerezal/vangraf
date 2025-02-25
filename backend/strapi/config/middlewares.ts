module.exports = [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '256mb',
      maxFileSize: 250 * 1024 * 1024
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
