import { useState, useRef } from "react";
import backGroungImg from "../../assets/login_Img/login.webm";
import Logo from "../../assets/login_Img/legendLogo.png";
import start from "../../assets/login_Img/pause.png";
import stop from "../../assets/login_Img/play.png";

const Login = () => {
  const [isPlaying, setIsPlaying] = useState(true); // 음악 상태 (재생/일시정지)
  const audioRef = useRef<HTMLAudioElement | null>(null); // audio 태그 참조 타입 명시

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause(); // 음악 일시정지
      } else {
        audioRef.current.play(); // 음악 재생
      }
      setIsPlaying(!isPlaying); // 상태 업데이트
    }
  };

  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY; // 카카오 REST API 키
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI; // 서버에서 처리할 리디렉션 URI

    // 카카오 로그인 페이지로 리디렉션 (서버에서 처리할 로그인 URL로)
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
  };

  return (
    <div className="w-[100vw] h-[100vh] relative">
      {/* 배경 비디오 */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src={backGroungImg} type="video/webm" />
      </video>

      {/* 배경 음악 */}
      <audio
        ref={audioRef}
        className="absolute inset-0 w-full h-full z-0"
        autoPlay
        loop
      >
        <source src="/src/assets/Music/2019-MSI-.mp3" type="audio/mp3" />
      </audio>

      {/* 로그인 화면 콘텐츠 */}
      <div className="absolute inset-0 w-[30vw] h-[100vh] flex flex-col gap-[50px] justify-center bg-white px-[30px] py-[100px] text-center z-10">
        <div className="text-black mb-6">
          <img src={Logo} alt="League of Legends Logo" className="mx-auto" />
        </div>

        <p className="md:text-[17px] lg:text-[23px] text-[#0F2041] leading-tight">
          <span className="block text-[#150101] font-bold">
            League of Legends
          </span>
          <span className="block text-[#C89B3C]">Customizable Matches</span>
          <span className="block text-[#0F2041]">
            Fair Teamwork for Epic Battles
          </span>
        </p>

        {/* 카카오 로그인 버튼 */}
        <button
          onClick={handleKakaoLogin}
          className="md:text-[10px] lg:text-[17px] bg-[#FEE500] mt-8 py-2 px-4 rounded-lg transition-all"
        >
          카카오톡으로 로그인
        </button>
      </div>

      {/* 오른쪽 상단 토글 버튼 */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* 노래 재생/정지 버튼 */}
        <img
          src={
            isPlaying
              ? start // 재생 상태 이미지
              : stop // 정지 상태 이미지
          }
          alt="Toggle Music"
          className="w-[50px] h-[50px] cursor-pointer"
          onClick={toggleMusic}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>
    </div>
  );
};

export default Login;
