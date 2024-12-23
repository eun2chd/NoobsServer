import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
interface ProfileStatsProps {
  soloWinRate: { wins: number; losses: number };
  freeWinRate: { wins: number; losses: number };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ soloWinRate, freeWinRate }) => {
    // 승률 데이터를 배열로 변환
    const soloWinRateData = [
      { name: "승", value: soloWinRate.wins },
      { name: "패", value: soloWinRate.losses },
    ];
  
    const freeWinRateData = [
      { name: "승", value: freeWinRate.wins },
      { name: "패", value: freeWinRate.losses },
    ];

  // 승률 계산 함수
  const calculateWinRate = (win: number, loss: number) => {
    const totalGames = win + loss;
    return totalGames > 0 ? ((win / totalGames) * 100).toFixed(2) : '0';
  };

  // 개인랭크와 2인랭크의 승률 계산
  const soloWinRateText = calculateWinRate(soloWinRate.wins, soloWinRate.losses);
  const freeWinRateText = calculateWinRate(freeWinRate.wins, freeWinRate.losses);
  
  return (
    <div className="profile-stats bg-gray-800 text-white p-6 rounded-lg max-h-full overflow-hidden flex flex-col items-center">
      {/* 승률 그래프 영역 */}
      <div className="stats-container w-full p-4 flex flex-col items-center justify-center mb-6">
        <h2 className="text-2xl font-bold mb-3 font-blackHanSans">
          개인/2인랭크
        </h2>

        {/* 승률 그래프 */}
        <div
          className="stats-graph mb-20 flex flex-col items-center justify-center w-full"
          style={{ height: "220px" ,overflow: "visible" }}
        >
          <h3 className="text-xl mb-2 font-blackHanSans">
            승률: {soloWinRateText}
          </h3>

          {/* 차트 크기 조정 */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={soloWinRateData}
                dataKey="value"
                nameKey="name"
                outerRadius="70%"
                label={({ name, value }: any) => `${name}: ${value}`} // 차트 내부에 승/패와 비율을 표시
                labelLine={false} // 라벨과 연결선 제거
              >
                {/* 각 파이 조각의 색상 지정 */}
                <Cell key="cell1" fill="#06f712 " />
                <Cell key="cell2" fill="#ff0303 " />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "#fff",
                }}
              />
              {/* 범례 제거: Legend 컴포넌트를 아예 제거하거나, content 속성 비활성화 */}
            </PieChart>
          </ResponsiveContainer>
        </div>
        <h2 className="text-2xl font-bold mb-4 font-blackHanSans">
                자유랭크
        </h2>

        {/* 승률 그래프 */}
        <div
          className="stats-graph mb-6 flex flex-col items-center justify-center w-full"
          style={{ height: "210px", overflow: "visible"}}
        >
          <h3 className="text-xl mb-2 font-blackHanSans">
            승률: {freeWinRateText}
          </h3>

          {/* 차트 크기 조정 */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={freeWinRateData}
                dataKey="value"
                nameKey="name"
                outerRadius="70%"
                label={({ name, value }: any) => `${name}: ${value}`} // 차트 내부에 승/패와 비율을 표시
                labelLine={false} // 라벨과 연결선 제거
              >
                {/* 각 파이 조각의 색상 지정 */}
                <Cell key="cell1" fill="#06f712 " />
                <Cell key="cell2" fill="#ff0303 " />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "#fff",
                }}
              />
              {/* 범례 제거: Legend 컴포넌트를 아예 제거하거나, content 속성 비활성화 */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
