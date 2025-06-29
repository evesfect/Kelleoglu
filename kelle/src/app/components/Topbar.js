'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Reusable Topbar Component
export default function Topbar() {
  const [activeTab, setActiveTab] = useState('Sales');
  const pathname = usePathname();
  const router = useRouter();
  const tabs = ['Sales', 'Cleaning', 'Service'];

  // Set active tab based on current route
  useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/sales_listing/')) {
      setActiveTab('Sales');
    } else if (pathname.startsWith('/cleaning')) {
      setActiveTab('Cleaning');
    } else if (pathname.startsWith('/service')) {
      setActiveTab('Service');
    }
  }, [pathname]);

  const handleTabClick = (tab) => {
    if (tab === activeTab) return; // Don't navigate if it's the same tab
    
    setActiveTab(tab);
    
    // Navigate to appropriate page
    switch (tab) {
      case 'Sales':
        router.push('/');
        break;
      case 'Cleaning':
        router.push('/cleaning');
        break;
      case 'Service':
        router.push('/service');
        break;
      default:
        break;
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div className="w-full h-12 bg-white flex items-center justify-between px-8 border-b border-gray-200">
      <span 
        className="text-gray-900 text-xl font-medium cursor-pointer hover:text-orange-600 transition-colors"
        onClick={handleLogoClick}
      >
        Anatolia Motors
      </span>
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
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