import React from "react";
interface champInfo {
  imgUrl: string;
  name: string;
}
interface Champion {
  imgUrl: string;
  name: string;
  kda: number; // 숫자
  games_played: number; // 숫자
  champInfo: champInfo;
}

interface RecentfileChartsyProps {
  champions: Champion[];
}

const RecentHistory: React.FC<RecentfileChartsyProps> = ({
  champions = [],
}) => {
  // 데이터를 두 번 반복해 무한 슬라이드 효과를 줍니다.
  const duplicatedChampions = [...champions, ...champions];

  console.log(duplicatedChampions.length);

  return (
    <div className="recent-history bg-gray-800 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 font-blackHanSans inline">
        모스트 TOP 10
      </h2>
      <p className="text-sx font-bold font-blackHanSans text-gray-500 text-center inline">
        {" "}
        [15분 미만 게임은 집계에 포함하지 않습니다.]
      </p>

      {/* 슬라이드 컨테이너 */}
      <div className="slider-container overflow-hidden relative">
        {champions.length === 0 ? (
          <div className="text-center font-bold font-blackHanSans text-white text-2xl font-bold bg-gray-800 p-6 rounded-lg mt-12">
            전적 데이터가 없습니다. 갱신버튼 눌러 업데이트 하세요.
          </div>
        ) : (
          <div
            className="slider flex"
            style={{
              animation: "slide 30s linear infinite", // 슬라이드 애니메이션
            }}
          >
            {duplicatedChampions.map((champion, index) => (
              <div
                key={index}
                className="champion-item w-48 h-64 flex-shrink-0 text-center mx-2 bg-gray-700 rounded-lg p-4"
              >
                <div className="champion-image rounded-full w-24 h-24 mx-auto mb-2 overflow-hidden">
                  <img
                    src={champion.champInfo.imgUrl}
                    alt={champion.champInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1 font-blackHanSans">
                  {champion.champInfo.name}
                </h3>
                <p className="text-sx text-white-400 mb-1 font-blackHanSans">
                  {champion.games_played} 게임
                </p>
                <p
                  className={`text-lg font-blackHanSans ${
                    champion.kda >= 5
                      ? "text-yellow-400"
                      : champion.kda >= 4
                      ? "text-blue-400"
                      : champion.kda >= 3
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  평점: {champion.kda}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 슬라이드 애니메이션 CSS */}
      <style>{`
        @keyframes slide {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-220%);
          }
        }
      `}</style>
    </div>
  );
};

export default RecentHistory;
