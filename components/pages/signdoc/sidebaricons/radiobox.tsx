import React from "react";

export const RadioBoxIcon = ({
  fill,
  stroke,
}: {
  fill: string;
  stroke: string;
}) => {
  return (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill={fill} height="23" rx="3.5" width="23" x="0.5" y="0.5" />
      <rect height="23" rx="3.5" stroke={stroke} width="23" x="0.5" y="0.5" />
      <rect
        height="11.6364"
        rx="5.81818"
        stroke={stroke}
        width="11.6364"
        x="6.18164"
        y="6.18164"
      />
      <ellipse
        cx="11.9999"
        cy="11.9989"
        fill={stroke}
        rx="2.90909"
        ry="2.90909"
      />
    </svg>
  );
};
