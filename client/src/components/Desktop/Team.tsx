import BlueTeam from "./BlueTeam";
import RedTeam from "./RedTeam";
import Versus from "./Versus";
import { User } from "../../commonTypes";

interface TeamProps {
  redTeam: User[];
  blueTeam: User[];
  selectedMode: string;
  handleRemoveUser: (user: User) => void;
  handleAddUser: (user: User) => void;
}

const Team: React.FC<TeamProps> = ({
  redTeam,
  blueTeam,
  selectedMode,
  handleRemoveUser,
  handleAddUser,
}) => {
  const redTeamWithDefaults = Array.from(
    { length: 5 },
    (_, idx) => redTeam?.[idx] || null
  );

  const blueTeamWithDefault = Array.from(
    { length: 5 },
    (_, idx) => blueTeam?.[idx] || null
  );

  return (
    <div className="lg:col-span-2 lg:row-span-3 border border-solid border-[#C89B3C] rounded-2xl xs:px-[1vw] xs:py-[1vh] md:px-[2vw] md:py-[2vh] xl:px-[3vw] xl:py-[3vh] flex flex-col xl:gap-[20px] lg:gap-[5px] bg-[#F0E6D2] bg-opacity-15 lg:overflow-auto">
      {/* Red Team 영역 */}
      <div className="w-[100%] h-[100%] flex change:gap-[10px] lg:gap-[15px] xl:gap-[25px] justify-between">
        {redTeamWithDefaults.map((user, idx) => (
          <RedTeam
            key={idx}
            user={user}
            handleRemoveUser={handleRemoveUser}
            handleAddUser={handleAddUser}
            selectedMode={selectedMode}
          />
        ))}
      </div>
      <div>
        <Versus />
      </div>
      {/* Blue Team 영역 */}
      <div className="w-[100%] h-[100%] flex xs:gap-[10px] lg:gap-[15px] xl:gap-[25px] justify-center">
        {blueTeamWithDefault.map((user, idx) => (
          <BlueTeam
            key={idx}
            user={user}
            handleRemoveUser={handleRemoveUser}
            handleAddUser={handleAddUser}
            selectedMode={selectedMode}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;
