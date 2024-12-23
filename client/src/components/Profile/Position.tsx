import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PositionProps {
  title: string;
  labels: string[];
  totalGame: number[];
}

const Position: React.FC<PositionProps> = ({ title, labels, totalGame }) => {
  const positionData = {
    labels: labels, // 동적으로 포지션 이름을 받습니다.
    datasets: [
      {
        data: totalGame,
        backgroundColor: [
          "#ff8a00",
          "#ff3c00",
          "#00ccff",
          "#00ff00",
          "#ff00ff",
        ], // 색상 배열도 동적으로 처리 가능
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      //@ts-ignore
      animateRotate: true,
      animateScale: true,
      duration: 1500, // 애니메이션 시간 설정
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
            family: "font-blackHanSans", // 폰트 설정, 제대로 적용되는지 확인 필요
          },
          padding: 10,
          boxWidth: 13,
          color: "#fff",
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value: number) => `${value}%`,
      },
    },
  };

  return (
    <div className="flex flex-col items-center bg-gray-800 text-white p-6 rounded-lg font-blackHanSans border-4 border-[rgb(200, 155, 60)]">
      <div className="text-center text-lg font-semibold text-white mb-4 font-blackHanSans">
        {title}
      </div>

      <div className="relative w-full h-full" style={{ maxHeight: "250px" }}>
        {/*@ts-ignore */}
        <Doughnut data={positionData} options={options} />
      </div>
    </div>
  );
};

export default Position;
