import { User } from "../../../commonTypes";
import React, { useState } from "react"; 
import reload from "../../../assets/reload.png";
import trash from "../../../assets/trashbin.png";
import apiCall from "../../../Api/Api";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import LoadingModal from "../../Profile/Loging";
interface Props {
  user: User;
  setUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUserAdded: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteUser: (userId: number) => void;
}

const UserModal = ({
  user,
  setUserModal,
  setIsUserAdded,
  handleDeleteUser,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const reloadInfo = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // 이벤트 전파 막기
    setIsLoading(true);
    const data = {
      user_id: user.updateId,
    };

    const updateUser = async () => {
      try {
        // 비동기 함수 내에서 await 사용
        await apiCall("/noobs/friendUserBrUpdate", "post", data);
        setUserModal(false); // 모달 닫기
        Swal.fire({
          icon: "success",
          text: "전적 정보 업데이트 완료되었습니다.",
          showConfirmButton: false,
          timer: 3000,
          background: "#fff",
          color: "#000",
        });
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.data
        ) {
          const errorMessage = error.response.data.message;
          Swal.fire({
            icon: "error",
            text: errorMessage,
            background: "#fff",
            color: "#f44336",
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "서버 오류 발생",
            background: "#fff",
            color: "#f44336",
            showConfirmButton: true,
          });
        }
      } finally {
        setIsLoading(false); 
      }
    };

    // updateUser 호출
    updateUser();
  };

  const deleteFr = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const data = {
      user_id: user.id,
    };
    try {
      apiCall("/noobs/friendUserBrDel", "post", data);
      Swal.fire({
        icon: "success",
        text: "삭제가 완료되었습니다.",
        showConfirmButton: false,
        timer: 3000,
        background: "#fff",
        color: "#000",
      });
      handleDeleteUser(user.id);
      setIsUserAdded((prev) => !prev);
    } catch (err) {}
    setUserModal(false);
  };
  return (
    <div className="flex gap-[5px] flex-col w-[180px] bg-[#F0E6D2] border-2 border-[#C8AA6E] rounded-lg absolute top-0 p-1 z-50">
      <p>
        {user.gameName} {user.tagLine}
      </p>
      <hr className="border-[#C8AA6E] text-center" />
      <Link
        to="/ProfilePage"
        className="no-underline text-black"
        state={{ user_id: user.updateId }}
      >
        프로필 확인하기
      </Link>
      <div
        className="flex flex-row items-center gap-2 cursor-pointer"
        onClick={reloadInfo}
      >
        <img src={reload} alt="reloadImg" className="w-[16px] h-[16px]" />
        <p className="text-red">전적 갱신하기</p>
        {isLoading && <LoadingModal message="정보를 업데이트 중입니다..." />} 
      </div>
      <div
        className="flex flex-row items-center gap-2 cursor-pointer"
        onClick={deleteFr}
      >
        <img src={trash} alt="trashImg" className="w-[16px] h-[16px]" />
        <p className="text-red">목록에서 삭제하기</p>
      </div>
    </div>
  );
};

export default UserModal;
