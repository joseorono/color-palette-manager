import React from "react";
import BlocksScaleLoader from "@/assets/blocks-scale-loader.svg?react";
import { useTheme } from "../theme-provider";

interface LoaderAnimProps {
  size?: number;
  className?: string;
  color?: string;
}

const LoaderAnim: React.FC<LoaderAnimProps> = ({
  size = 24,
  className = "",
  color = undefined,
}) => {
  const fillColor = color ? color : 'hsl(var(--primary))';
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <BlocksScaleLoader width={size} height={size} fill={fillColor} />
    </div>
  );
};

export default LoaderAnim;
