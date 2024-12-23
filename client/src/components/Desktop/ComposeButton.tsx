import React from "react";
import DraftModal from "./DraftModal";
import { User } from "../../commonTypes";

interface ComposeButtonProps {
  addedUsers: User[];
  handleTeamButtonClick: () => void;
  isDraftModalOpen: boolean;
  setIsDraftModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ComposeButton: React.FC<ComposeButtonProps> = ({
  handleTeamButtonClick,
  addedUsers,
  isDraftModalOpen,
  setIsDraftModalOpen,
}) => {
  return (
    <div className="font-blackHanSans flex flex-row items-center justify-center space-x-4 w-full my-[20px]">
      <button
        className="lg:w-[10vw] h-[4.5vh] bg-[#F0E6D2] rounded-full border-2 border-[#C8AA6E] text-[15px] text-[#0F2041] flex items-center justify-center font-black whitespace-nowrap"
        onClick={handleTeamButtonClick}
      >
        팀 구성
      </button>
      {/* DraftModal 열기 */}
      {isDraftModalOpen && (
        <DraftModal
          closeModal={() => setIsDraftModalOpen(false)}
          teamMembers={addedUsers}
        />
      )}
    </div>
  );
};

export default ComposeButton;
