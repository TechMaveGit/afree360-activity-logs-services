import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import dotenv from "dotenv";
dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Activity Logs Service API',
      version: '1.0.0',
      description: 'System log recording and analytics metrics API',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: process.env.BASE_URL,
        description: 'Development Server',
      },
    ],
  },
  apis: [
    path.join(process.cwd(), './routes/**/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
