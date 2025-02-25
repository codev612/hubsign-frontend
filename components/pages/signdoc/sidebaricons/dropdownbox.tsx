import React from "react";

export const DropdownIcon = ({
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
      <path
        d="M16 10.666L12.4714 14.1946C12.2111 14.455 11.7889 14.455 11.5286 14.1946L8 10.666"
        stroke={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
};
