import React from "react";

interface Props {
  color: string;
}

const TeamContainer: React.FC<Props> = ({ color }) => {
  const textColor = color === "RED" ? "#8A2922" : "#004A82";
  return (
    <>
      <p
        className="text-[30px] font-blackHanSans"
        style={{
          color: textColor,
          WebkitTextStroke: "1px #C8AA6E",
        }}
      >
        {color} TEAM
      </p>
      <div className="bg-[#F0E6D2] border-2 border-[#C8AA6E] rounded-[40px] bg-opacity-15 w-[300px] min-h-[250px] mb-7">
        <div className="flex flex-col justify-between h-full space-y-12 mt-12">
          <div className="h-[1px] bg-[#ffffff] bg-opacity-30 w-[80%] mx-auto"></div>
          <div className="h-[1px] bg-[#ffffff] bg-opacity-30 w-[80%] mx-auto"></div>
          <div className="h-[1px] bg-[#ffffff] bg-opacity-30 w-[80%] mx-auto"></div>
          <div className="h-[1px] bg-[#ffffff] bg-opacity-30 w-[80%] mx-auto"></div>
        </div>
      </div>
    </>
  );
};

export default TeamContainer;
