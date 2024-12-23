import top from "../../../assets/line_img/line-top.png";
import jg from "../../../assets/line_img/line-jug.png";
import mid from "../../../assets/line_img/line-mid.png";
import ad from "../../../assets/line_img/line-ad.png";
import sup from "../../../assets/line_img/line-sup.png";
interface Props {
  handleLineSelection: (line: string) => void;
  setIsLine: (isLine: boolean) => void;
  setLineSrc: (line: string) => void;
}
const LineModal = ({ handleLineSelection, setIsLine, setLineSrc }: Props) => {
  const lines = [
    { name: "top", icon: top },
    { name: "jug", icon: jg },
    { name: "mid", icon: mid },
    { name: "ad", icon: ad },
    { name: "sup", icon: sup },
  ];

  const handleClick = (newLineSrc: string, newLineName: string) => {
    handleLineSelection(newLineName); // 선택된 라인 정보를 부모로 전달
    setLineSrc(newLineSrc);
    setIsLine(false); // 모달 닫기
  };

  return (
    <div className="absolute flex flex-row bg-white border-[1.5px] border-[#C8AA6E] rounded-[15px] w-[150px] h-[30px] items-center justify-around z-50">
      {lines.map((line) => (
        <img
          key={line.name}
          src={line.icon}
          alt={line.name}
          className="w-[20px] h-[20px] cursor-pointer"
          onClick={() => handleClick(line.icon, line.name)} // 라인의 이름을 전달
        />
      ))}
    </div>
  );
};

export default LineModal;
