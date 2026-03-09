import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DriveX API",
      version: "1.0.0",
      description: "Google Drive style cloud storage backend API",
    },
    servers: [
      {
        url: "https://drivex-backend-qrfb.onrender.com",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;