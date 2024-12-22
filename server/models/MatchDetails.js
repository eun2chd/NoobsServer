import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const MatchDetails = sequelize.define('MatchDetails', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  matchid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
  kills: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deaths: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assists: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  championId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  win: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teamPosition: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timePlayed: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gameCreation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameStartTimestamp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameEndTimestamp: {
    type: DataTypes.STRING,
    allowNull: false,
  },

}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default MatchDetails;
