import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// NoobsUserInfo 모델 정의
const NoobsUserInfo = sequelize.define('Noobs_user_info', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  puuid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tagLine: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secretId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileIconId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  summonerLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  latedQueueType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rank: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wins: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  losses: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  winRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default NoobsUserInfo;
