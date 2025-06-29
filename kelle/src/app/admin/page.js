'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sales Listings State
  const [salesListings, setSalesListings] = useState([]);
  const [filteredSalesListings, setFilteredSalesListings] = useState([]);
  const [salesSearchTerm, setSalesSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    model_year: '',
    description: '',
    price: '',
    mileage: '',
    fuel_type: '',
    images: [] // Changed from image_url to images array
  });

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [bookingsSearchTerm, setBookingsSearchTerm] = useState('');
  const [showPastBookings, setShowPastBookings] = useState(false);

  // Cleaning Offerings State
  const [cleaningOfferings, setCleaningOfferings] = useState([]);
  const [filteredCleaningOfferings, setFilteredCleaningOfferings] = useState([]);
  const [cleaningSearchTerm, setCleaningSearchTerm] = useState('');
  const [showCleaningModal, setShowCleaningModal] = useState(false);
  const [editingCleaningOffering, setEditingCleaningOffering] = useState(null);
  const [cleaningFormData, setCleaningFormData] = useState({
    name: '',
    description: ''
  });

  // Service Offerings State
  const [serviceOfferings, setServiceOfferings] = useState([]);
  const [filteredServiceOfferings, setFilteredServiceOfferings] = useState([]);
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceOffering, setEditingServiceOffering] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    description: ''
  });

  // Check for existing authentication on component mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuthenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return `€${Number(price).toLocaleString()}`;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Simple password check
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setPasswordError('');
      setPasswordInput('');
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

      // Fetch cleaning offerings
      const cleaningResponse = await fetch('/api/cleaning-offerings');
      if (cleaningResponse.ok) {
        const cleaningData = await cleaningResponse.json();
        setCleaningOfferings(cleaningData);
        setFilteredCleaningOfferings(cleaningData);
      }

      // Fetch service offerings
      const serviceResponse = await fetch('/api/service-offerings');
      if (serviceResponse.ok) {
        const serviceData = await serviceResponse.json();
        setServiceOfferings(serviceData);
        setFilteredServiceOfferings(serviceData);
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

  // Filter cleaning offerings based on search term
  useEffect(() => {
    let filtered = cleaningOfferings;

    if (cleaningSearchTerm) {
      filtered = cleaningOfferings.filter(offering =>
        offering.name?.toLowerCase().includes(cleaningSearchTerm.toLowerCase()) ||
        offering.description?.toLowerCase().includes(cleaningSearchTerm.toLowerCase())
      );
    }

    setFilteredCleaningOfferings(filtered);
  }, [cleaningOfferings, cleaningSearchTerm]);

  // Filter service offerings based on search term
  useEffect(() => {
    let filtered = serviceOfferings;

    if (serviceSearchTerm) {
      filtered = serviceOfferings.filter(offering =>
        offering.name?.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
        offering.description?.toLowerCase().includes(serviceSearchTerm.toLowerCase())
      );
    }

    setFilteredServiceOfferings(filtered);
  }, [serviceOfferings, serviceSearchTerm]);

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title || '',
      model_year: listing.model_year || '',
      description: listing.description || '',
      price: listing.price || '',
      mileage: listing.mileage || '',
      fuel_type: listing.fuel_type || '',
      images: listing.images || []
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
      images: []
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      // Ensure at least one image is marked as main if images exist
      if (formData.images && formData.images.length > 0) {
        const hasMainImage = formData.images.some(img => img.is_main);
        if (!hasMainImage) {
          const updatedImages = [...formData.images];
          updatedImages[0].is_main = true;
          setFormData({...formData, images: updatedImages});
        }
      }

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
          alert('Error deleting listing');
        }
      } catch (err) {
        console.error('Error deleting listing:', err);
        alert('Error deleting listing');
      }
    }
  };

  // Cleaning Offerings handlers
  const handleCleaningEdit = (offering) => {
    setEditingCleaningOffering(offering);
    setCleaningFormData({
      name: offering.name || '',
      description: offering.description || ''
    });
    setShowCleaningModal(true);
  };

  const handleCleaningAddNew = () => {
    setEditingCleaningOffering(null);
    setCleaningFormData({
      name: '',
      description: ''
    });
    setShowCleaningModal(true);
  };

  const handleCleaningSave = async () => {
    try {
      const url = editingCleaningOffering 
        ? `/api/cleaning-offerings/${editingCleaningOffering.id}`
        : '/api/cleaning-offerings';
      
      const method = editingCleaningOffering ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleaningFormData),
      });

      if (response.ok) {
        setShowCleaningModal(false);
        fetchData();
      } else {
        const error = await response.json();
        alert('Error saving cleaning offering: ' + error.error);
      }
    } catch (err) {
      console.error('Error saving cleaning offering:', err);
      alert('Error saving cleaning offering');
    }
  };

  const handleCleaningDelete = async (id) => {
    if (confirm('Are you sure you want to delete this cleaning offering?')) {
      try {
        const response = await fetch(`/api/cleaning-offerings/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchData();
        } else {
          alert('Error deleting cleaning offering');
        }
      } catch (err) {
        console.error('Error deleting cleaning offering:', err);
        alert('Error deleting cleaning offering');
      }
    }
  };

  // Service Offerings handlers
  const handleServiceEdit = (offering) => {
    setEditingServiceOffering(offering);
    setServiceFormData({
      name: offering.name || '',
      description: offering.description || ''
    });
    setShowServiceModal(true);
  };

  const handleServiceAddNew = () => {
    setEditingServiceOffering(null);
    setServiceFormData({
      name: '',
      description: ''
    });
    setShowServiceModal(true);
  };

  const handleServiceSave = async () => {
    try {
      const url = editingServiceOffering 
        ? `/api/service-offerings/${editingServiceOffering.id}`
        : '/api/service-offerings';
      
      const method = editingServiceOffering ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceFormData),
      });

      if (response.ok) {
        setShowServiceModal(false);
        fetchData();
      } else {
        const error = await response.json();
        alert('Error saving service offering: ' + error.error);
      }
    } catch (err) {
      console.error('Error saving service offering:', err);
      alert('Error saving service offering');
    }
  };

  const handleServiceDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service offering?')) {
      try {
        const response = await fetch(`/api/service-offerings/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchData();
        } else {
          alert('Error deleting service offering');
        }
      } catch (err) {
        console.error('Error deleting service offering:', err);
        alert('Error deleting service offering');
      }
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password:</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-2">{passwordError}</p>
              )}
            </div>
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
    <div className="min-h-screen bg-gray-900 text-white p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">KelleAuto Admin Panel</h1>
          <div className="text-gray-400 text-sm">
            Sales Listings: {filteredSalesListings.length} | Bookings: {filteredBookings.length} | 
            Cleaning: {filteredCleaningOfferings.length} | Services: {filteredServiceOfferings.length}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        
        {/* Sales Listings Panel */}
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-96">
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

        {/* Bookings Panel */}
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-96">
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

       {/* Cleaning Offerings Panel */}
       <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-96">
         <div className="mb-4">
           <div className="flex justify-between items-center mb-3">
             <h2 className="text-xl font-semibold">Cleaning Offerings</h2>
             <button
               onClick={handleCleaningAddNew}
               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
             >
               Add New
             </button>
           </div>
           <input
             type="text"
             placeholder="Search cleaning offerings..."
             value={cleaningSearchTerm}
             onChange={(e) => setCleaningSearchTerm(e.target.value)}
             className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
           />
         </div>
         
         <div className="flex-1 overflow-y-auto">
           <div className="space-y-3">
             {filteredCleaningOfferings.map((offering) => (
               <div key={offering.id} className="bg-gray-700 p-3 rounded border border-gray-600">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-medium text-lg">{offering.name}</h3>
                   <div className="flex gap-2">
                     <button
                       onClick={() => handleCleaningEdit(offering)}
                       className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                     >
                       Edit
                     </button>
                     <button
                       onClick={() => handleCleaningDelete(offering.id)}
                       className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                     >
                       Delete
                     </button>
                   </div>
                 </div>
                 <div className="text-sm text-gray-300 space-y-1">
                   <div>Created: {formatDate(offering.created_at)}</div>
                   {offering.description && (
                     <div className="text-gray-400 text-xs mt-2">
                       {offering.description}
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>

       {/* Service Offerings Panel */}
       <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-96">
         <div className="mb-4">
           <div className="flex justify-between items-center mb-3">
             <h2 className="text-xl font-semibold">Service Offerings</h2>
             <button
               onClick={handleServiceAddNew}
               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
             >
               Add New
             </button>
           </div>
           <input
             type="text"
             placeholder="Search service offerings..."
             value={serviceSearchTerm}
             onChange={(e) => setServiceSearchTerm(e.target.value)}
             className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
           />
         </div>
         
         <div className="flex-1 overflow-y-auto">
           <div className="space-y-3">
             {filteredServiceOfferings.map((offering) => (
               <div key={offering.id} className="bg-gray-700 p-3 rounded border border-gray-600">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-medium text-lg">{offering.name}</h3>
                   <div className="flex gap-2">
                     <button
                       onClick={() => handleServiceEdit(offering)}
                       className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                     >
                       Edit
                     </button>
                     <button
                       onClick={() => handleServiceDelete(offering.id)}
                       className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                     >
                       Delete
                     </button>
                   </div>
                 </div>
                 <div className="text-sm text-gray-300 space-y-1">
                   <div>Created: {formatDate(offering.created_at)}</div>
                   {offering.description && (
                     <div className="text-gray-400 text-xs mt-2">
                       {offering.description}
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </div>

     {/* Sales Listings Edit/Add Modal */}
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
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="3"
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
                <input
                  type="text"
                  value={formData.fuel_type}
                  onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              {/* Images Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="space-y-2">
                  {formData.images && formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="url"
                        value={image.image_url}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = { ...newImages[index], image_url: e.target.value };
                          setFormData({...formData, images: newImages});
                        }}
                        placeholder="Image URL"
                        className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          name="mainImage"
                          checked={image.is_main || false}
                          onChange={() => {
                            // When selecting a main image, unmark all others and mark this one
                            const newImages = formData.images.map((img, i) => ({
                              ...img,
                              is_main: i === index
                            }));
                            setFormData({...formData, images: newImages});
                          }}
                          className="mr-1"
                        />
                        Main
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          // If we're removing the main image, make the first remaining image main
                          if (image.is_main && newImages.length > 0) {
                            newImages[0].is_main = true;
                          }
                          setFormData({...formData, images: newImages});
                        }}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...(formData.images || []), { 
                        image_url: '', 
                        is_main: (formData.images || []).length === 0 // First image is main by default
                      }];
                      setFormData({...formData, images: newImages});
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    Add Image
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {editingListing ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

     {/* Cleaning Offerings Modal */}
     {showCleaningModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-gray-800 p-6 rounded-lg w-96">
           <h3 className="text-xl font-semibold mb-4">
             {editingCleaningOffering ? 'Edit Cleaning Offering' : 'Add New Cleaning Offering'}
           </h3>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-1">Name</label>
               <input
                 type="text"
                 value={cleaningFormData.name}
                 onChange={(e) => setCleaningFormData({...cleaningFormData, name: e.target.value})}
                 className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-1">Description</label>
               <textarea
                 value={cleaningFormData.description}
                 onChange={(e) => setCleaningFormData({...cleaningFormData, description: e.target.value})}
                 rows={3}
                 className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
               />
             </div>
           </div>
           
           <div className="flex gap-2 mt-6">
             <button
               onClick={handleCleaningSave}
               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
             >
               Save
             </button>
             <button
               onClick={() => setShowCleaningModal(false)}
               className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
             >
               Cancel
             </button>
           </div>
         </div>
       </div>
     )}

     {/* Service Offerings Modal */}
     {showServiceModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-gray-800 p-6 rounded-lg w-96">
           <h3 className="text-xl font-semibold mb-4">
             {editingServiceOffering ? 'Edit Service Offering' : 'Add New Service Offering'}
           </h3>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-1">Name</label>
               <input
                 type="text"
                 value={serviceFormData.name}
                 onChange={(e) => setServiceFormData({...serviceFormData, name: e.target.value})}
                 className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-1">Description</label>
               <textarea
                 value={serviceFormData.description}
                 onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})}
                 rows={3}
                 className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
               />
             </div>
           </div>
           
           <div className="flex gap-2 mt-6">
             <button
               onClick={handleServiceSave}
               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
             >
               Save
             </button>
             <button
               onClick={() => setShowServiceModal(false)}
               className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
             >
               Cancel
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}
