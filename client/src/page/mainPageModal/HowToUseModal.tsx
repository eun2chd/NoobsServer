import { useState } from "react";

// ModalProps 수정
interface ModalProps {
  closeModal: () => void;
  isModalOpen: boolean; // isModalOpen 속성 추가
}

export default function HowToUseModal({ closeModal }: ModalProps) {
  const images = [
    "/src/assets/modeGif/userselect.png", // 예시 이미지 경로
    "/src/assets/modeGif/userselect.png",
    "/src/assets/modeGif/userAdd.png",
    "src/assets/modeGif/teamChoose.png",
    "src/assets/modeGif/modeselect.png",
    "src/assets/modeGif/good.jpeg",
  ];

  const descriptions = [
    "인원 추가 버튼을 눌러 닉네임과 태그를 입력하고, \n검색버튼을 클릭하여 유저 정보가 존재하는지 확인합니다.",
    "유저 정보가 확인되면 추가 버튼을 클릭하여 \n참여할 인원을 추가합니다.",
    "최근에 함께한 유저의 경우 검색을 하지 않고, \n+ 버튼을 클릭하여 추가할 수 있습니다",
    "총 10명의 인원을 추가해야합니다. \n겹치는 라인이 없도록 추가해주세요",
    <div className="space-y-4">
      <p>
        <strong className="font-bold">RANDOM :</strong> 팀을 무작위로 섞습니다.
      </p>
      <p>
        <strong className="font-bold">DRAFT :</strong> 팀장 2명 선정 후, 라인별
        2명씩 보여주고 팀장이 팀원을 선택합니다.
      </p>
      <p>
        <strong className="font-bold">BALANCE :</strong> 알고리즘을 통해 팀 선정
      </p>
      <p>(요인: 티어, 주라인과 일치하는지, 원챔인지 등등...)</p>
    </div>,
    "팀짜기 버튼을 클릭하면 팀이 구성됩니다. \n재밌게 즐겨주세요!",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="bg-white p-8 rounded-lg w-[350px] shadow-lg relative border-4 border-[3px] border-[#C89B3C]">
        <h2 className="text-lg font-bold mb-4">사용법</h2>

        {/* 이미지 슬라이더 */}
        <div className="relative mb-6">
          <img
            src={images[currentIndex]}
            alt={`사용법 이미지 ${currentIndex + 1}`}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* 설명 텍스트 */}
        <div className="text-[#0F2041] mb-4 text-sm whitespace-pre-wrap">
          {descriptions[currentIndex]}
        </div>

        {/* 이미지 이동 버튼과 페이지 번호 위치 조정 */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrev}
            className="bg-black text-white rounded-full p-2"
          >
            &#8592;
          </button>

          {/* 페이지 번호 */}
          <div className="text-lg text-[#0F2041]">
            <span>{`< ${currentIndex + 1} >`}</span>
          </div>

          <button
            onClick={handleNext}
            className="bg-black text-white rounded-full p-2"
          >
            &#8594;
          </button>
        </div>

        {/* 닫기 버튼을 오른쪽 끝에 배치 */}
        <div className="absolute top-4 right-4">
          <button
            onClick={closeModal}
            className="bg-white hover:bg-[#F5F5F5] p-1 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
