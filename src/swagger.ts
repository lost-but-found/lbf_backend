const swaggerJSDoc = require("swagger-jsdoc");

// Swagger configuration options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LostButFound",
      version: "1.0.0",
      description: "API documentation for Lost But Found Application.",
      contact: "lostbutfounditemsapp@gmail.com",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  servers: [
    {
      url: "http://localhost:3500", // Update with your server URL
      description: "This is the local server",
    },
  ],
  apis: [
    "./src/routes/*.ts", // Routes in the routes directory
    "./src/routes/items/*.ts", // Routes in the routes/api directory
  ],
};

const swaggerDoc = swaggerJSDoc(options);

module.exports = swaggerDoc;
