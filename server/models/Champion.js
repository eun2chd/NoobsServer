import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Champion 모델 정의
const Champion = sequelize.define('Champion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false, // 버전은 필수 항목
  },
  champKey: {
    type: DataTypes.STRING,
    allowNull: false, // 챔피언 키는 필수 항목
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // 챔피언 이름은 필수 항목
  },
  champ_img: {
    type: DataTypes.STRING,
    allowNull: false, // 챔피언 이미지 URL은 필수는 아니므로 allowNull: true
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default Champion;
