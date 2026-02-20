import React from "react";

type HomeButtonIconProps = {
  size?: number;
  outerColor?: string;
  innerColor?: string;
  strokeWidth?: number;
};

export const HomeButtonIcon: React.FC<HomeButtonIconProps> = ({
  size = 48,
  outerColor = "#ffffff",
  innerColor = "#ffffff",
  strokeWidth = 2,
}) => {
  const center = size / 2;
  const outerRadius = center - strokeWidth;
  const innerRadius = outerRadius - 4;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        stroke={outerColor}
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Inner filled circle */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill={innerColor}
      />
    </svg>
  );
};
