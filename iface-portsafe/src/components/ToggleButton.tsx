"use client";

import React, { useState } from 'react';
import { FaUser, FaBuilding } from 'react-icons/fa';

interface ToggleButtonProps {
  onToggle: (selected: string) => void;
  options?: string[];
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onToggle, options: optionLabels }) => {
  const [selected, setSelected] = useState(optionLabels?.[0] || 'Morador');

  const handleToggle = (label: string) => {
    setSelected(label);
    onToggle(label);
  };

  const options = optionLabels 
    ? optionLabels.map(label => ({
        label,
        icon: label === 'Morador' ? <FaUser /> : <FaBuilding />
      }))
    : [
        { label: 'Morador', icon: <FaUser /> },
        { label: 'Porteiro', icon: <FaBuilding /> },
      ];

  return (
    <div className="mt-4 mb-4">
    <div className="flex justify-center gap-2 bg-gray-800 p-2 rounded-xl">
      {options.map(({ label, icon }) => (
        <button
          key={label}
          className={`buttontoggle flex items-center justify-center px-4 py-2 rounded-lg text-white  text-sm transition-colors ${
            selected === label ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-800 hover:bg-gray-600'
          }`}
          onClick={() => handleToggle(label)}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </button>
      ))}
      <style jsx>{`
        div {
          display: flex;
          padding: 4px;
          border-radius: 12px;
          width: 100;
          max-width: 300px;
          align-items: center;
          margin: 0 auto;
        }

        .buttontoggle{
          width: 50%;
          font-size: clamp(0.9rem, 3vw, 1rem); /* Tamanho de fonte responsivo */
          padding: 0.5rem;
        }
      `}</style>
    </div>
    </div>
  );
};

export default ToggleButton;