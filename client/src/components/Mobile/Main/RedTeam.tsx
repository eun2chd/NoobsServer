import AddedUserInfo from "../chooseUser/AddedUserInfo";
import { User } from "../../../commonTypes";
interface RedTeamProps {
  teamMembers: User[];
  selectedMode: string;
  onRemoveUser: (user: User) => void;
  handleAddUser: (user: User) => void;
}
const RedTeam: React.FC<RedTeamProps> = ({
  teamMembers,
  selectedMode,
  onRemoveUser,
  handleAddUser,
}) => {
  return (
    <>
      <p
        className="text-[30px] font-blackHanSans text-[#8A2922]"
        style={{
          WebkitTextStroke: "1px #C8AA6E",
        }}
      >
        RED TEAM
      </p>
      <div className="bg-[#F0E6D2] border-2 border-[#C8AA6E] rounded-[40px] bg-opacity-15 w-[300px] h-[300px] mb-7 relative">
        <div className="h-[1px] bg-[#ffffff] bg-opacity-30 w-[80%] absolute top-[60px] left-[calc(150px-40%)]"></div>
        <div className="h-[1px] bg-[#ffffff] bg-opacity-30 w-[80%] absolute top-[120px] left-[calc(150px-40%)]"></div>
        <div className="h-[1px] bg-[#ffffff] bg-opacity-30 w-[80%] absolute top-[180px] left-[calc(150px-40%)]"></div>
        <div className="h-[1px] bg-[#ffffff] bg-opacity-30 w-[80%] absolute top-[240px] left-[calc(150px-40%)]"></div>
        {teamMembers.map((user, index) => (
          <AddedUserInfo
            key={index}
            user={user}
            onRemoveUser={onRemoveUser}
            handleAddUser={handleAddUser}
            selectedMode={selectedMode}
          />
        ))}
      </div>
    </>
  );
};

export default RedTeam;
