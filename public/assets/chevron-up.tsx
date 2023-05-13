import React from "react";

export const ChevronUp = (props: any) => (
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
      d="M4.5 15.75l7.5-7.5 7.5 7.5"
    />
  </svg>
);
