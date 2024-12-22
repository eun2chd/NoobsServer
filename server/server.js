import dotenv from "dotenv"; // dotenv 사용
dotenv.config();
import { fileURLToPath } from "url"; // fileURLToPath를 사용하여 현재 파일의 경로를 얻음
import express from "express"; // express 사용
import session from "express-session"; // express-session 사용
import apiRoute from "./routes/route.js"; // apiRoute 모듈 가져오기
import path from "path"; // path 모듈 가져오기
import sequelize from "./config/db.js"; // sequelize 설정 가져오기
import cors from "cors"; // cors 설정 추가 했습니다.

const app = express();
const PORT = 8000;

// 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET, // 세션 암호화 키
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, // 개발 중에는 false로 설정 (HTTPS에서만 true)
      maxAge: 30 * 60 * 1000, // 세션 만료 10분
    },
  })
);

// CORS 설정
app.use(
  cors({
    // origin: "http://127.0.0.1:5173", // 요청을 허용할 클라이언트 도메인
    origin: "http://15.165.204.99:5173", // 요청을 허용할 클라이언트 도메인
    credentials: true,
    methods: ["GET", "POST", "UPDATE", "PATCH"], // 허용할 HTTP 메서드
  })
);

app.use((req, res, next) => {
  next();
});




// 현재 파일의 경로를 __dirname처럼 사용하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // views 디렉토리 경로 설정

// 정적 파일 제공
app.use("/static", express.static(path.join(__dirname, "static"))); // static 디렉토리 경로 설정
// app.use("/", express.static(path.join(__dirname, "../client/dist"))); // 로컬 실행시 해당 코드 주석

app.use(express.urlencoded({ extended: true })); // 폼 데이터 파싱
app.use(express.json()); // JSON 데이터 파싱

// 라우터 연결
app.use("/", apiRoute);

app.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ sessionValid: true });
  } else {
    res.json({ sessionValid: false });
  }
});

// 홈 페이지 처리
app.get("/", (req, res) => {
  res.render("index");
});

// 404 페이지 처리
app.get("*", (req, res) => {
  res.render("404");
});

// DB 연결 후 서버 시작
sequelize
  .authenticate()
  .then(() => {
    console.log("DB 접속 완료");
    return sequelize.sync({ force: false }); // 테이블 자동 생성, force: false는 기존 테이블을 유지하면서 동기화
  })
  .then(() => {
    // 서버 실행
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
    });
  })
  .catch((err) => {
    console.error("DB 연결 실패:", err);
  });
