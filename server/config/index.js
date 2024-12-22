import NoobsUserInfo from "../models/Noobs_user_info.js";
import NoobsMasterChamp from "../models/Noobs_master_champ.js";
import NoobsRecentFriends from "../models/Noobs_Recent_Friend.js";
import GameRank from "../models/Game_Ranking.js"
import MatchDetails from "../models/MatchDetails.js";
import RankedMatch from "../models/RankedMatch.js";
import Users from "../models/User.js";



// 1:N (하나의 사용자 - 여러 개의 챔피언)
// NoobsUserInfo id값 -> MasterChamp user_id f키로 연결
NoobsUserInfo.hasMany(NoobsMasterChamp, {
  foreignKey : 'user_id',
  sourceKey: 'id',
  onDelete: 'CASCADE', 
});
// 1:N (하나의 사용자 - 여러 개의 챔피언)
// NoobsUserInfo id값 -> MasterChamp user_id f키로 연결
NoobsMasterChamp.belongsTo(NoobsUserInfo, {
  foreignKey: 'user_id',
  targetKey: 'id',
});


// 1:N (하나의 사용자 - 여러개의 랭크 [ 솔랭 / 자유랭 ])
// NoobsUserInfo id값 -> Game_Ranking game_id f키로 연결
NoobsUserInfo.hasMany(GameRank, {
  foreignKey : 'game_id',
  sourceKey: 'id',
  onDelete: 'CASCADE', 
});
// 1:N (하나의 사용자 - 여러개의 랭크 [ 솔랭 / 자유랭 ])
// NoobsUserInfo id값 -> Game_Ranking game_id f키로 연결
GameRank.belongsTo(NoobsUserInfo, {
  foreignKey: 'game_id',
  targetKey: 'id',
});

Users.hasMany(NoobsRecentFriends, {
  foreignKey: 'user_id', // Users.id와 연결
  as: 'AddedFriends'     // 별칭: 사용자가 추가한 친구들
});

NoobsRecentFriends.belongsTo(Users, {
  foreignKey: 'id', // Friends.friend_id는 Users.id를 참조
  as: 'FriendDetails'      // 별칭: 친구의 상세정보
});


// 유저와 매치 연결
NoobsUserInfo.hasMany(RankedMatch, {
  foreignKey : 'game_id',
  sourceKey: 'id',
  onDelete: 'CASCADE', 
});

RankedMatch.belongsTo(NoobsUserInfo, {
  foreignKey: 'game_id',
  targetKey: 'id',
});

// 매치와 디테일 정보 연결
// 유저와 매치 연결
RankedMatch.hasMany(MatchDetails, {
  foreignKey : 'match_id',
  sourceKey: 'id',
  onDelete: 'CASCADE', 
});

MatchDetails.belongsTo(RankedMatch, {
  foreignKey: 'match_id',
  targetKey: 'id',
});