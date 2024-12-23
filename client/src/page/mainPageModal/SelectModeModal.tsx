import React, { useState } from "react";
import Swal from "sweetalert2";
interface ModalProps {
  closeModal: () => void;
  selectedMode: string;
  setIsDraftModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMode: React.Dispatch<React.SetStateAction<string>>; // 부모로부터 받은 setSelectedMode
  setHeaderText: (text: string) => void;
}

export default function SelectModeModal({
  closeModal,
  setSelectedMode, // 부모로부터 받은 setSelectedMode
  selectedMode,
  setHeaderText,
}: ModalProps) {
  const [selectedModeState, setSelectedModeState] = useState(
    selectedMode === "모드선택" ? "RANDOM" : selectedMode
  ); // 로컬 상태로 초기 설정
  const [isTransitioning, setIsTransitioning] = useState(false); // 애니메이션 상태

  const modeDescriptions: Record<string, string> = {
    RANDOM: "RANDOM 모드는 랜덤으로 팀을 구성합니다.",
    DRAFT:
      "DRAFT 모드는 먼저 팀장 두명을 뽑고, \n각 팀의 팀장이 번갈아 가며 팀을 선택합니다.",
    BALANCE: "BALANCE 모드는 밸런스를 맞춰 팀을 자동으로 구성합니다.",
  };

  const modeImages: Record<string, string> = {
    RANDOM: "/src/assets/modeGif/random.gif",
    DRAFT: "/src/assets/modeGif/draft.gif",
    BALANCE: "/src/assets/modeGif/justice.gif",
  };

  const handleModeClick = (mode: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedModeState(mode); // 로컬 상태 업데이트
      setIsTransitioning(false);
    }, 300); // 애니메이션 시간
  };

  const handleConfirmClick = () => {
    Swal.fire({
      icon: 'success',
      title: '모드 선택 완료',
      text: `${selectedModeState} 모드가 선택되었습니다.`,
      confirmButtonText: '확인',
      background: '#fff',
      color: '#000',
    }).then(() => {
      // Swal이 닫힌 후 실행할 코드
      if (setHeaderText) {
        setHeaderText(`${selectedModeState} 모드가 선택되었습니다.`);
      }
      setSelectedMode(selectedModeState);
      closeModal();
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center font-blackHanSans z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="bg-white p-8 rounded-lg w-[350px] shadow-lg relative border-4 border-[3px] border-[#C89B3C]">
        <div className="flex justify-center items-center space-x-4 mb-6">
          {["RANDOM", "DRAFT", "BALANCE"].map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeClick(mode)} // 상태만 업데이트
              className={`px-2 py-2 w-[110px] text-lg font-bold border-[3px] border-[#C89B3C] transition-colors duration-300 rounded-lg ${
                selectedModeState === mode
                  ? "bg-[#C89B3C] text-[#ffffff]"
                  : "bg-[#ffffff] text-[#0F2041]"
              }`}
              style={{
                cursor: "pointer",
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* 이미지 전환 */}
        <div className="relative h-[300px] mb-4 flex items-center justify-center rounded-lg overflow-hidden">
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={modeImages[selectedModeState]}
              alt={`${selectedModeState} 모드 이미지`}
              className="max-h-full object-cover transition-opacity"
            />
          </div>
        </div>

        {/* 설명 텍스트 전환 */}
        <div
          className={`transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <p
            className="text-center text-sm font-bold text-gray-700"
            style={{ whiteSpace: "pre-line" }}
          >
            {modeDescriptions[selectedModeState]}
          </p>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleConfirmClick} // 부모에 전달할 때 문자열을 직접 전달
            className="bg-[#F0E6D2] px-6 py-2 border-[3px] border-[#C89B3C] text-[#0F2041] rounded-lg transition-colors"
          >
            확인
          </button>
          <button
            onClick={closeModal}
            className="bg-[#F0E6D2] px-6 py-2 border-[3px] border-[#C89B3C] text-[#0F2041] rounded-lg transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
