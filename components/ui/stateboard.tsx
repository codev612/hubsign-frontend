import React from "react";

interface DotProps {
  text: string;
  state: string;
  bgColor?: string;
}

const StateBoard: React.FC<DotProps> = ({
  text,
  state,
  bgColor = "bg-bgdanger",
}) => {
  return <p className={`${state} ${bgColor} rounded-md p-3`}>{text}</p>;
};

export default StateBoard;
