import none from "./../../assets/line_img/line-none.png";
import PlusIcon from "../../assets/svg/add.svg";
import close from "../../assets/svg/close.svg";

import { useState } from "react";

import LineModal from "../Mobile/chooseUser/LineModal";
import { User } from "../../commonTypes";

interface BlueTeamProps {
  user?: User;
  selectedMode: string;
  handleRemoveUser: (user: User) => void;
  handleAddUser: (user: User) => void;
}
const BlueTeam: React.FC<BlueTeamProps> = ({
  user,
  selectedMode,
  handleRemoveUser,
  handleAddUser,
}) => {
  const [isLine, setIsLine] = useState<boolean>(false);
  const [_line, setLine] = useState(none);
  const [lineSrc, setLineSrc] = useState(none);

  // 유저가 없을 경우 배경을 다르게 설정
  const backgroundClass = user ? "bg-[#B9CCDF]" : "bg-[#F0E6D2] bg-opacity-15";

  // 숫자를 1,000과 같은 형식으로 변환
  const formatNumberWithCommas = (number: number): string => {
    return number.toLocaleString();
  };
  const handleLineSelection = (newLine: string) => {
    setLine(newLine); // Line 상태 업데이트

    // 유저 정보가 있다면 user 객체에 line 추가 후 handleAddUser 호출
    if (user) {
      const updatedUser = { ...user, position: newLine }; // line 추가
      handleAddUser(updatedUser); // 업데이트된 user 전달
    }
  };

  return (
    <div
      className={`w-[18%] max-h-[100%] border-2 border-solid border-[#004A82] rounded-2xl flex flex-col items-center p-2 ${backgroundClass}`}
    >
      <div className="flex flex-col items-center justify-center h-full">
        {/* 유저 정보가 있을 경우 */}
        {user ? (
          <div
            key={user.id}
            className="flex flex-col items-center justify-between h-full"
          >
            <img
              src={lineSrc}
              alt="라인 이미지"
              className={`w-5 h-5 ${
                selectedMode === "RANDOM" ||
                selectedMode === "모드선택" ||
                selectedMode === "DRAFT"
                  ? "hidden"
                  : ""
              }`}
              onClick={() => setIsLine(!isLine)}
            />
            <div className="w-[100%]">
              {user.MostChamp.map((champ, index) => (
                <div
                  key={index}
                  className="flex w-[100%] change:justify-around xl:justify-between"
                >
                  <img
                    src={champ.champInfo.champ_img}
                    className="change:w-6 xl:w-8 h-auto max-w-[50px]"
                  />
                  <p className="text-xs font-bold self-center font-blackHanSans change:hidden xl:block">
                    {champ.champInfo.name}
                  </p>
                  <p className="text-xs font-bold self-center font-blackHanSans">
                    {formatNumberWithCommas(champ.championPoints)}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-md text-blue-500 font-bold font-blackHanSans break-all text-center change:text-[0.5rem] xl:text-xl">
              {user.gameName}
            </p>
            <img src={user.tierImg.rankImg} alt="tier" className="w-[35%]" />
            {isLine && (
              <LineModal
                handleLineSelection={handleLineSelection}
                setIsLine={setIsLine}
                setLineSrc={setLineSrc}
              />
            )}
            <img
              src={close}
              alt="close"
              className="w-5 h-5 cursor-pointer"
              onClick={() => {
                handleRemoveUser(user);
                handleAddUser(user);
                setLineSrc(none);
              }}
            />
          </div>
        ) : (
          // 유저 정보가 없을 경우
          <li className="flex flex-col items-center justify-center text-gray-500 xs:h-[20vh] lg:h-full">
            <img src={PlusIcon} alt="Add" className="" />
          </li>
        )}
      </div>
    </div>
  );
};

export default BlueTeam;
