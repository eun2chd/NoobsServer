import { Props } from "../../../commonTypes";
import LatestUserInfo from "./LatestUserInfo";
import { User } from "../../../commonTypes";
interface UserContainerProps extends Props {
  users: User[];
  onAddUser: (user: User) => void;
  setIsUserAdded: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteUser: (userId: number) => void;
}

const UserContainer: React.FC<UserContainerProps> = ({
  children,
  users,
  onAddUser,
  setIsUserAdded,
  handleDeleteUser,
}) => {
  return (
    <>
      <div className="w-[300px] min-h-[40vh] bg-[#F0E6D2] border-2 border-[#C8AA6E] rounded-[40px] bg-opacity-15 mt-7 mb-7 p-2">
        {/* <div className="ml-3 mb-5 mt-3 flex flex-row justify-between"> */}
        <div className="py-3 px-2 flex flex-row justify-between">
          <div className=" text-white">최근에 같이한 친구</div>
          <div className=" text-white">{users.length}명/15</div>
        </div>

        <hr />
        {users.map((user) => (
          <LatestUserInfo
            key={user.id}
            user={user}
            onAddUser={onAddUser}
            setIsUserAdded={setIsUserAdded}
            handleDeleteUser={handleDeleteUser}
          />
        ))}
        {children}
      </div>
    </>
  );
};

export default UserContainer;
