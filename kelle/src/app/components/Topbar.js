'use client';
import { useState } from 'react';

// Reusable Topbar Component
export default function Topbar() {
  const [activeTab, setActiveTab] = useState('Sales');
  const tabs = ['Sales', 'Cleaning', 'Service'];

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="w-full h-12 bg-white flex items-center justify-between px-8 border-b border-gray-200">
      <span 
        className="text-gray-900 text-xl font-medium cursor-pointer hover:text-orange-600 transition-colors"
        onClick={handleLogoClick}
      >
        KelleAuto
      </span>
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-lg text-gray-900 transition-colors ${
              activeTab === tab ? 'bg-white shadow-sm border border-gray-200' : 'hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}