'use client';
import { useState } from 'react';
import Topbar from '../components/Topbar';
import BookAppointmentButton from '../components/BookButton';

const cleaningOptions = [
  { id: 'exterior-wash', label: 'Exterior Wash' },
  { id: 'interior-cleaning', label: 'Interior Cleaning' },
  { id: 'wax-polish', label: 'Wax & Polish' },
  { id: 'engine-cleaning', label: 'Engine Cleaning' },
  { id: 'wheel-cleaning', label: 'Wheel & Tire Cleaning' },
  { id: 'headlight-restoration', label: 'Headlight Restoration' },
  { id: 'fabric-protection', label: 'Fabric Protection' },
  { id: 'ceramic-coating', label: 'Ceramic Coating' }
];

export default function CleaningPage() {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const getSelectedDetails = () => {
    const selectedLabels = cleaningOptions
      .filter(option => selectedOptions.includes(option.id))
      .map(option => option.label);
    
    return selectedLabels.length > 0 
      ? `Selected services: ${selectedLabels.join(', ')}` 
      : 'No services selected';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
      <Topbar />
      <div className="container mx-auto px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cleaning Services</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose your cleaning services:</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {cleaningOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleOptionChange(option.id)}
                    className="h-5 w-5 text-orange-400 focus:ring-orange-300 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={option.id} 
                    className="text-lg font-medium text-gray-900 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            
            {selectedOptions.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-orange-800 mb-2">Selected Services:</h3>
                <ul className="list-disc list-inside text-orange-700">
                  {cleaningOptions
                    .filter(option => selectedOptions.includes(option.id))
                    .map(option => (
                      <li key={option.id}>{option.label}</li>
                    ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-start">
              <BookAppointmentButton 
                type="cleaning"
                details={getSelectedDetails()}
                buttonText="Book a Cleaning Appointment"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}