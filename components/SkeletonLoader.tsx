import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className }) => {
  return (
    <div className={`bg-gray-600 rounded-md animate-shimmer ${className}`} />
  );
};

export default SkeletonLoader;
