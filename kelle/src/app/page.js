'use client';
import { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import BookAppointmentButton from './components/BookButton';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';

// Main Homepage Component
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch data from your API endpoint that queries sales_listings table
        const response = await fetch('/api/sales-listings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
        <Topbar />
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-center mt-20">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
        <Topbar />
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-center mt-20">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[var(--font-nunito-sans)]">
      <Topbar />
      <div className="container mx-auto px-8">
        <div className="flex items-center mt-4 mb-6">
          <BookAppointmentButton />
          <div className="flex-1 flex justify-center">
            <SearchBar message="Search a model" />
          </div>
        </div>
       
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* Show message if no products */}
        {products.length === 0 && !loading && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}