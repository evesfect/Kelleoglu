'use client';
import { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import BookAppointmentButton from './components/BookButton';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';
import Toast from './components/Toast';

// Main Homepage Component
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    yearRange: [2000, 2025]
  });

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const toastMessage = "info.kelleauto@gmail.com\n +47 (463) 74-775";

  // Function to show toast
  const triggerToast = () => {
    setShowToast(true);
  };

  // Function to close toast
  const closeToast = () => {
    setShowToast(false);
  };

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
        setFilteredProducts(data);
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

  // Filter products based on search term and filters
  useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply year filter
    filtered = filtered.filter(product =>
      product.model_year >= filters.yearRange[0] && product.model_year <= filters.yearRange[1]
    );

    setFilteredProducts(filtered);
  }, [products, searchTerm, filters]);

  // Handle search changes
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

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
            <SearchBar 
              message="Search a model" 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              products={products}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* Show message if no products */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              {products.length === 0 ? "No products found" : "No products match your search criteria"}
            </p>
          </div>
        )}
      </div>

      {/* Toast Component */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={closeToast}
        duration={10000}
      />
      {/* Fixed bottom text */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-0">
        <div className="text-center">
          <span 
            className="text-gray-600 text-sm cursor-pointer hover:text-orange-600 transition-colors"
            onClick={triggerToast}
          >
            show contact info
          </span>
        </div>
      </div>
    </div>
  );
}