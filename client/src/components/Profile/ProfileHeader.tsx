import React from "react";
import Swal from 'sweetalert2';
interface ProfileProps {
  profileimg: string;
  gameName: string;
}

const ProfileHeader: React.FC<ProfileProps> = ({ profileimg, gameName }) => {
  const handleCopy = () => {
    // 클립보드에 gameName 텍스트를 복사
    navigator.clipboard.writeText(gameName).then(() => {
      // 복사 후 Swal로 알림
      Swal.fire({
        icon: 'success',
        text: `${gameName}이 복사되었습니다.`,
        background: '#fff',
        color: '#000', // 성공 메시지 색상
        showConfirmButton: false,
        timer: 2000, // 2초 후 자동으로 사라짐
      });
    }).catch(err => {
      console.error("복사 실패: ", err);
      Swal.fire({
        icon: 'error',
        title: '복사 실패',
        text: '복사하는데 문제가 발생했습니다.',
        background: '#fff',
        color: '#f44336',
        showConfirmButton: true,
      });
    });
  };
  return (
    <div className="flex flex-col items-center bg-gray-800 text-white p-6 rounded-lg font-blackHanSans ">
      <img
        src={profileimg}
        alt="Profile"
        className="w-40 h-40 rounded-full border-4 border-blue-500 transition-transform transform hover:scale-110"
      />
      <h1 className="text-lg font-bold mt-4 opacity-0 animate-fadeIn animate-delay-500 font-blackHanSans text-overflow: ellipsis overflow-hidden whitespace-nowrap cursor-pointer hover:text-[#D8D9CF] hover:text-xl"
       onClick={handleCopy}
      >
        {gameName}
     
      </h1>
      <p className="text-sm text-center mt-2 text-[#F6F5F2]">📋 게임 이름을 클릭하면 복사할 수 있습니다!</p>
    </div>
  );
};

export default ProfileHeader;
