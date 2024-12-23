import { useEffect, useState } from "react";
import DesktopLoginPage from "./Desktop-LoginPage";
import MobileLoginPage from "./Mobile-LoginPage";

export default function LoginPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  // 화면 크기 변화에 따른 상태 업데이트
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };

    // 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return <div>{isMobile ? <MobileLoginPage /> : <DesktopLoginPage />}</div>;
}
