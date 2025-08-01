import React, { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ // Changed from React.FC<{}> to React.FC<CardProps>
  children,
  title,
  className = ''
}) => {
  return <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {title && <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        </div>}
      <div className="p-6">{children}</div>
    </div>;
};

export default Card;