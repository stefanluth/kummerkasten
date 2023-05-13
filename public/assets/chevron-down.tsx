import React from "react";

export const ChevronDown = (props: any) => (
  <svg
    className={props.className || "w-6 h-6"}
    xmlns="http://www.w3.org/2000/svg"
    fill={props.fill || "none"}
    viewBox="0 0 24 24"
    strokeWidth={props.strokeWidth || 1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);
