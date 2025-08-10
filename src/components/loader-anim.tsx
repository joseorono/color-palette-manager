import React from 'react';
import BlocksScaleLoader from '@/assets/blocks-scale-loader.svg?react';

interface LoaderAnimProps {
  size?: number;
  className?: string;
}

const LoaderAnim: React.FC<LoaderAnimProps> = ({
  size = 24,
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <BlocksScaleLoader
        width={size}
        height={size}
      />
    </div>
  );
};

export default LoaderAnim;
