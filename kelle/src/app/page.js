'use client';
import { useState } from 'react';

// Reusable Topbar Component
function Topbar() {
  const [activeTab, setActiveTab] = useState('Sales');
  const tabs = ['Sales', 'Cleaning', 'Service'];

  return (
    <div className="w-full h-12 bg-white flex items-center justify-between px-8 border-b border-gray-200">
      <span className="text-gray-900 text-xl font-medium">KelleAuto</span>
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

// Search Bar Component
function SearchBar() {
  return (
    <div className="w-full max-w-md mx-auto mt-4 mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search Model"
          className="w-full pl-10 pr-4 py-0.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ name, price, image }) {
  return (
    <div className="bg-white rounded-[10px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image Area */}
      <div className="h-42 bg-gray-300"></div>
      
      {/* Info Rectangle */}
      <div className="pl-4 pr-2 pt-2 pb-2 bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-0">{name}</h3>
        <p className="text-xl font-semibold text-gray-900">{price}</p>
      </div>
    </div>
  );
}

// Main Homepage Component
export default function HomePage() {
  const sampleProducts = [
    { name: "Suzuki Jimmy", price: "€4,200" },
    { name: "Product 2", price: "€3,500" },
    { name: "Product 3", price: "€2,800" },
    { name: "Product 4", price: "€5,100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
      <Topbar />
      <div className="container mx-auto px-8">
        <SearchBar />
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}