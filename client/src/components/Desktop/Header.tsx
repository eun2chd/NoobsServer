import React from "react";
import apiCall from "../../Api/Api";

interface HeaderProps {
  text: string;
}

const Header: React.FC<HeaderProps> = ({ text }) => {
  return (
    <>
      <h2 className="font-blackHanSans text-4xl text-white text-center xs:py-[50px]">
        {text}
      </h2>
      <button
        onClick={() => {
          try {
            apiCall("http://127.0.0.1:8000/logout", "get", null);
            alert("로그아웃 되었습니다.");
            window.location.href = "/";
          } catch (err) {
            console.log(err);
          }
        }}
        type="submit"
        className="fixed top-[2.5%] right-[2.5%] bg-transparent text-white border border-solid border-[#C89B3C]"
      >
        로그아웃
      </button>
    </>
  );
};

export default Header;
