interface DotProps {
  text: string;
  color: string;
  textColor: string;
}

const Dot: React.FC<DotProps> = ({ text, color, textColor }) => {
  return (
    <div className="flex items-center gap-1">
      <div
        style={{
          borderRadius: "50%",
          width: "10px",
          height: "10px",
          backgroundColor: color,
        }}
      />
      <p className={textColor}>{text}</p>
    </div>
  );
};

export default Dot;
