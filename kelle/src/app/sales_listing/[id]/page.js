'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Topbar from '../../components/Topbar';
import BookAppointmentButton from '../../components/BookButton';

export default function SalesListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sales-listings/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError('Failed to fetch listing details');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
        <Topbar />
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-center mt-20">
            <div className="text-lg text-gray-600">Loading listing details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
        <Topbar />
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-center mt-20">
            <div className="text-lg text-red-600">{error || 'Listing not found'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
      <Topbar />
      <div className="container mx-auto px-8 py-6">
        <div className="flex gap-6 h-[calc(100vh-120px)]">
          {/* Left Box */}
          <div className="w-3/5 bg-white rounded-lg shadow-lg p-6">
            {/* Title and Model Year */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {listing.title} ({listing.model_year})
            </h1>
            
            {/* Description */}
            <p className="text-base text-gray-600 mb-6">
              {listing.description || 'No description available'}
            </p>
            
            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-700 w-24">Price:</span>
                <span className="text-lg text-gray-900">€{listing.price?.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-700 w-24">Mileage:</span>
                <span className="text-lg text-gray-900">{listing.mileage?.toLocaleString()} km</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-700 w-24">Fuel Type:</span>
                <span className="text-lg text-gray-900">{listing.fuel_type}</span>
              </div>
            </div>
          </div>
          
          {/* Right Box */}
          <div className="w-2/5 bg-white rounded-lg shadow-lg p-6 flex flex-col">
            {/* Car Image */}
            <div className="h-64 bg-gray-200 rounded-lg overflow-hidden mb-6">
              {listing.image_url && !imageError ? (
                <img 
                  src={listing.image_url}
                  alt={`${listing.title} ${listing.model_year}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500 text-sm text-center">No image available</p>
                </div>
              )}
            </div>
            
            {/* Book Appointment Button */}
            <div className="mb-6">
            <BookAppointmentButton 
                type="sales"
                details={`Interest in: ${listing.title} (${listing.model_year}) - ID: ${listing.id}`}
            />
            </div>
            
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact information:</h3>
              <div className="text-gray-700">
                <p>info.kelleauto@gmail.com</p>
                <p>+47 (463) 74-775</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}