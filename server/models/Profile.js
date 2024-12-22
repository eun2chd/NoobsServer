import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Champion 모델 정의
const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // 기본 키 설정
    autoIncrement: true, // 자동 증가 설정
  },
  Profile_key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Profile_img: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

export default Profile;
