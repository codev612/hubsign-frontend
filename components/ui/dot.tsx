interface DotProps {
  text?: string;
  color?: string;
  textColor?: string;
  size?: string;
}

const Dot: React.FC<DotProps> = ({
  text = "",
  color = "blue",
  textColor = "#000000",
  size = "10px",
}) => {
  return (
    <div className="flex items-center gap-1">
      <div
        style={{
          borderRadius: "50%",
          width: size,
          height: size,
          backgroundColor: color,
        }}
      />
      {text !== "" && <p className={textColor}>{text}</p>}
    </div>
  );
};

export default Dot;
