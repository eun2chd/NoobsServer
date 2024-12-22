import axios from "axios";
import dotenv from "dotenv";
import { Op, fn, col, literal } from "sequelize";
import NoobsUserInfo from "../models/Noobs_user_info.js";
import NoobsMasterChamp from "../models/Noobs_master_champ.js";
import NoobsRecentFriend from "../models/Noobs_Recent_Friend.js";
import Champion from "../models/Champion.js";
import Profile from "../models/Profile.js";
import RankInfo from "../models/RankInfo.js";
import TierScore from "../models/TierScore.js";
import GameRank from "../models/Game_Ranking.js";
import MatchDetails from "../models/MatchDetails.js";
import RankedMatch from "../models/RankedMatch.js";
import User from "../models/User.js";
import redis from "../redisClient.js"; // redisClient.js에서 가져오기
import moment from "moment-timezone";

// 'Asia/Seoul' 시간대로 현재 시간을 가져옴
const seoulTime = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

dotenv.config(); // .env 파일 로드
// 9/25 시즌3시작일로 고정

const time = new Date("2024-09-25");
const date = new Date();
let startTime = time.getTime();
let endTime = date.getTime();

// 밀리초를 초로 변환
const startTimeSecs = Math.floor(startTime / 1000); // 초 단위로 변환
const endTimeSecs = Math.floor(endTime / 1000); // 초 단위로 변환

const userSearch = async (req, res) => {
  let { userid, tagLine } = req.query;

  // 앞 뒤 공백제거
  userid = userid.trim();
  tagLine = tagLine.trim();

  // 필수 값 검증
  if (!userid || !tagLine) {
    return res.status(400).json({ message: "소환사 명을 입력하세요" });
  }

  // API 키 확인
  if (!process.env.RIOT_API_KEY) {
    return res.status(500).json({ message: "API KEY 를 확인하세요" });
  }

  const headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept-Language": "ko-KR",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    Origin: "https://developer.riotgames.com",
    "X-Riot-Token": process.env.RIOT_API_KEY,
  };

  try {
    // 1. DB에서 사용자 검색
    const user = await NoobsUserInfo.findOne({
      where: { gameName: userid, tagLine },
    });

    if (user) {
      return res.status(200).json({ message: "사용자 db 요청 완료" });
    }

    // 2. 사용자 정보 API 요청
    const accountUrl = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      userid
    )}/${encodeURIComponent(tagLine)}`;
    const accountResponse = await axios.get(accountUrl, { headers });
    const { puuid, gameName, tagLine: retrievedTagLine } = accountResponse.data;

    // 3. 소환사 정보 API 요청
    const summonerUrl = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    const summonerResponse = await axios.get(summonerUrl, { headers });
    const {
      id: secretId,
      profileIconId,
      summonerLevel,
    } = summonerResponse.data;

    // 4. 랭크 정보 API 요청
    const leagueUrl = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${secretId}`;
    const leagueResponse = await axios.get(leagueUrl, { headers });
    const rankedSoloData =
      leagueResponse.data.find(
        (entry) => entry.queueType === "RANKED_SOLO_5x5"
      ) || {};

    const {
      queueType: latedQueueType = "개인/2인 랭크 게임",
      tier = "Unranked",
      rank = "Unranked",
      wins = "nodata",
      losses = "nodata",
    } = rankedSoloData;
    const winRate =
      wins !== "nodata"
        ? ((wins / (wins + losses)) * 100).toFixed(1)
        : "nodata";

    // 5. 모스트 챔피언 데이터 API 요청
    const masteryUrl = `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=5`;
    const masteryResponse = await axios.get(masteryUrl, { headers });
    const masterData = masteryResponse.data;

    // 6. DB에 사용자 데이터 저장
    const newUser = await NoobsUserInfo.create({
      puuid,
      gameName,
      tagLine: retrievedTagLine,
      secretId,
      profileIconId,
      summonerLevel,
      latedQueueType,
      tier,
      rank,
      wins,
      losses,
      winRate,
    });

    // gameRank에 랭킹정보 저장하기
    // NoobsuserInfo -> id 값 -> gameId에 저장
    const leagueData = leagueResponse.data.map((item) => {
      const queueTypeT =
        item.queueType === "RANKED_FLEX_SR"
          ? "자유랭"
          : item.queueType === "RANKED_SOLO_5x5"
          ? "개인/2인랭"
          : "Unranked";
      const tier = item.tier || "Unranked";
      const rank = item.rank || "Unranked";

      const leaguePoints = item.leaguePoints || 0;
      const wins = item.wins || 0;
      const losses = item.losses || 0;

      return {
        queueTypeT,
        tier,
        rank,
        summonerId: item.summonerId,
        leaguePoints,
        wins,
        losses,
      };
    });

    const gameRankData = leagueData.map((item) => ({
      game_id: newUser.id,
      queueType: item.queueTypeT,
      tier: item.tier,
      rank: item.rank,
      LP: item.leaguePoints,
      wins: item.wins,
      losses: item.losses,
      winRate:
        item.wins && item.losses
          ? (item.wins / (item.wins + item.losses)) * 100
          : 0, // winRate 계산
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await GameRank.bulkCreate(gameRankData);

    // 7. DB에 모스트 챔피언 데이터 저장
    const mostChampExists = await NoobsMasterChamp.findOne({
      where: { user_id: newUser.id },
    });

    if (!mostChampExists) {
      for (const { championId, championLevel, championPoints } of masterData) {
        await NoobsMasterChamp.create({
          user_id: newUser.id,
          gameName: gameName,
          championId,
          championLevel,
          championPoints,
        });
      }
    }

    return res.status(200).json({ message: "사용자 데이터 등록 완료" });
  } catch (error) {
    console.error("API 요청 또는 DB 처리 중 에러 발생:", error);
    const status = error.response?.status || 500;

    const errorMessages = {
      404: "등록되지 않은 소환사 입니다.",
      403: "API 키 만료.",
      500: "서버 내부 오류가 발생했습니다.",
    };

    return res
      .status(status)
      .json({ message: errorMessages[status] || "알 수 없는 오류" });
  }
};

// 사용자 정보 갱신
const friendUserBrUpdate = async (req, res) => {
  const { user_id } = req.body;

  const headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept-Language": "ko-KR",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    Origin: "https://developer.riotgames.com",
    "X-Riot-Token": process.env.RIOT_API_KEY,
  };

  try {
    const userInfo = await NoobsUserInfo.findOne({
      where: {
        id: user_id,
      },
    });

    if (!userInfo) {
      return res.status(404).json({ message: "사용자가 존재하지 않습니다." });
    }

    // 갱신 시간 막아주기
    const currentTimeKST = moment().tz("Asia/Seoul");
    const lastUpdatedAt = moment(userInfo.updatedAt);
    const diffInMinutes = currentTimeKST.diff(lastUpdatedAt, "minutes");

    if (diffInMinutes < 5) {
      // 5분 이내라면, 업데이트 차단하고 응답
      return res.status(400).json({
        message: `${5 - diffInMinutes}분 후 다시 요청해주세요.`,
      });
    }

    const userPuuid = userInfo.puuid;

    // 게임이름/태그이름
    const accountUrl = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/${userPuuid}`;
    const accountResponse = await axios.get(accountUrl, { headers });
    const { gameName, tagLine } = accountResponse.data;

    // 소환사 정보
    const summonerUrl = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${userPuuid}`;
    const summonerResponse = await axios.get(summonerUrl, { headers });
    const {
      id: secretId,
      profileIconId,
      summonerLevel,
    } = summonerResponse.data;

    // 소환사 랭크 정보
    const leagueUrl = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${secretId}`;
    const leagueResponse = await axios.get(leagueUrl, { headers });
    const rankedSoloData =
      leagueResponse.data.find(
        (entry) => entry.queueType === "RANKED_SOLO_5x5"
      ) || {};

    const {
      tier = "Unranked",
      rank = "Unranked",
      wins = "nodata",
      losses = "nodata",
    } = rankedSoloData;
    const winRate =
      wins !== "nodata"
        ? ((wins / (wins + losses)) * 100).toFixed(1)
        : "nodata";

    const leagueData = leagueResponse.data.map((item) => {
      // queueType에 따라 랭크 종류 수정
      const queueType =
        item.queueType === "RANKED_FLEX_SR"
          ? "자유랭"
          : item.queueType === "RANKED_SOLO_5x5"
          ? "개인/2인랭"
          : "기타";

      // tier와 rank가 없으면 Unranked로 처리
      const tier = item.tier || "Unranked";
      const rank = item.rank || "Unranked";

      // leaguePoints, wins, losses 값이 없다면 0으로 초기화
      const leaguePoints = item.leaguePoints || 0;
      const wins = item.wins || 0;
      const losses = item.losses || 0;

      return {
        queueType,
        tier,
        rank,
        summonerId: item.summonerId,
        leaguePoints,
        wins,
        losses,
        winRate: wins && losses ? (wins / (wins + losses)) * 100 : 0, // winRate 계산
      };
    });

    // 모스트 챔피언 데이터
    const masteryUrl = `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${userPuuid}/top?count=5`;
    const masteryResponse = await axios.get(masteryUrl, { headers });
    const masterData = masteryResponse.data;

    // 랭크정보 업데이트
    for (const rankData of leagueData) {
      const existingData = await GameRank.findOne({
        where: {
          game_id: user_id,
          queueType: rankData.queueType,
        },
      });

      // 기존 데이터 존재하면 업데이트
      if (existingData) {
        await existingData.update({
          tier: rankData.tier,
          rank: rankData.rank,
          LP: rankData.leaguePoints,
          wins: rankData.wins,
          losses: rankData.losses,
          winRate: rankData.winRate,
          updatedAt: new Date(),
        });
      } else {
        // 없으면 새로 추가
        await GameRank.create({
          game_id: user_id,
          queueType: rankData.queueType,
          tier: rankData.tier,
          rank: rankData.rank,
          LP: rankData.leaguePoints,
          wins: rankData.wins,
          losses: rankData.losses,
          winRate: rankData.winRate,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // 사용자 정보 업데이트
    const resultUpdateUser = await NoobsUserInfo.update(
      {
        gameName,
        tagLine,
        secretId,
        profileIconId,
        summonerLevel,
        tier,
        rank,
        wins,
        winRate,
        updatedAt: seoulTime,
      },
      { where: { id: user_id } }
    );

    // 같이한 사용자 테이블 업데이트
    await NoobsRecentFriend.update(
      {
        gameName,
        tagLine,
        profileIconId,
        tier,
        rank,
        wins,
        losses,
        winRate,
        updatedAt: new Date(),
      },
      {
        where: {
          puuid: userPuuid,
        },
      }
    );

    if (resultUpdateUser[0] === 0) {
      return res.status(400).json({ message: "업데이트 실패" });
    }

    // 모스트 챔피언 업데이트
    const updatePromises = masterData.map(
      ({ championId, championLevel, championPoints }) => {
        return NoobsMasterChamp.update(
          {
            championLevel,
            championPoints,
            updatedAt: new Date(),
          },
          {
            where: {
              user_id: user_id,
              championId,
            },
          }
        );
      }
    );

    await Promise.all(updatePromises);

    // 랭크 매치 데이터 업데이트
    // 개인랭크 매치데이터 API 요청
    let start = 0;
    let count = 20;
    let matchs = [];
    while (true) {
      const matchUrl = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${userPuuid}/ids?startTime=${startTimeSecs}&endTime=${endTimeSecs}&queue=420&type=ranked&start=${start}&count=${count}`;

      try {
        const response = await axios.get(matchUrl, { headers });
        if (response.data.length === 0) break;
        response.data.forEach((matchId) =>
          matchs.push({ gameid: userInfo.id, matchid: matchId })
        );
        start += count;
        // if (start > 80) {
        //   break;
        // }
      } catch (error) {
        console.error("Error fetching matches:", error);
        break;
      }
    }
    // matchs 매치기록이 저장됨 해당 기록을 현재 DB에 matchid 가 존재하는지 검사
    const existingMatches = await RankedMatch.findAll({
      where: {
        matchid: matchs.map((m) => m.matchid), // 가져온 모든 matchid를 조회
      },
      attributes: ["matchid"], // 필요한 필드만 가져옴
    });

    const existingMatchIds = existingMatches.map((m) => m.matchid); // 이미 존재하는 matchid 배열

    // 중복되지 않은 matchid 필터링
    const newMatches = matchs.filter(
      (m) => !existingMatchIds.includes(m.matchid)
    );

    if (newMatches.length > 0) {
      // 중복되지 않은 데이터만 삽입
      await RankedMatch.bulkCreate(newMatches, { ignoreDuplicates: true });
    }

    const fetchWithRetry = async (url, options, retries = 10) => {
      let retryDelay = 6000;

      while (retries > 0) {
        try {
          const response = await axios.get(url, { headers: options.headers });

          if (!response || !response.data) {
            throw new Error(`Invalid response: ${url}`);
          }

          return response.data;
        } catch (error) {
          if (error.response && error.response.status === 429) {
            const retryAfter =
              error.response.headers["retry-after"] || retryDelay / 1000;
            console.warn(
              `Rate limit exceeded. Retrying after ${retryAfter} seconds...`
            );

            await new Promise((resolve) =>
              setTimeout(resolve, Math.max(retryAfter * 1000, retryDelay))
            );
            retryDelay = Math.min(retryDelay + 2000, 10000);
            retries--;
          } else {
            console.error("Error:", error.message);
            throw error;
          }
        }
      }

      throw new Error("Max retries reached");
    };

    const batchSize = 5;
    const batches = [];

    for (let i = 0; i < newMatches.length; i += batchSize) {
      const batch = newMatches.slice(i, i + batchSize);
      batches.push(batch);
    }

    const matchDetails = [];
    for (const batch of batches) {
      const batchResults = (
        await Promise.all(
          batch.map(async ({ matchid }) => {
            const MatchDetailUrl = `https://asia.api.riotgames.com/lol/match/v5/matches/${matchid}`;
            try {
              const matchData = await fetchWithRetry(MatchDetailUrl, {
                headers,
              });

              const playerData = matchData.info.participants.find(
                (p) => p.puuid === userPuuid
              );
              if (!playerData) return null;

              return {
                matchid: matchData.metadata.matchId,
                puuid: playerData.puuid,
                gameName: playerData.riotIdGameName,
                tagLine: playerData.riotIdTagline,
                kills: playerData.kills,
                deaths: playerData.deaths,
                assists: playerData.assists,
                championId: playerData.championId,
                win: playerData.win,
                teamPosition: playerData.teamPosition,
                timePlayed: Math.floor(matchData.info.gameDuration / 60),
                gameCreation: new Date(
                  matchData.info.gameCreation
                ).toLocaleString("ko-KR"),
                gameStartTimestamp: new Date(
                  matchData.info.gameStartTimestamp
                ).toLocaleString("ko-KR"),
                gameEndTimestamp: new Date(
                  matchData.info.gameEndTimestamp
                ).toLocaleString("ko-KR"),
              };
            } catch (error) {
              console.error(`Error fetching match ${matchid}:`, error);
              return null;
            }
          })
        )
      ).filter(Boolean);

      matchDetails.push(...batchResults);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 배치 간 대기 시간
    }

    await MatchDetails.bulkCreate(matchDetails, { ignoreDuplicates: true });

    return res.status(200).json({ message: "소환사 업데이트 완료" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

// 같이 한 사용자 추가 로직
const userAdd = async (req, res) => {
  let { userid, tagLine } = req.body;

  // 세션 ID로 Redis에서 사용자 정보 가져오기
  console.log(req);
  const sessionId = req.sessionID; // 세션 ID
  const sessionData = await redis.get(`user:${sessionId}`);

  if (!sessionData) {
    return res
      .status(401)
      .json({ message: "세션 정보가 없습니다. 다시 로그인 해주세요." });
  }

  const noobs = JSON.parse(sessionData); // Redis에서 가져온 세션 데이터 파싱
  console.log(noobs);

  const FRIEND_MAX = 20; // 값 수정해서 최대 추가 유저 조정가능

  // 앞 뒤 공백제거
  userid = userid.trim();
  tagLine = tagLine.trim();

  if (!userid || !tagLine) {
    return res.status(400).json({ message: "소환사 명을 입력하세요" });
  }
  // 사용자 추가 제한 걸기
  try {
    const userFriendCount = await NoobsRecentFriend.count({
      where: {
        user_id: noobs.id,
      },
    });

    if (userFriendCount >= FRIEND_MAX) {
      return res.status(400).json({ message: "더이상 추가 할 수 없습니다." });
    }

    // 해당 사용자 db에서 검색
    // DB에서 사용자 검색
    const userSearchData = await NoobsUserInfo.findOne({
      where: {
        gameName: userid,
        tagLine: tagLine,
      },
    });

    if (!userSearchData) {
      res.status(404).json({ message: "해당 사용자를 찾을 수 없습니다. " });
    } else {
      // 추가되어있는 유저인지 확인
      // DB에서 사용자 검색
      const userFriendData = await NoobsRecentFriend.findOne({
        where: {
          user_id: noobs.id,
          gameName: userid,
          tagLine: tagLine,
        },
      });

      if (!userFriendData) {
        // DB 저장: 사용자 정보
        const user = await NoobsRecentFriend.create({
          user_id: req.session.user.id, // 세션에서 가져온 user_id 값
          puuid: userSearchData.puuid,
          gameName: userSearchData.gameName,
          tagLine: userSearchData.tagLine,
          profileIconId: userSearchData.profileIconId,
          tier: userSearchData.tier,
          rank: userSearchData.rank,
          wins: userSearchData.wins,
          losses: userSearchData.losses,
          winRate: userSearchData.winRate,
        });

        return res.status(200).json({ message: "사용자 추가 완료!" });
      } else {
        return res.status(400).json({ message: "이미 추가된 유저입니다. " });
      }
    }
  } catch (error) {
    console.error("DB 처리 중 에러 발생:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 같이한 사용자 불러오기
const friendUserBr = async (req, res) => {
  // 세션 ID로 Redis에서 사용자 정보 가져오기
  console.log(req);
  const sessionId = req.sessionID; // 세션 ID
  const sessionData = await redis.get(`user:${sessionId}`);

  if (!sessionData) {
    return res
      .status(401)
      .json({ message: "세션 정보가 없습니다. 다시 로그인 해주세요." });
  }

  const noobs = JSON.parse(sessionData); // Redis에서 가져온 세션 데이터 파싱


  try {
    const friendUser = await NoobsRecentFriend.findAll({
      where: {
        user_id: noobs.id,
      },
    });

    // 친구가 없을 경우
    if (!friendUser || friendUser.length === 0) {
      return res
        .status(404)
        .json({ message: "같이한 사용자 목록이 없습니다." });
    }

    // 친구 정보를 비동기적으로 처리
    const updatedFriends = await Promise.all(
      friendUser.map(async (friend) => {
        const champData = await NoobsMasterChamp.findAll({
          where: {
            gameName: friend.gameName,
          },
          limit: 3, // 최대 3개의 챔피언 데이터만 가져옴
        });

        const updateUser = await NoobsUserInfo.findOne({
          where: {
            gameName: friend.gameName,
          },
        });

        const updateId = updateUser.dataValues.id;

        const profileData = await Profile.findOne({
          where: {
            Profile_key: friend.profileIconId,
          },
        });

        const userRankImg = await RankInfo.findOne({
          where: {
            rank: friend.tier,
          },
        });

        const userRankScore = await TierScore.findOne({
          where: {
            rank: friend.tier,
            tier: friend.rank,
          },
        });

        const userPosition = ""; // 포지션 빈값 추가

        friend.dataValues.position = userPosition;
        friend.dataValues.updateId = updateId;
        friend.dataValues.tierImg = userRankImg;
        friend.dataValues.tierScore = userRankScore;
        friend.dataValues.profileInfo = profileData;
        friend.dataValues.MostChamp = champData;

        // 챔피언 데이터 처리
        if (champData.length > 0) {
          await Promise.all(
            champData.map(async (champ) => {
              const champDataMost = await Champion.findOne({
                where: {
                  champKey: champ.dataValues.championId,
                },
              });
              champ.dataValues.champInfo = champDataMost;
            })
          );
        }

        return friend;
      })
    );

    return res.status(200).json({ data: updatedFriends });
  } catch (error) {
    console.error("API 요청 또는 DB 처리 중 에러 발생:", error);
    return res.status(500).json({
      message: "서버 내부 오류가 발생했습니다.",
    });
  }
};

// 같이한 사용자 삭제하기
const friendUserBrDel = async (req, res) => {
  const { user_id } = req.body;

  // 세션 ID로 Redis에서 사용자 정보 가져오기
  console.log(req);
  const sessionId = req.sessionID; // 세션 ID
  const sessionData = await redis.get(`user:${sessionId}`);

  if (!sessionData) {
    return res
      .status(401)
      .json({ message: "세션 정보가 없습니다. 다시 로그인 해주세요." });
  }
  const noobs = JSON.parse(sessionData); // Redis에서 가져온 세션 데이터 파싱
  
  try {
    const delUser = await NoobsRecentFriend.destroy({
      where: {
        user_id: noobs.id,
        id: user_id,
      },
    });

    if (delUser == 0) {
      return res.status(404).json({ message: "사용자가 존재하지 않습니다." });
    }

    return res.status(200).json({ message: "삭제 완료" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

// 유저 프로필 정보 불러오기 [ 디테일한 정보 전체 요청 ]
const UserDetilsInfo = async (req, res) => {
  const { gameid } = req.body;

  try {
    // 유저 정보 조회
    const userInfo = await NoobsUserInfo.findOne({
      where: {
        id: gameid,
      },
    });

    // 유저 프로필 이미지 조회
    const userProfile = await Profile.findOne({
      where: {
        Profile_key: userInfo.profileIconId,
      },
    });

    // 랭크정보 조회
    const rankInfo = await GameRank.findAll({
      where: {
        game_id: gameid,
      },
      order: [["queueType", "ASC"]],
    });

    if (rankInfo.length === 0) {
      rankInfo.push({ RankData: "null" });
    } else if (rankInfo.length === 1) {
      // 객체가 1개일 경우
      const rank = rankInfo[0];
      if (rank.queueType === "개인/2인랭") {
        const RankImg = await RankInfo.findOne({
          where: {
            rank: rank.tier,
          },
        });

        rank.dataValues.RankImg = RankImg;
      } else if (rank.queueType === "자유랭") {
        const rank = rankInfo[0];
        const RankImg = await RankInfo.findOne({
          where: {
            rank: rank.tier,
          },
        });
        rank.dataValues.RankImg = RankImg;
      }
    } else if (rankInfo.length === 2) {
      const tiers = rankInfo.map((rank) => rank.tier);

      const rankImages = await RankInfo.findAll({
        where: {
          rank: tiers,
        },
      });

      rankInfo.forEach((rank) => {
        const matchImg = rankImages.find((img) => img.rank === rank.tier);
        rank.dataValues.RankImg = {
          id: matchImg.id,
          rank: matchImg.rank,
          rankImg: matchImg.rankImg,
          createdAt: matchImg.createdAt,
          updatedAt: matchImg.updatedAt,
        };
      });
    }

    // 유저 모스트챔피언 추출
    const MasterChamp = await NoobsMasterChamp.findAll({
      where: {
        user_id: gameid,
      },
    });

    if (MasterChamp.length > 0) {
      // 유저의 모스트 챔피언 배열을 순회하면서 처리
      for (let i = 0; i < MasterChamp.length; i++) {
        const champ = MasterChamp[i]; // champ는 MasterChamp 테이블에서 하나씩 가져온 객체

        // champ.championId로 Champion 테이블에서 champKey를 조회
        const champDataMost = await Champion.findOne({
          where: {
            champKey: champ.championId, // champKey로 조회
          },
        });

        if (champDataMost) {
          // 챔피언 데이터가 존재하면 champInfo에 데이터 추가
          champ.dataValues.champInfo = {
            id: champDataMost.id,
            name: champDataMost.name,
            champKey: champDataMost.champKey,
            imgUrl: champDataMost.champ_img, // 챔피언 이미지 경로 추가
          };
        } else {
          // 챔피언 데이터가 없으면 기본값 설정
          champ.dataValues.champInfo = {
            id: null,
            name: "Unknown Champion",
            champKey: champ.championId,
            imgUrl: "default_image_url", // 기본 이미지 경로
          };
        }
      }
    }

    // 전적데이터 그룹화 하기
    const userMatchChampMost = await MatchDetails.findAll({
      attributes: [
        "championId",
        [fn("SUM", col("kills")), "total_kills"],
        [fn("SUM", col("deaths")), "total_deaths"],
        [fn("SUM", col("assists")), "total_assists"],
        [
          fn(
            "ROUND",
            literal(
              `(
                CASE WHEN SUM(deaths) = 0 THEN 0
                ELSE (SUM(kills) + SUM(assists)) / SUM(deaths)
                END
              )`
            ),
            1
          ),
          "kda",
        ],
        [fn("COUNT", col("*")), "games_played"],
      ],
      where: {
        puuid: userInfo.puuid,
        timePlayed: { [Op.gte]: 15 },
      },
      group: ["championId"],
      order: [[literal("games_played"), "DESC"]],
      limit: 10,
    });

    if (userMatchChampMost.length > 0) {
      // 유저의 모스트 챔피언 배열을 순회하면서 처리
      for (let i = 0; i < userMatchChampMost.length; i++) {
        const userMost = userMatchChampMost[i]; // champ는 MasterChamp 테이블에서 하나씩 가져온 객체

        // champ.championId로 Champion 테이블에서 champKey를 조회
        const champUserData = await Champion.findOne({
          where: {
            champKey: userMost.championId, // champKey로 조회
          },
        });

        if (champUserData) {
          // 챔피언 데이터가 존재하면 champInfo에 데이터 추가
          userMost.dataValues.champInfo = {
            id: champUserData.id,
            name: champUserData.name,
            champKey: champUserData.champKey,
            imgUrl: champUserData.champ_img, // 챔피언 이미지 경로 추가
          };
        } else {
          // 챔피언 데이터가 없으면 기본값 설정
          champUserData.dataValues.champInfo = {
            id: null,
            name: "Unknown Champion",
            champKey: userMost.championId, // 챔피언 ID를 userMost에서 가져옴
            imgUrl: "default_image_url", // 기본 이미지 경로
          };
        }
        userMost[i] = champUserData.toJSON();
      }
    }

    const positionMap = {
      TOP: "탑",
      JUNGLE: "정글",
      MIDDLE: "미드",
      BOTTOM: "원딜",
      UTILITY: "서폿",
    };

    const userPosition = await MatchDetails.findAll({
      attributes: [
        "teamPosition", // 포지션별로 그룹화
        [fn("COUNT", col("id")), "totalGame"], // 게임 횟수
      ],
      group: ["teamPosition"], // 포지션별로 그룹화
      where: {
        puuid: userInfo.puuid,
        teamPosition: {
          [Op.in]: ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"], // 원하는 포지션만 필터링
        },
      },
      order: [["totalGame", "DESC"]], // 게임 횟수 기준으로 내림차순 정렬
    });

    // 기본 포지션 설정
    const defaultPositions = [
      { teamPosition: "탑", totalGame: 0 },
      { teamPosition: "정글", totalGame: 0 },
      { teamPosition: "미드", totalGame: 0 },
      { teamPosition: "원딜", totalGame: 0 },
      { teamPosition: "서폿", totalGame: 0 },
    ];

    const positionData = defaultPositions
      .map((defaultPos) => {
        // userPosition에서 해당 포지션을 찾고, 있으면 값을 덮어씀
        const found = userPosition.find(
          (item) => positionMap[item.teamPosition] === defaultPos.teamPosition
        );

        return {
          teamPosition: defaultPos.teamPosition,
          totalGame: found ? found.dataValues.totalGame : defaultPos.totalGame,
        };
      })
      .sort((a, b) => b.totalGame - a.totalGame);
    userInfo.dataValues.Profile = userProfile;

    return res.status(200).json({
      userInfo,
      rankInfo,
      MasterChamp: MasterChamp.map((champ) => champ.toJSON()),
      userMatchMost: userMatchChampMost,
      positionData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

const nobsinfo = async (req, res) => {
  try {
    const NobsUser = await User.findOne({
      where: {
        id: req.session.user.id,
      },
    });
    return res.status(200).json({ data: NobsUser });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
  }
};

export {
  userSearch,
  userAdd,
  friendUserBr,
  friendUserBrUpdate,
  friendUserBrDel,
  UserDetilsInfo,
  nobsinfo,
};
