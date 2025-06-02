'use client';
import { useState, useRef, useEffect } from "react";
import { Range } from "react-range";

export default function SearchBar({ 
  message = "Search...", 
  onSearch, 
  onFilterChange,
  products = [] // To determine min/max values for sliders
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    yearRange: [2000, 2025]
  });
  
  const filterButtonRef = useRef(null);
  const popupRef = useRef(null);

  // Calculate min/max values from products
  const minPrice = products.length > 0 ? Math.min(...products.map(p => p.price || 0)) : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price || 100000)) : 100000;
  const minYear = products.length > 0 ? Math.min(...products.map(p => p.model_year || 2000)) : 2000;
  const maxYear = products.length > 0 ? Math.max(...products.map(p => p.model_year || 2025)) : 2025;

  // Initialize filter ranges based on actual data
  useEffect(() => {
    if (products.length > 0) {
      setFilters(prev => ({
        priceRange: [minPrice, maxPrice],
        yearRange: [minYear, maxYear]
      }));
    }
  }, [products, minPrice, maxPrice, minYear, maxYear]);

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, values) => {
    const newFilters = {
      ...filters,
      [filterType]: values
    };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Remove all filters
  const removeAllFilters = () => {
    const resetFilters = {
      priceRange: [minPrice, maxPrice],
      yearRange: [minYear, maxYear]
    };
    setFilters(resetFilters);
    setShowFilterPopup(false);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.priceRange[0] !== minPrice || 
           filters.priceRange[1] !== maxPrice ||
           filters.yearRange[0] !== minYear || 
           filters.yearRange[1] !== maxYear;
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) &&
          filterButtonRef.current && !filterButtonRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full pl-5 max-w-md mx-auto relative">
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={message}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-0.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>

        {/* Filter Button */}
        <button
          ref={filterButtonRef}
          onClick={() => setShowFilterPopup(!showFilterPopup)}
          className={`p-1.5 rounded-lg border transition-colors ${
            hasActiveFilters() 
              ? 'bg-orange-400 text-white border-orange-400' 
              : 'bg-white text-gray-400 border-gray-200 hover:text-gray-600'
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
        </button>
      </div>

      {/* Filter Popup */}
      {showFilterPopup && (
        <div 
          ref={popupRef}
          className="absolute top-12 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10"
        >
          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Price Range: €{filters.priceRange[0].toLocaleString()} - €{filters.priceRange[1].toLocaleString()}
              </label>
              <div className="px-2">
                <Range
                  step={1000}
                  min={minPrice}
                  max={maxPrice}
                  values={filters.priceRange}
                  onChange={(values) => handleFilterChange('priceRange', values)}
                  renderTrack={({ props, children }) => {
                    const { key, ...trackProps } = props;
                    return (
                      <div
                        key={key}
                        {...trackProps}
                        className="w-full h-2 bg-gray-200 rounded-lg relative"
                      >
                        <div
                          className="absolute h-2 bg-orange-400 rounded-lg"
                          style={{
                            left: `${((filters.priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                            width: `${((filters.priceRange[1] - filters.priceRange[0]) / (maxPrice - minPrice)) * 100}%`
                          }}
                        />
                        {children}
                      </div>
                    );
                  }}
                  renderThumb={({ props, isDragged }) => {
                    const { key, ...thumbProps } = props;
                    return (
                      <div
                        key={key}
                        {...thumbProps}
                        className={`h-5 w-5 bg-orange-400 border-2 border-white rounded-full shadow-md cursor-pointer ${
                          isDragged ? 'shadow-lg scale-110' : ''
                        }`}
                      />
                    );
                  }}
                />
              </div>
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Year Range: {filters.yearRange[0]} - {filters.yearRange[1]}
              </label>
              <div className="px-2">
                <Range
                  step={1}
                  min={minYear}
                  max={maxYear}
                  values={filters.yearRange}
                  onChange={(values) => handleFilterChange('yearRange', values)}
                  renderTrack={({ props, children }) => {
                    const { key, ...trackProps } = props;
                    return (
                      <div
                        key={key}
                        {...trackProps}
                        className="w-full h-2 bg-gray-200 rounded-lg relative"
                      >
                        <div
                          className="absolute h-2 bg-orange-400 rounded-lg"
                          style={{
                            left: `${((filters.yearRange[0] - minYear) / (maxYear - minYear)) * 100}%`,
                            width: `${((filters.yearRange[1] - filters.yearRange[0]) / (maxYear - minYear)) * 100}%`
                          }}
                        />
                        {children}
                      </div>
                    );
                  }}
                  renderThumb={({ props, isDragged }) => {
                    const { key, ...thumbProps } = props;
                    return (
                      <div
                        key={key}
                        {...thumbProps}
                        className={`h-5 w-5 bg-orange-400 border-2 border-white rounded-full shadow-md cursor-pointer ${
                          isDragged ? 'shadow-lg scale-110' : ''
                        }`}
                      />
                    );
                  }}
                />
              </div>
            </div>

            {/* Remove All Filters */}
            <div className="pt-2">
              <button
                onClick={removeAllFilters}
                className="text-sm text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                Remove all filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}