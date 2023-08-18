"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            url: "http://localhost:3500",
            description: "This is the local server",
        },
    ],
    apis: [
        "./src/routes/*.ts",
        "./src/routes/items/*.ts", // Routes in the routes/api directory
    ],
};
const swaggerDoc = swaggerJSDoc(options);
module.exports = swaggerDoc;
//# sourceMappingURL=swagger.js.map