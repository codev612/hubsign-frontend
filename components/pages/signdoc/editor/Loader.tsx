import React, { useEffect } from "react";
import anime from "animejs";

interface LoaderProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}

const Loader: React.FC<LoaderProps> = ({
  color = "#fff",
  size = 150,
  strokeWidth = 5,
}) => {
  useEffect(() => {
    anime({
      targets: ".p1",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 1800,
      delay: (el, i) => i * 150,
      direction: "alternate",
      loop: true,
    });
  }, []);

  return (
    <div>
      <svg id="svgLoader" viewBox="0 0 259.02 459.18" width={size}>
        <polygon
          className="p1"
          fill="none"
          points="148.22 306.96 146.31 66.24 245.2 1.84 245.2 365.98 148.22 306.96"
          stroke={color}
          strokeDasharray={1000}
          strokeWidth={strokeWidth}
        />
        <polygon
          className="p1"
          fill="none"
          points="245.2 1.84 258.02 5.34 258.02 358.01 245.2 365.98 245.2 1.84"
          stroke={color}
          strokeDasharray={1000}
          strokeWidth={strokeWidth}
        />
        <path
          className="p1"
          d="M4,393.53a3.06,3.06,0,0,1-2.15-.9A3,3,0,0,1,1,390.5l.26-95A3,3,0,0,1,2.69,293L258,134.88v102a3,3,0,0,1-1.44,2.57L5.59,393.08A3,3,0,0,1,4,393.53Z"
          fill="none"
          stroke={color}
          strokeDasharray={1000}
          strokeWidth={strokeWidth}
        />
        <path
          className="p1"
          d="M13,419.16a3,3,0,0,1-1.58-5.57L258,260.68v97.91c-63.16,39.24-96.89,60.18-97.56,60.55l-.34.15a3.1,3.1,0,0,1-1.05.19h0Z"
          fill="none"
          stroke={color}
          strokeDasharray={1000}
          strokeWidth={strokeWidth}
        />
        <path
          className="p1"
          d="M190.48,424.52A3,3,0,0,1,191.9,422L258,380.82v34.44a3,3,0,0,1-1.46,2.58l-66,39.57Z"
          fill="none"
          stroke={color}
          strokeDasharray={1000}
          strokeWidth={strokeWidth}
        />
      </svg>
    </div>
  );
};

export default Loader;
