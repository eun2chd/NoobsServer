import React from "react";

interface RankCardProps {
  title: string;
  rank: string;
  score: string;
  imgSrc: string;
}

const RankCard: React.FC<{
  left: RankCardProps;
  right: RankCardProps;
}> = ({ left, right }) => {
  const leftTier = left.rank.slice(0, left.rank.indexOf(" "));
  const rightTier = right.rank.slice(0, right.rank.indexOf(" "));
  return (
    <div className="bg-gray-800 p-6 rounded-lg grid grid-cols-2 gap-2 min-h-64 border-4 border-[rgb(200, 155, 60)] bg-[rgb(28, 28, 28)]">
      {/* 타이틀 */}
      <div className="col-span-2 text-center text-xl font-bold mb-2 text-white font-blackHanSans">
        소환사 랭크 정보
      </div>

      {/* 왼쪽 영역 (개인랭) */}
      <div className="flex flex-col items-center justify-center">
        <img
          src={left.imgSrc}
          alt="Rank Icon"
          className="w-50 h-50 max-w-50 max-h-50 mb-2 transition-transform transform hover:scale-105 hover:shadow-lg"
        />
        <div
          className={`text-center text-lx font-blackHanSans ${
            leftTier === "Unranked"
              ? "text-gray-500"
              : leftTier === "IRON"
              ? "text-gray-400"
              : leftTier === "BRONZE"
              ? "text-yellow-700"
              : leftTier === "SILVER"
              ? "text-text-gray-300"
              : leftTier === "GOLD"
              ? "text-yellow-600"
              : leftTier === "PLATINUM"
              ? "text-blue-400"
              : leftTier === "EMERALD"
              ? "text-teal-400"
              : leftTier === "DIAMOND"
              ? "text-blue-600"
              : leftTier === "MASTER"
              ? "text-purple-500"
              : leftTier === "GRANDMASTER"
              ? "text-red-600"
              : leftTier === "CHALLENGER"
              ? "text-yellow-300"
              : "text-white"
          }`}
        >
          {left.rank} {left.score}
        </div>
        <div className="text-center text-lg font-semibold text-white font-blackHanSans">
          {left.title}
        </div>
      </div>

      {/* 오른쪽 영역 (자유랭) */}
      <div className="flex flex-col items-center justify-center">
        <img
          src={right.imgSrc}
          alt="Rank Icon"
          className="w-50 h-50 max-w-50 max-h-50 mb-2 transition-transform transform hover:scale-105 hover:shadow-lg"
        />
        <div
          className={`text-center text-lx font-blackHanSans ${
            rightTier === "Unranked"
              ? "text-gray-500"
              : rightTier === "IRON"
              ? "text-gray-400"
              : rightTier === "BRONZE"
              ? "text-yellow-700"
              : rightTier === "SILVER"
              ? "text-text-gray-300"
              : rightTier === "GOLD"
              ? "text-yellow-600"
              : rightTier === "PLATINUM"
              ? "text-blue-400"
              : rightTier === "EMERALD"
              ? "text-teal-400"
              : rightTier === "DIAMOND"
              ? "text-blue-600"
              : rightTier === "MASTER"
              ? "text-purple-500"
              : rightTier === "GRANDMASTER"
              ? "text-red-600"
              : rightTier === "CHALLENGER"
              ? "text-yellow-300"
              : "text-white"
          }`}
        >
          {right.rank} {right.score}
        </div>
        <div className="text-center text-lg font-semibold text-white font-blackHanSans">
          {right.title}
        </div>
      </div>
    </div>
  );
};

export default RankCard;
