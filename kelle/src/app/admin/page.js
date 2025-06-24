'use client';
import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'kelleoglu1453'; // Hardcoded password

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [salesListings, setSalesListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredSalesListings, setFilteredSalesListings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');
  const [bookingsSearchTerm, setBookingsSearchTerm] = useState('');
  const [showPastBookings, setShowPastBookings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    model_year: '',
    description: '',
    price: '',
    mileage: '',
    fuel_type: '',
    image_url: ''
  });

  // Check if user is already authenticated (from sessionStorage)
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setPasswordError('');
      fetchData();
    } else {
      setPasswordError('Incorrect password');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setPasswordInput('');
    setPasswordError('');
  };

  // Fetch data on component mount
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch sales listings
      const salesResponse = await fetch('/api/sales-listings');
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setSalesListings(salesData);
        setFilteredSalesListings(salesData);
      }

      // Fetch bookings
      const bookingsResponse = await fetch('/api/admin/bookings');
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }

    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort bookings based on showPastBookings
  useEffect(() => {
    let filtered = bookings;
    const now = new Date();

    if (!showPastBookings) {
      // Show only future bookings, sorted by date (closest first)
      filtered = bookings
        .filter(booking => booking.appointment_time && new Date(booking.appointment_time) >= now)
        .sort((a, b) => new Date(a.appointment_time) - new Date(b.appointment_time));
    } else {
      // Show all bookings, sorted by date (newest first)
      filtered = bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Apply search filter
    if (bookingsSearchTerm) {
      filtered = filtered.filter(booking =>
        booking.contact_name?.toLowerCase().includes(bookingsSearchTerm.toLowerCase()) ||
        booking.type?.toLowerCase().includes(bookingsSearchTerm.toLowerCase()) ||
        booking.details?.toLowerCase().includes(bookingsSearchTerm.toLowerCase()) ||
        booking.contact_phonenumber?.includes(bookingsSearchTerm)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, showPastBookings, bookingsSearchTerm]);

  // Filter sales listings based on search term
  useEffect(() => {
    let filtered = salesListings;

    if (salesSearchTerm) {
      filtered = salesListings.filter(listing =>
        listing.title?.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
        listing.description?.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
        listing.fuel_type?.toLowerCase().includes(salesSearchTerm.toLowerCase())
      );
    }

    setFilteredSalesListings(filtered);
  }, [salesListings, salesSearchTerm]);

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title || '',
      model_year: listing.model_year || '',
      description: listing.description || '',
      price: listing.price || '',
      mileage: listing.mileage || '',
      fuel_type: listing.fuel_type || '',
      image_url: listing.image_url || ''
    });
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    setEditingListing(null);
    setFormData({
      title: '',
      model_year: '',
      description: '',
      price: '',
      mileage: '',
      fuel_type: '',
      image_url: ''
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      const url = editingListing 
        ? `/api/sales-listings/${editingListing.id}`
        : '/api/sales-listings';
      
      const method = editingListing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          model_year: parseInt(formData.model_year),
          price: parseFloat(formData.price),
          mileage: parseInt(formData.mileage)
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        fetchData(); // Refresh the data
      } else {
        const error = await response.json();
        alert('Error saving listing: ' + error.error);
      }
    } catch (err) {
      console.error('Error saving listing:', err);
      alert('Error saving listing');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        const response = await fetch(`/api/sales-listings/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchData(); // Refresh the data
        } else {
          const error = await response.json();
          alert('Error deleting listing: ' + error.error);
        }
      } catch (err) {
        console.error('Error deleting listing:', err);
        alert('Error deleting listing');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `€${price.toLocaleString()}`;
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter admin password"
                required
              />
            </div>
            {passwordError && (
              <div className="text-red-400 text-sm">{passwordError}</div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-lg">Loading admin data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-lg text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">KelleAuto Admin Panel</h1>
          <div className="text-gray-400 text-sm">
            Sales Listings: {filteredSalesListings.length} | Bookings: {filteredBookings.length}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex gap-4 h-[calc(100vh-120px)]">
        
        {/* Left Panel - Sales Listings */}
        <div className="w-1/2 bg-gray-800 rounded-lg p-4 flex flex-col">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Sales Listings</h2>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
              >
                Add New
              </button>
            </div>
            <input
              type="text"
              placeholder="Search listings..."
              value={salesSearchTerm}
              onChange={(e) => setSalesSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {filteredSalesListings.map((listing) => (
                <div key={listing.id} className="bg-gray-700 p-3 rounded border border-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">
                      {listing.title} ({listing.model_year})
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(listing)}
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-400 font-semibold">
                      {formatPrice(listing.price)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>Mileage: {listing.mileage?.toLocaleString() || 'N/A'} km</div>
                    <div>Fuel: {listing.fuel_type || 'N/A'}</div>
                    <div>Created: {formatDate(listing.created_at)}</div>
                    {listing.description && (
                      <div className="text-gray-400 text-xs mt-2 truncate">
                        {listing.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Bookings */}
        <div className="w-1/2 bg-gray-800 rounded-lg p-4 flex flex-col">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-3">Bookings</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search bookings..."
                value={bookingsSearchTerm}
                onChange={(e) => setBookingsSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showPastBookings}
                  onChange={(e) => setShowPastBookings(e.target.checked)}
                  className="mr-2 accent-blue-500"
                />
                Show past bookings
              </label>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-gray-700 p-3 rounded border border-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{booking.type}</h3>
                    <span className={`text-sm px-2 py-1 rounded ${
                      booking.appointment_time && new Date(booking.appointment_time) < new Date()
                        ? 'bg-red-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}>
                      {booking.appointment_time && new Date(booking.appointment_time) < new Date() ? 'Past' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div><strong>Contact:</strong> {booking.contact_name || 'N/A'}</div>
                    <div><strong>Phone:</strong> {booking.contact_phonenumber || 'N/A'}</div>
                    <div><strong>Appointment:</strong> {formatDate(booking.appointment_time)}</div>
                    <div><strong>Created:</strong> {formatDate(booking.created_at)}</div>
                    {booking.details && (
                      <div className="text-gray-400 text-xs mt-2">
                        <strong>Details:</strong> {booking.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingListing ? 'Edit Listing' : 'Add New Listing'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Model Year</label>
                <input
                  type="number"
                  value={formData.model_year}
                  onChange={(e) => setFormData({...formData, model_year: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mileage (km)</label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Fuel Type</label>
                <select
                  value={formData.fuel_type}
                  onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select fuel type</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="LPG">LPG</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}