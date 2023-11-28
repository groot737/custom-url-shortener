const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL shortener API',
      version: '1.0.0',
    },
    basePath: '/api',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: '', // Set bearerFormat to an empty string
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/api-route.js')], // Adjust the path as needed
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
