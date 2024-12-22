import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// NoobsUserInfo 모델 정의
const NoobsRecentFriend = sequelize.define('Noobs_Recent_Friend', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  puuid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tagLine: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileIconId: {
    type: DataTypes.INTEGER,
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
  Line: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  winRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default NoobsRecentFriend;
