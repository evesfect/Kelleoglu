'use client';
import Topbar from '../components/Topbar';

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
      <Topbar />
      <div className="container mx-auto px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Service</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-600 mb-4">Service page coming soon</h2>
              <p className="text-gray-500">We're working on bringing you the best service options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}