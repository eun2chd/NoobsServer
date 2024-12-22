import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const RankInfo = sequelize.define('RankInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  rank: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rankImg: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default RankInfo;
