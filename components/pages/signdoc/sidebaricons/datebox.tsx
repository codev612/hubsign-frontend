import React from "react";

export const DateBoxIcon = ({
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
        d="M6 10.6673H18M9.33333 8.00065V5.33398M14.6667 8.00065V5.33398M10.2667 18.6673H13.7333C15.2268 18.6673 15.9735 18.6673 16.544 18.3767C17.0457 18.121 17.4537 17.7131 17.7094 17.2113C18 16.6409 18 15.8941 18 14.4007V10.934C18 9.44051 18 8.69377 17.7094 8.12334C17.4537 7.62158 17.0457 7.21363 16.544 6.95797C15.9735 6.66732 15.2268 6.66732 13.7333 6.66732H10.2667C8.77319 6.66732 8.02646 6.66732 7.45603 6.95797C6.95426 7.21363 6.54631 7.62158 6.29065 8.12334C6 8.69377 6 9.44051 6 10.934V14.4007C6 15.8941 6 16.6409 6.29065 17.2113C6.54631 17.7131 6.95426 18.121 7.45603 18.3767C8.02646 18.6673 8.77319 18.6673 10.2667 18.6673Z"
        stroke={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
};
