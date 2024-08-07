const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Focus Together API",
    version: "1.0.0",
    description: "API documentation for the Focus Together project",
  },
  host: "localhost:8080",
  schemes: ["http"], // 사용할 프로토콜
  securityDefinitions: {
    // JWT 인증을 위한 설정
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter JWT Bearer token **_only_**",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/authRoutes.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
