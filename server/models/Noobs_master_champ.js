import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Champion 모델 정의
const NoobsMasterChamp  = sequelize.define('Noobs_master_champ', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gameName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  championId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  championLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  championPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default NoobsMasterChamp;
