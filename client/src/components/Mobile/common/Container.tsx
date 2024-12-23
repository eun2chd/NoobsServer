import { Props } from "../../../commonTypes";

const Container = ({ children }: Props) => {
  return (
    <div className="w-[300px] bg-white border-2 border-[#C8AA6E] rounded-[15px] bg-opacity-15">
      {children}
    </div>
  );
};

export default Container;
