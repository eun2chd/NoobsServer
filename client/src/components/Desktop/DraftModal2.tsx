import { useState, useEffect } from "react";

interface DraftModal2Props {
  closeModal: () => void;
  teamMembers: string[];
  redTeamLeader: string | null; // 부모 컴포넌트에서 받은 redTeamLeader
  blueTeamLeader: string | null; // 부모 컴포넌트에서 받은 blueTeamLeader
}

const DraftModal2 = ({
  closeModal,
  teamMembers,
  redTeamLeader,
  blueTeamLeader,
}: DraftModal2Props) => {
  const [draftedMembers, setDraftedMembers] = useState<string[]>([]); // 이미 선택된 멤버
  const [currentTeamMembers, setCurrentTeamMembers] = useState<string[]>([]); // 랜덤으로 선택된 두 팀원
  const [currentLeader, _setCurrentLeader] = useState<string | null>(
    redTeamLeader
  ); // 레드팀 팀장만 계속 표시

  const availableMembersCount = teamMembers.filter(
    (member) => member !== redTeamLeader && member !== blueTeamLeader
  ).length;

  // 랜덤으로 두 명의 팀원을 선택하는 함수
  const getRandomPair = () => {
    const remainingMembers = teamMembers.filter(
      (member) =>
        !draftedMembers.includes(member) &&
        member !== redTeamLeader &&
        member !== blueTeamLeader
    );

    // 두 명 랜덤으로 선택
    const randomPair = [];
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * remainingMembers.length);
      randomPair.push(remainingMembers[randomIndex]);
      remainingMembers.splice(randomIndex, 1); // 이미 선택된 멤버는 제외
    }

    return randomPair;
  };

  // 멤버 선택 시 호출되는 함수
  const handleSelectMember = (selectedMember: string) => {
    // 레드팀에 선택된 멤버를 추가
    setDraftedMembers((prevDrafted) => [...prevDrafted, selectedMember]);

    // 선택되지 않은 멤버는 블루팀에 배정
    const remainingMember = currentTeamMembers.find(
      (member) => member !== selectedMember
    );
    if (remainingMember) {
      setDraftedMembers((prevDrafted) => [...prevDrafted, remainingMember]);
    }

    // 랜덤으로 두 명을 다시 선택하여 보여줌
    const nextPair = getRandomPair();
    setCurrentTeamMembers(nextPair);
  };

  useEffect(() => {
    // 처음 랜덤으로 두 명의 팀원을 선택
    const initialPair = getRandomPair();
    setCurrentTeamMembers(initialPair);
  }, [teamMembers, draftedMembers]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center flex-col"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      {/* "ooo님 선택" 부분 */}
      {draftedMembers.length < availableMembersCount && (
        <h1 className="text-center text-xl mb-4">{currentLeader}님 선택</h1>
      )}

      {/* 팀원 두 명을 랜덤으로 보여주고, 선택하는 버튼 */}
      {currentTeamMembers.length === 2 &&
        draftedMembers.length < availableMembersCount && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleSelectMember(currentTeamMembers[0])}
              className="py-2 px-4 bg-[#F0E6D2] text-[#0F2041] hover:bg-[#C89B3C] hover:text-white rounded-lg"
            >
              {currentTeamMembers[0]}
            </button>
            <button
              onClick={() => handleSelectMember(currentTeamMembers[1])}
              className="py-2 px-4 bg-[#F0E6D2] text-[#0F2041] hover:bg-[#C89B3C] hover:text-white rounded-lg"
            >
              {currentTeamMembers[1]}
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
