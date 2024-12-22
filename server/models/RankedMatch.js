import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const RankedMatch = sequelize.define('RankedMatch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  gameid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  matchid : {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default RankedMatch;
