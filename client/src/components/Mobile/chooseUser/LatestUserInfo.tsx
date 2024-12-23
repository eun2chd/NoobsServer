import { useState, useRef, useEffect } from "react";
import { User } from "../../../commonTypes";
import UserModal from "../userModal/UserModal";
import none from "../../../assets/none_profile.jpg";

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
      className={`flex flex-row items-center h-[55px] px-2 py-1 gap-2 relative`}
      onClick={() => {
        setUserModal(true);
      }}
    >
      <img
        src={`${user.profileInfo?.Profile_img || none}`}
        alt="most-champ-info"
        className="w-[20px] h-[20px]"
      />
      <div className="flex flex-col">
        <div className="text-[10px] text-white">
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
        <p className="max-w-[115px] min-w-[115px] text-[12px] text-ellipsis overflow-hidden text-white text-nowrap">
          {user.gameName} {user.tagLine}
        </p>
      </div>
      <p className="min-w-[66px] text-[13px] text-nowrap text-white">
        승률 {user.winRate}%
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
        <div ref={modalRef} className="absolute top-0 left-0 z-10">
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
