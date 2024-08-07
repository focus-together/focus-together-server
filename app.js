const express = require("express");
const expressSanitizer = require("express-sanitizer");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json"); // 입력
const dotenv = require("dotenv");
// fs and https 모듈 가져오기
const https = require("https");
const fs = require("fs");

const app = express();
dotenv.config();

console.log("HTTPS_CERT_PATH:", process.env.HTTPS_CERT_PATH);
console.log("HTTPS_KEY_PATH:", process.env.HTTPS_KEY_PATH);
const cert = fs.readFileSync(process.env.HTTPS_CERT_PATH, "utf8");
const key = fs.readFileSync(process.env.HTTPS_KEY_PATH, "utf8");

// certificate와 private key 가져오기
const options = {
  key: key,
  cert: cert,
};

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());

// swagger 설정
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// 라우트 설정
app.use("/api", authRoutes);

// 서버동작
const HTTP_PORT = process.env.HTTP_PORT || 8000;
const HTTPS_PORT = process.env.HTTPS_PORT || 8080;

app.listen(HTTP_PORT, () => {
  console.log(`Server started on port ${HTTP_PORT}`);
});

// https 의존성으로 certificate와 private key로 새로운 서버를 시작
https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server started on port 8080`);
});
