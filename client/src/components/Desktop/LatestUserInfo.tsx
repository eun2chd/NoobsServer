import { User } from "../../commonTypes";
import { useEffect, useRef, useState } from "react";
import UserModal from "../Mobile/userModal/UserModal";
import none from "../../assets/none_profile.jpg";
interface LatestUserInfoProps {
  user: User;
  onAddUser: (user: User) => void;
  setIsUserAdded: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteUser: (userId: number) => void;
}
const LatestUserInfo: React.FC<LatestUserInfoProps> = ({
  user,
  onAddUser,
  setIsUserAdded,
  handleDeleteUser,
}) => {
  const [userModal, setUserModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setUserModal(false); // 모달 닫기
      }
    };

    if (userModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [userModal]);
  return (
    <div
      className="font-blackHanSans border-2 border-white/50 rounded-lg flex flex-row items-center h-[55px] w-[100%] mx-2 my-1 relative justify-around hover:border-yellow-500 hover:shadow-lg hover:transform hover:translate-y-[-5px] hover:cursor-pointer hover:z-30"
      onClick={() => {
        setUserModal(true);
      }}
    >
      <img
        src={`${user.profileInfo?.Profile_img || none}`}
        alt="most-champ-info"
        className="w-[30px] h-[30px]"
      />
      <div className="flex flex-col items-center ">
        <div className="text-sm text-white ">
          {user.tierScore.Rank === "Unranked" && (
            <span className="text-gray-500"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "IRON" && (
            <span className="text-gray-400"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "BRONZE" && (
            <span className="text-yellow-700"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "SILVER" && (
            <span className="text-gray-300"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "GOLD" && (
            <span className="text-yellow-600"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "PLATINUM" && (
            <span className="text-teal-400"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "EMERALD" && (
            <span className="text-green-500"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "DIAMOND" && (
            <span className="text-blue-400"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "MASTER" && (
            <span className="text-purple-500"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "GRANDMASTER" && (
            <span className="text-red-600"> {user.tierScore.Rank}</span>
          )}
          {user.tierScore.Rank === "CHALLENGER" && (
            <span className="text-yellow-300">{user.tierScore.Rank}</span>
          )}
        </div>
        <p className="max-w-[150px] min-w-[150px] text-center w-full text-lg text-ellipsis overflow-hidden text-white whitespace-nowrap">
          {user.gameName}#{user.tagLine}
        </p>
      </div>
      <p className="min-w-[66px] text-base text-nowrap text-white">
        승률 {user.winRate.toFixed(1)}%
      </p>
      <button
        onClick={(e) => {
          onAddUser(user);
          e.stopPropagation();
        }}
        className="w-[10px] bg-inherit text-white"
      >
        +
      </button>
      {userModal && (
        <div ref={modalRef} className="absolute top-0 left-0">
          <UserModal
            user={user}
            setUserModal={setUserModal}
            setIsUserAdded={setIsUserAdded}
            handleDeleteUser={handleDeleteUser}
          />
        </div>
      )}
    </div>
  );
};

export default LatestUserInfo;
