import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE, 
  process.env.DB_USERNAME, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // 콘솔에 SQL 쿼리 로그를 출력하지 않음
    timezone: '+09:00',  // 한국 표준시 (서울)로 설정
  }
);



export default sequelize;
