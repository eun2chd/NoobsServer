import kakao from "../assets/login_Img/kakao_login_medium_narrow.png";

const MobileLoginPage = () => {
  const loginHandler = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
    const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = KAKAO_AUTH_URI;
  };
  return (
    <div className="flex flex-col items-center w-[100vw] h-[100vh] bg-mobileScreen bg-cover bg-top ">
      <div className="border-2 w-[250px] h-[270px] bg-white border-[#C8AA6E] rounded-[15px] bg-mobileContainer bg-cover mt-[40vh] p-5">
        <p
          className="text-[#FFFFFF] text-center text-lg font-black"
          style={{ WebkitTextStroke: "0.7px #C8AA6E" }}
        >
          리그 오브 레전드
          <br />
          사용자 설정 게임
          <br />
          팀원 자동 매칭 시스템
        </p>
        <div className="flex flex-col justify-center items-center mt-2">
          <div
            className="text-[#FFFFFF] text-center font-black text-5xl my-4"
            style={{ WebkitTextStroke: "2px #C8AA6E" }}
          >
            Login
          </div>

          <img
            src={kakao}
            alt="카카오 로그인"
            onClick={loginHandler}
            className="w-[150px] mt-2"
          />
        </div>
      </div>
      <p className="text-white text-xs absolute right-6 bottom-8">
        Leagueof Legendsand Riot Games are trademark <br />
        sor registered trademarksof Riot Games, <br />
        Inc. Leagueof Legends © Riot Games, Inc.
      </p>
    </div>
  );
};

export default MobileLoginPage;
