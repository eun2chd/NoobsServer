import none from "../../../assets/line_img/line-none.png";
import { useState } from "react";
import LineModal from "./LineModal";
import { User } from "../../../commonTypes";

interface AddedUserInfoProps {
  user: User;
  selectedMode: string;
  onRemoveUser: (user: User) => void;
  handleAddUser: (user: User) => void;
}

const UserInfo: React.FC<AddedUserInfoProps> = ({
  user,
  selectedMode,
  onRemoveUser,
  handleAddUser,
}) => {
  const [isLine, setIsLine] = useState<boolean>(false);
  const [_line, setLine] = useState(none);
  const [lineSrc, setLineSrc] = useState(none);

  const handleLineSelection = (newLine: string) => {
    setLine(newLine); // Line 상태 업데이트

    // 유저 정보가 있다면 user 객체에 line 추가 후 handleAddUser 호출
    if (user) {
      const updatedUser = { ...user, position: newLine }; // line 추가
      handleAddUser(updatedUser); // 업데이트된 user 전달
    }
  };
  return (
    <div className="flex flex-row items-center h-[55px] mx-2 my-1 gap-2 relative">
      {selectedMode == "BALANCE" && (
        <img
          src={lineSrc}
          alt="line-info"
          className="w-[15px] h-[15px]"
          onClick={() => setIsLine(!isLine)}
        />
      )}
      <img
        src={user.MostChamp[0].champInfo.champ_img}
        alt="most-champ-info"
        className="w-[20px] h-[20px]"
      />
      <div className="flex flex-col">
        <div className="text-[10px] text-white">{user.tierScore.Rank}</div>
        <p className="max-w-[115px] min-w-[115px] text-[12px] text-ellipsis overflow-hidden text-white text-nowrap">
          {user.gameName} {user.tagLine}
        </p>
      </div>
      <p className="min-w-[66px] text-[13px] text-nowrap text-white">
        승률 {user.winRate}%
      </p>
      <button
        className="w-[10px] bg-inherit text-white"
        onClick={() => {
          onRemoveUser(user), setLineSrc(none);
        }}
      >
        X
      </button>
      {isLine && (
        <LineModal
          handleLineSelection={handleLineSelection}
          setIsLine={setIsLine}
          setLineSrc={setLineSrc}
        />
      )}
    </div>
  );
};

export default UserInfo;
