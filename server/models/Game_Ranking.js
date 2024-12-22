import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Game_Ranking = sequelize.define('Game_Ranking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  queueType: {
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
  LP: {
    type: DataTypes.INTEGER,
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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default Game_Ranking;
