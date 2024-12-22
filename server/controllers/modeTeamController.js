import axios from "axios";
import XLSX from "xlsx";

//테스트 데이터 생성 함수 (예시)
//테스트용
const getTestData = async () => {
  return new Promise((resolve) => {
    const players = [
      { id: 1, gameName: "test1", RankScore: 10, position: "top" },
      { id: 2, gameName: "test2", RankScore: 15, position: "top" },
      { id: 3, gameName: "test3", RankScore: 20, position: "jug" },
      { id: 4, gameName: "test4", RankScore: 18, position: "jug" },
      { id: 5, gameName: "test5", RankScore: 12, position: "mid" },
      { id: 6, gameName: "test6", RankScore: 22, position: "mid" },
      { id: 7, gameName: "test7", RankScore: 14, position: "ad" },
      { id: 8, gameName: "test8", RankScore: 17, position: "ad" },
      { id: 9, gameName: "test9", RankScore: 13, position: "sup" },
      { id: 10, gameName: "test10", RankScore: 19, position: "sup" },
    ];

    setTimeout(() => resolve(players), 1000); // 1초 후 데이터를 반환
  });
};

const getTestDraftData = async () => {
  return new Promise((resolve) => {
    const players = [
      { id: 1, gameName: "test1", RankScore: 10, leader: true },
      { id: 2, gameName: "test2", RankScore: 15, leader: true },
      { id: 3, gameName: "test3", RankScore: 20 },
      { id: 4, gameName: "test4", RankScore: 18 },
      { id: 5, gameName: "test5", RankScore: 12 },
      { id: 6, gameName: "test6", RankScore: 22 },
      { id: 7, gameName: "test7", RankScore: 14 },
      { id: 8, gameName: "test8", RankScore: 17 },
      { id: 9, gameName: "test9", RankScore: 13 },
      { id: 10, gameName: "test10", RankScore: 19 },
    ];
    setTimeout(() => resolve(players), 1000); // 1초 후 데이터를 반환
  });
};

// 랜덤 팀 분배
const generateRandTeam = (players) => {
  // 포지션별 그룹화
  const positions = {
    탑: [],
    정글: [],
    미드: [],
    원딜: [],
    서폿: [],
  };

  // 플레이어 포지션 분류
  players.forEach((player) => {
    positions[player.position].push(player);
  });

  // 두팀으로 분류
  const readTeam = [];
  const blueTeam = [];

  // 각 포지션별 무작위로 팀배정
  Object.keys(positions).forEach((position) => {
    const playerinPosition = positions[position];

    // 랜덤하게 2명씩 뽑아서 팀배정
    while (playerinPosition.length) {
      const randomPlayer1 = playerinPosition.splice(
        Math.floor(Math.random() * playerinPosition.length),
        1
      )[0];
      const randomPlayer2 = playerinPosition.splice(
        Math.floor(Math.random() * playerinPosition.length),
        1
      )[0];

      readTeam.push(randomPlayer1);
      blueTeam.push(randomPlayer2);
    }
  });
  return { readTeam, blueTeam };
};
// 밸런스 섞기
const balanceTeams = (players) => {
  // 포지션별 점수 -> 정글-미드-원딜-탑-서폿
  const positionPoints = { jug: 5, mid: 4, ad: 3, top: 2, sup: 1 };

  // 포지션별 그룹화
  const positionPlayers = {
    jug: [],
    mid: [],
    ad: [],
    top: [],
    sup: [],
  };

  // 선수 데이터 새로 복사하고 랜덤 섞기
  const shuffledPlayers = [...players]; // 원본을 변경하지 않기 위해 복사
  shufflePlayers(shuffledPlayers);

  // 복사된 선수들을 포지션별로 분류
  shuffledPlayers.forEach((player) => {
    positionPlayers[player.position].push(player);
  });

  // 각 포지션별로 점수 추가
  for (const position of Object.keys(positionPoints)) {
    const playersInPosition = positionPlayers[position];

    // rankScore가 20 이상인 선수만 점수 추가
    playersInPosition.forEach((player) => {
      if (player.RankScore >= 20) {
        player.RankScore += positionPoints[position];
      }
    });
  }

  // 점수 기준으로 내림차순 정렬
  shuffledPlayers.sort((a, b) => b.RankScore - a.RankScore);

  // 두 팀으로 균등 분배 (각 팀에 5명씩)
  const teams = [
    { players: [], totalRankScore: 0 },
    { players: [], totalRankScore: 0 },
  ];

  // 포지션 순서대로 팀에 분배
  const positionOrder = ["top", "jug", "mid", "ad", "sup"];

  // 각 포지션에서 한 명씩 배정
  positionOrder.forEach((position) => {
    const team1Player = positionPlayers[position].shift();
    const team2Player = positionPlayers[position].shift();

    // 점수가 적은 팀에 배정
    if (team1Player) {
      teams[0].players.push(team1Player);
      teams[0].totalRankScore += team1Player.RankScore;
    }
    if (team2Player) {
      teams[1].players.push(team2Player);
      teams[1].totalRankScore += team2Player.RankScore;
    }
  });

  // 나머지 선수들 균등 배정
  let remainingPlayers = [].concat(...Object.values(positionPlayers));
  remainingPlayers = shufflePlayers(remainingPlayers);

  // 남은 선수들을 순차적으로 팀에 추가
  remainingPlayers.forEach((player) => {
    if (teams[0].players.length < 5) {
      teams[0].players.push(player);
      teams[0].totalRankScore += player.RankScore;
    } else if (teams[1].players.length < 5) {
      teams[1].players.push(player);
      teams[1].totalRankScore += player.RankScore;
    }
  });

  // 클라이언트로 전달할 때 탑 -> 정글 -> 미드 -> 원딜 -> 서폿 순으로 정렬
  const sortPositionClient = (team) => {
    const positionOrder = ["top", "jug", "mid", "ad", "sup"];
    return positionOrder
      .map((position) => {
        return team.players.filter((player) => player.position === position);
      })
      .flat();
  };

  // 각 팀의 포지션 순서대로 정렬 후 전달
  const blueTeam = sortPositionClient(teams[0]);
  const redTeam = sortPositionClient(teams[1]);

  return {
    blueTeam: {
      players: blueTeam,
      totalRankScore: teams[0].totalRankScore,
    },
    redTeam: {
      players: redTeam,
      totalRankScore: teams[1].totalRankScore,
    },
  };
};
// 선수 랜덤 섞기
const shufflePlayers = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // 요소를 교환
  }
  return arr;
};

const draftTeams = (players) => {
  const filterPlayers = players.filter((player) => !player.leader);

  const sortPlayers = filterPlayers.sort((a, b) => b.RankScore - a.RankScore);

  return { draftTeam: sortPlayers };
};

const TeamMach = async (req, res) => {
  const { mode, players } = req.body;
  const missingPositions = players.filter((player) => player.position === "");

  // 빈 position 값이 있는 경우 처리
  if (missingPositions.length > 0) {
    return res.status(400).json({
      message: "다음 플레이어들의 포지션이 비어있습니다.",
      missingPlayers: missingPositions,
    });
  }
  try {
    if (mode === "rand") {
      const { readTeam, blueTeam } = generateRandTeam(players);
      // 응답으로 생성된 플레이어 목록 반환

      return res
        .status(200)
        .json({ message: "랜덤 팀 생성 완료", readTeam, blueTeam });
    } else if (mode == "balance") {
      const { redTeam, blueTeam } = balanceTeams(players);
      return res
        .status(200)
        .json({ message: "밸런스 팀 생성 완료", redTeam, blueTeam });
    } else if (mode == "draft") {
      const missingPositions = players.filter(player => player.position === "");
      // 빈 position 값이 있는 경우 처리
      if (missingPositions.length > 0) {
        return res.status(400).json({
          message: "다음 플레이어들의 포지션이 비어있습니다.",
          missingPlayers: missingPositions
        });
      }
      const { draftTeam } = draftTeams(players);

      return res
        .status(200)
        .json({ message: "드래프트 팀 생성 완료", draftTeam });
    } else {
      return res.status(400).json({ message: "유효하지 않은 모드" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "서버 오류", error: error.message });
  }
};

const sampleData = async () => {
  const headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept-Language": "ko-KR",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    Origin: "https://developer.riotgames.com",
    "X-Riot-Token": process.env.RIOT_API_KEY, // 환경 변수에 API 키 저장
  };

  const tiers = [
    "IRON",
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "EMERALD",
    "DIAMOND",
    "MASTER",
    "GRANDMASTER",
    "CHALLENGER",
  ];
  const divisions = ["IV", "III", "II", "I"]; // IV부터 I까지
  const resultData = [];

  try {
    for (const tier of tiers) {
      for (const division of divisions) {
        if (["MASTER", "GRANDMASTER", "CHALLENGER"].includes(tier)) {
          // MASTER 이상은 Division이 없으므로 한 번만 요청
          if (division !== "I") continue;
        }
        // 1차 요청: Summoner ID 가져오기
        const userDataUrl = `https://kr.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/${tier}/${division}?page=1`;
        const userDataResponse = await axios.get(userDataUrl, { headers });

        const limitedData = userDataResponse.data.slice(0, 10); // 각 Tier 및 Division 당 10명 제한

        for (const item of limitedData) {
          const { summonerId, tier, rank, leaguePoints, wins, losses } = item;

          // 2초 대기
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // 2차 요청: Puuid 가져오기
          const summonerUrl = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/${summonerId}`;
          const summonerResponse = await axios.get(summonerUrl, { headers });
          const { puuid } = summonerResponse.data;

          // 2초 대기
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // 3차 요청: GameName 및 TagLine 가져오기
          const accountUrl = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`;
          const accountResponse = await axios.get(accountUrl, { headers });
          const { gameName, tagLine } = accountResponse.data;

          // GameName과 TagLine 합치기
          const fullGameName = `${gameName}#${tagLine}`;

          // 데이터 저장 (fullGameName을 가장 앞에 배치)
          resultData.push({
            fullGameName, // 합쳐진 GameName
            tier,
            rank,
            leaguePoints,
            wins,
            losses,
          });
        }
      }
    }

    // 데이터를 엑셀 파일로 저장
    const worksheet = XLSX.utils.json_to_sheet(resultData); // JSON -> Worksheet 변환
    const workbook = XLSX.utils.book_new(); // 새 워크북 생성
    XLSX.utils.book_append_sheet(workbook, worksheet, "Summoner Data"); // 워크북에 시트 추가

    // 엑셀 파일 저장
    const filename = "Summoner_Data_with_FullGameName.xlsx";
    XLSX.writeFile(workbook, filename);
    console.log(`데이터 저장완료 ${filename}`);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

export { TeamMach, sampleData };
