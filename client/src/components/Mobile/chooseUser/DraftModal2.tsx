import { useState, useEffect } from "react";
import { User } from "../../../commonTypes";

interface DraftModal2Props {
  closeModal: () => void;
  teamMembers: User[];
  redTeamLeader: User | null;
  blueTeamLeader: User | null;
  handleFinishDraft: (RedTeam: User[], BlueTeam: User[]) => void;
}

const DraftModal2 = ({
  closeModal,
  teamMembers,
  redTeamLeader,
  blueTeamLeader,
  handleFinishDraft,
}: DraftModal2Props) => {
  console.log("모달2 실행");
  const [draftedMembers, setDraftedMembers] = useState<User[]>([]); // 이미 선택된 멤버
  const [currentTeamMembers, setCurrentTeamMembers] = useState<User[]>([]); // 현재 두 팀원
  const [currentLeader, _setCurrentLeader] = useState<User | null>(
    redTeamLeader
  ); // 레드팀 팀장만 계속 표시

  const availableMembersCount = teamMembers.filter(
    (member) => member !== redTeamLeader && member !== blueTeamLeader
  ).length;

  // 순차적으로 두 명의 팀원을 선택하는 함수
  const getNextPair = () => {
    // 팀장이 제외된 나머지 멤버들
    const remainingMembers = teamMembers.filter(
      (member) =>
        member !== redTeamLeader &&
        member !== blueTeamLeader &&
        !draftedMembers.includes(member)
    );

    // 순차적으로 두 명을 선택
    const nextPair = remainingMembers.slice(0, 2);
    return nextPair;
  };

  // 멤버 선택 시 호출되는 함수
  const handleSelectMember = (selectedMember: User) => {
    // 선택된 멤버를 draftedMembers에 추가
    setDraftedMembers((prevDrafted) => [...prevDrafted, selectedMember]);

    // 선택되지 않은 멤버는 반대 팀에 배정
    const remainingMember = currentTeamMembers.find(
      (member) => member.gameName !== selectedMember.gameName
    );
    if (remainingMember) {
      setDraftedMembers((prevDrafted) => [...prevDrafted, remainingMember]);
    }
  };

  // draftedMembers 상태가 업데이트 된 후 처리
  useEffect(() => {
    if (draftedMembers.length === availableMembersCount) {
      const RedTeam = [
        redTeamLeader!,
        ...draftedMembers.filter((_, idx) => idx % 2 === 0),
      ];
      const BlueTeam = [
        blueTeamLeader!,
        ...draftedMembers.filter((_, idx) => idx % 2 === 1),
      ];

      handleFinishDraft(RedTeam, BlueTeam); // 상태가 업데이트된 후 호출
    }
  }, [
    draftedMembers,
    availableMembersCount,
    redTeamLeader,
    blueTeamLeader,
    handleFinishDraft,
  ]);

  useEffect(() => {
    // 처음 두 명을 선택
    const initialPair = getNextPair();
    setCurrentTeamMembers(initialPair);
  }, [teamMembers, draftedMembers]);

  return (
    <div
      className="font-blackHanSans fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center flex-col"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      {/* "ooo님 선택" 부분 */}
      {draftedMembers.length < availableMembersCount && (
        <h1 className="whitespace-nowrap absolute top-20 left-1/2 transform -translate-x-1/2 text-xl mb-4">
          {currentLeader?.gameName}님 선택
        </h1>
      )}

      {/* 팀원 두 명을 순차적으로 보여주고, 선택하는 버튼 */}
      {currentTeamMembers.length === 2 &&
        draftedMembers.length < availableMembersCount && (
          <div className="flex flex-col gap-4 mt-20">
            <button
              onClick={() => handleSelectMember(currentTeamMembers[0])}
              className="py-2 px-4 bg-[#F0E6D2] text-[#0F2041] hover:bg-[#C89B3C] hover:text-white rounded-lg"
            >
              {currentTeamMembers[0].gameName}
            </button>
            <button
              onClick={() => handleSelectMember(currentTeamMembers[1])}
              className="py-2 px-4 bg-[#F0E6D2] text-[#0F2041] hover:bg-[#C89B3C] hover:text-white rounded-lg"
            >
              {currentTeamMembers[1].gameName}
            </button>
          </div>
        )}

      {/* 선택 후 메시지 */}
      <div className="text-center my-4">
        {draftedMembers.length >= 7 ? (
          <p className="text-2xl font-bold">팀원이 모두 선택되었습니다!</p>
        ) : (
          <p>
            {draftedMembers.length}명 선택됨, 남은 팀원:{" "}
            {availableMembersCount - draftedMembers.length}
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={closeModal}
          className="px-7 py-2 bg-[#F0E6D2] text-[#0F2041] font-bold border-2 border-[#C89B3C] rounded-full hover:bg-[#e8d9c3]"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default DraftModal2;
