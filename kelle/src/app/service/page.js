'use client';
import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import BookAppointmentButton from '../components/BookButton';

export default function ServicePage() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServiceOptions();
  }, []);

  const fetchServiceOptions = async () => {
    try {
      const response = await fetch('/api/service-offerings');
      if (response.ok) {
        const data = await response.json();
        setServiceOptions(data);
      } else {
        setError('Failed to load service options');
      }
    } catch (err) {
      setError('Failed to load service options');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

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
    const selectedLabels = serviceOptions
      .filter(option => selectedOptions.includes(option.id))
      .map(option => option.name);
    
    return selectedLabels.length > 0 
      ? `Selected services: ${selectedLabels.join(', ')}` 
      : 'No services selected';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
        <Topbar />
        <div className="container mx-auto px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">Loading services...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
        <Topbar />
        <div className="container mx-auto px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center py-12">
                <div className="text-lg text-red-600">{error}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
      <Topbar />
      <div className="container mx-auto px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Service</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose your services:</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {serviceOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    id={`service-${option.id}`}
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleOptionChange(option.id)}
                    className="h-5 w-5 text-orange-400 focus:ring-orange-300 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={`service-${option.id}`} 
                    className="text-lg font-medium text-gray-900 cursor-pointer"
                  >
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
            
            {selectedOptions.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-orange-800 mb-2">Selected Services:</h3>
                <ul className="list-disc list-inside text-orange-700">
                  {serviceOptions
                    .filter(option => selectedOptions.includes(option.id))
                    .map(option => (
                      <li key={option.id}>{option.name}</li>
                    ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-start">
              <BookAppointmentButton 
                type="service"
                details={getSelectedDetails()}
                buttonText="Book a Service Appointment"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}