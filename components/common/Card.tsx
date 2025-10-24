import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="aurora-card rounded-lg shadow-xl animate-slide-fade-in">
      {children}
    </div>
  );
};