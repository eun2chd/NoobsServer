import { useState } from "react";
import DraftModal2 from "./DraftModal2";
import { User } from "../../commonTypes";

interface DraftModalProps {
  closeModal: () => void;
  teamMembers: User[]; // teamMembers의 타입을 User[]로 받아옵니다.
}

const DraftModal = ({ closeModal, teamMembers }: DraftModalProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [redTeamLeader, setRedTeamLeader] = useState<string | null>(null);
  const [blueTeamLeader, setBlueTeamLeader] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
    setIsDropdownOpen(true);
  };

  const handleLeaderSelect = (leader: string) => {
    if (selectedTeam === "RED TEAM") {
      setRedTeamLeader(leader);
    } else if (selectedTeam === "BLUE TEAM") {
      setBlueTeamLeader(leader);
    }
    setIsDropdownOpen(false);
  };

  const handleConfirm = () => {
    if (redTeamLeader && blueTeamLeader) {
      setShowNextModal(true);
    }
  };

  if (showNextModal) {
    return (
      <DraftModal2
        closeModal={closeModal}
        teamMembers={teamMembers.map((member) => member.gameName)}
        redTeamLeader={redTeamLeader}
        blueTeamLeader={blueTeamLeader}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        className="bg-white p-8 rounded-lg w-[100%] max-w-[400px] shadow-lg border-4"
        style={{ borderColor: "#C89B3C" }}
      >
        <p
          className="text-center mb-7 font-bold text-lg font-blackHanSans"
          style={{ fontFamily: "Arial, sans-serif", color: "#0F2041" }}
        >
          팀장을 뽑아주세요.
        </p>

        <div className="flex justify-between gap-4 mb-4 font-blackHanSans">
          <button
            onClick={() => handleTeamSelect("RED TEAM")}
            className={`w-[200px] py-2 rounded-lg ${
              selectedTeam === "RED TEAM"
                ? "bg-[#8A2922] text-white"
                : "bg-[#F0E6D2] text-[#0F2041]"
            } border-[#C89B3C] border-2`}
          >
            RED TEAM
          </button>
          <button
            onClick={() => handleTeamSelect("BLUE TEAM")}
            className={`w-[200px] py-2 rounded-lg ${
              selectedTeam === "BLUE TEAM"
                ? "bg-[#004a82] text-white"
                : "bg-[#F0E6D2] text-[#0F2041]"
            } border-[#C89B3C] border-2`}
          >
            BLUE TEAM
          </button>
        </div>

        {isDropdownOpen && (
          <div className="mt-4 border-2 border-[#C89B3C] rounded-lg p-4 bg-[#F9F5EB]">
            <div className="grid grid-cols-2 gap-4">
              {teamMembers.map((member) => {
                const isRedLeader = redTeamLeader === member.gameName;
                const isBlueLeader = blueTeamLeader === member.gameName;

                return (
                  <button
                    key={member.id}
                    onClick={() => handleLeaderSelect(member.gameName)}
                    className={`py-2 px-4 rounded-lg border-[#C89B3C] border-2 break-all ${
                      isRedLeader
                        ? "bg-[#8A2922] text-white cursor-not-allowed"
                        : isBlueLeader
                        ? "bg-[#004a82] text-white cursor-not-allowed"
                        : "bg-[#F0E6D2] text-[#0F2041] hover:bg-[#C89B3C] hover:text-white"
                    }`}
                    disabled={isRedLeader || isBlueLeader}
                  >
                    {member.gameName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center text-lg my-4">
          {redTeamLeader && (
            <p className="font-bold text-[#8A2922]">
              {redTeamLeader}님이 RED TEAM 팀장입니다.
            </p>
          )}
          {blueTeamLeader && (
            <p className="font-bold text-[#004a82]">
              {blueTeamLeader}님이 BLUE TEAM 팀장입니다.
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-10 font-blackHanSans">
          <button
            onClick={handleConfirm}
            className={`px-7 py-2 ${
              redTeamLeader && blueTeamLeader
                ? "bg-[#F0E6D2] text-[#0F2041]"
                : "bg-[#C89B3C] text-white font-bold cursor-not-allowed"
            } border-2 border-[#C89B3C] rounded-full`}
            disabled={!redTeamLeader || !blueTeamLeader}
          >
            확인
          </button>
          <button
            onClick={closeModal}
            className="px-7 py-2 bg-[#F0E6D2] text-[#0F2041] font-bold border-2 border-[#C89B3C] rounded-full hover:bg-[#e8d9c3]"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftModal;
