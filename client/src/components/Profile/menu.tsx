import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import logoImg from "../../assets/modeGif/Noobs.png";
import LoadingModal from "./Loging";
import Swal from "sweetalert2";

interface User {
  onUpdateStats: (id: number) => void;
  id: number;
  isLoading: boolean;
}

const Navbar: React.FC<User> = ({ onUpdateStats, id, isLoading }) => {
  const [logoutTime, setLogoutTime] = useState(30 * 60); // 10분을 초로 설정
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 열림 상태 관리
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer reference
  const hasLoggedOut = useRef(false); // 로그아웃 중복 호출 방지 플래그

  // 타이머 상태를 localStorage에 저장하고 불러오기
  useEffect(() => {
    // localStorage에서 타이머 상태 불러오기
    const storedTime = localStorage.getItem("logoutTime");
    if (storedTime) {
      setLogoutTime(Number(storedTime)); // 저장된 시간으로 초기화
    }

    // 타이머 실행
    timerRef.current = setInterval(() => {
      setLogoutTime((prevTime) => {
        if (prevTime > 0) {
          const newTime = prevTime - 1;
          localStorage.setItem("logoutTime", newTime.toString()); // 새로운 시간 저장
          return newTime;
        } else {
          if (!hasLoggedOut.current) {
            hasLoggedOut.current = true; // 로그아웃 처리 중복 방지
            logout("세션이 만료되었습니다.");
          }
          localStorage.removeItem("logoutTime"); // 로그아웃 시 타이머 값 삭제
          return 0;
        }
      });
    }, 1000);

    // 컴포넌트가 unmount될 때 타이머 정리
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 로그아웃 요청 함수
  const logout = async (text: string) => {
    try {
      await axios.get("http://127.0.0.1:8000/logout");
      Swal.fire({
        icon: "error",
        title: "로그아웃",
        text: text,
        background: "#fff",
        color: "#f44336",
        showConfirmButton: true,
      });
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  // 시간 포맷팅 함수 (초를 MM:SS 형식으로 변환)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <nav className="bg-gray-800 bg-opacity-80 w-full py-5 fixed top-0 left-0 z-50 font-blackHanSans">
      <div className="container mx-auto flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center">
          <a href="/main">
            <img
              src={logoImg}
              alt="Logo"
              className="w-18 h-16 cursor-pointer ml-4" /* 왼쪽 여백 추가 */
            />
          </a>
        </div>

        <div className="flex items-center space-x-6 hidden sm:flex">
          <button
            onClick={() => onUpdateStats(id)}
            className="bg-white text-yellow-700 text-lg font-semibold px-4 py-2 rounded hover:text-red-400 transition duration-300"
          >
            전적갱신
          </button>

          {/* 로딩 상태일 때 모달을 보여줌 */}
          {isLoading && <LoadingModal message="정보를 업데이트 중입니다..." />}

          <button
            onClick={() => {
              logout("로그아웃 되었습니다.");
            }}
            className="bg-white text-yellow-700 text-lg font-semibold px-4 py-2 rounded hover:text-red-400 transition duration-300"
          >
            로그아웃
          </button>

          <span className="text-white"></span>
          <span className="text-yellow-500">{`자동 로그아웃: ${formatTime(
            logoutTime
          )}`}</span>
        </div>

        {/* 모바일에서 보이는 햄버거 메뉴 */}
        <div className="md:hidden flex items-center space-x-4 ml-auto z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black text-3xl" // 검은색 햄버거 버튼
          >
            ☰
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 슬라이드 */}
      <div
        className={`fixed top-0   right-0 w-64 h-full bg-gray-800 bg-opacity-90 transition-transform duration-300 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } z-40`}
      >
        <div className="flex flex-col items-center justify-start space-y-9 pt-36">
          <span className="text-white text-lg font-semibold"></span>
          {/* 모바일 메뉴에서 로그아웃 버튼 */}
          <button
            onClick={() => {
              axios
                .get("http://127.0.0.1:8000/logout", {})
                .then(() => {
                  alert("로그아웃 되었습니다.");
                  window.location.href = "/";
                })
                .catch((error) => {
                  console.error("로그아웃 요청 중 오류 발생:", error);
                  alert("로그아웃 요청에 오류가 발생했습니다.");
                });
            }}
            className="text-yellow-700 text-lg font-semibold hover:text-red-400 transition duration-300 mt-8"
          >
            로그아웃
          </button>
          <button
            onClick={() => onUpdateStats(id)}
            className="text-yellow-700 text-lg font-semibold hover:text-red-400 transition duration-300 mt-8"
          >
            전적갱신
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
