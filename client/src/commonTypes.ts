import { ReactNode } from "react";

// 컴포넌트 하위에 새로운 컴포넌트 작성시 타입으로 사용
export interface Props {
  children?: ReactNode;
}

// user 정보 저장
interface ChampInfo {
  champ_img: string; // 챔피언 이미지 경로
  name: string;
}

// MostChamp 요소 타입
interface MostChamp {
  champInfo: ChampInfo; // 챔피언 정보
  championPoints: number;
}

// user profile 관련 정보
interface profileInfo {
  Profile_img: string;
}

interface tierImg {
  rankImg: string;
}

interface tierScore {
  Rank: string;
  RankScore: number;
  tier: string;
}
export interface User {
  id: number; // 유저 고유 식별자
  Line?: string;
  MostChamp: MostChamp[];
  profileInfo: profileInfo;
  tierImg: tierImg;
  tierScore: tierScore;
  gameName: string; // 유저 닉네임
  tagLine: string; // 유저 태그
  winRate: number; // 승률
  updateId: number;
  position?: string;
}
