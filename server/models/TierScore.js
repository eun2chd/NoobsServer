import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const TierScore = sequelize.define('TierScore', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  Rank: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  RankScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default TierScore;
