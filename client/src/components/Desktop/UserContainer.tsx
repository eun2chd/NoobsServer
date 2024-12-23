import React from "react";
import { User } from "../../commonTypes";
import LatestUserInfo from "./LatestUserInfo";

interface UserContainerProps {
  allUsers: User[];
  handleAddUser: (user: User) => void;
  setAddedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setIsUserAdded: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteUser: (userId: number) => void;
}

const UserContainer: React.FC<UserContainerProps> = ({
  allUsers,
  handleAddUser,
  setIsUserAdded,
  handleDeleteUser,
}) => {
  return (
    <div>
      <div className="w-[100%] h-[70vh] overflow-auto border border-solid border-[#C89B3C] rounded-2xl bg-[#F0E6D2] bg-opacity-15 p-4">
        <div className="py-3  flex flex-row justify-between items-center">
          <div className="font-blackHanSans text-3xl lg:text-2xl xl:text-3xl text-center text-white">
            최근에 같이한 친구
          </div>
          <div className="font-blackHanSans text-xl text-center text-white">
            {allUsers.length}명/20
          </div>
        </div>

        <div>
          {allUsers.map((user) => (
            <LatestUserInfo
              key={user.id}
              user={user}
              onAddUser={handleAddUser}
              setIsUserAdded={setIsUserAdded}
              handleDeleteUser={handleDeleteUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserContainer;
