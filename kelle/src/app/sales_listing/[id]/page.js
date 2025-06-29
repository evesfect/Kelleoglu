'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Topbar from '../../components/Topbar';
import BookAppointmentButton from '../../components/BookButton';
import ImageCarousel from '../../components/ImageCarousel';

export default function SalesListingPage() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/sales-listings/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setListing(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch listing');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Topbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Topbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error || 'Listing not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Main Content Container */}
        <div className="flex gap-8 max-w-6xl mx-auto">
          {/* Left Box */}
          <div className="w-3/5 bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {listing.title} ({listing.model_year})
            </h1>
            
            <div className="text-gray-700 mb-6">
              <p className="text-lg leading-relaxed">
                {listing.description || 'No description available.'}
              </p>
            </div>
            
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
            {/* Car Images with Carousel */}
            <div className="mb-6">
              <ImageCarousel 
                images={listing.images || []} 
                altText={`${listing.title} ${listing.model_year}`}
              />
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