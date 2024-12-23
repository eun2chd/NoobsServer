import React from "react";

interface champInfo {
  imgUrl: string;
  name: string;
}
// Champion 인터페이스
interface Champion {
  imgUrl: string;
  name: string;
  championPoints: number; // 숫자
  championLevel: number; // 숫자
  champInfo: champInfo;
}

interface RecentHistoryProps {
  champions: Champion[];
}

const RecentHistory: React.FC<RecentHistoryProps> = ({ champions = [] }) => {
  return (
    <div className="recent-history p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 font-blackHanSans">숙련도 TOP 5</h2>

      {champions.length === 0 ? (
        <p className="text-center text-gray-400">데이터가 없습니다.</p>
      ) : (
        <div className="champions-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {champions.slice(0, 5).map((champion, index) => (
            <div
              key={index}
              className="champion-card p-4 bg-gray-700 rounded-lg"
            >
              <div className="champion-image mb-4 w-24 h-24 rounded-full overflow-hidden mx-auto">
                <img
                  src={champion.champInfo.imgUrl || "/default-image.png"}
                  alt={champion.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="champion-info text-center">
                <h3 className="text-lg font-bold font-blackHanSans overflow-hidden text-ellipsis whitespace-nowrap">
                  {champion.champInfo.name}
                </h3>
                <p className="text-sm font-blackHanSans">
                  <span
                    className={
                      champion.championPoints >= 10000000
                        ? "text-red-500"
                        : champion.championPoints >= 1000000
                        ? "text-purple-500"
                        : champion.championPoints >= 100000
                        ? "text-blue-500"
                        : champion.championPoints >= 10000
                        ? "text-white-500"
                        : "text-white-500"
                    }
                  >
                    {champion.championPoints.toLocaleString()}
                  </span>
                </p>

                <p className="text-sm font-blackHanSans">
                  LV: {champion.championLevel}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentHistory;
