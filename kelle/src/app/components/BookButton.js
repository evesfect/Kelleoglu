'use client';
import { useState, useEffect } from "react";

export default function BookAppointmentButton({ 
  type = "general", 
  details = "",
  buttonText = "Book an Appointment" 
}) {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [checkingSlots, setCheckingSlots] = useState(false);

  // Generate time slots (9 AM to 5 PM, every hour)
  const timeSlots = [
    { value: '09:00', hour: 9, label: '9:00 AM' },
    { value: '10:00', hour: 10, label: '10:00 AM' },
    { value: '11:00', hour: 11, label: '11:00 AM' },
    { value: '12:00', hour: 12, label: '12:00 PM' },
    { value: '13:00', hour: 13, label: '1:00 PM' },
    { value: '14:00', hour: 14, label: '2:00 PM' },
    { value: '15:00', hour: 15, label: '3:00 PM' },
    { value: '16:00', hour: 16, label: '4:00 PM' },
    { value: '17:00', hour: 17, label: '5:00 PM' }
  ];

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Check occupied time slots when date changes
  useEffect(() => {
    const checkOccupiedSlots = async () => {
      if (!selectedDate) {
        setOccupiedSlots([]);
        return;
      }

      setCheckingSlots(true);
      try {
        const response = await fetch(`/api/bookings/check?date=${selectedDate}`);
        if (response.ok) {
          const data = await response.json();
          setOccupiedSlots(data.occupiedHours || []);
        } else {
          console.error('Failed to check occupied slots');
          setOccupiedSlots([]);
        }
      } catch (error) {
        console.error('Error checking occupied slots:', error);
        setOccupiedSlots([]);
      } finally {
        setCheckingSlots(false);
      }
    };

    checkOccupiedSlots();
  }, [selectedDate]);

  // Reset selected time when date changes or when time becomes occupied
  useEffect(() => {
    if (selectedTime && selectedDate) {
      const selectedHour = timeSlots.find(slot => slot.value === selectedTime)?.hour;
      if (selectedHour && occupiedSlots.includes(selectedHour)) {
        setSelectedTime('');
      }
    }
  }, [occupiedSlots, selectedTime, selectedDate]);

  const handleClick = () => {
    setIsClicked(true);
    setShowTimeModal(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create local datetime string without timezone conversion
      const appointmentTimeString = `${selectedDate} ${selectedTime}:00`;
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          details: details,
          appointment_time: appointmentTimeString // Send as string, not ISO
        }),
      });

      if (response.ok) {
        alert('Booking created successfully!');
        setShowTimeModal(false);
        setSelectedDate('');
        setSelectedTime('');
        setOccupiedSlots([]);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowTimeModal(false);
    setSelectedDate('');
    setSelectedTime('');
    setOccupiedSlots([]);
  };

  const isSlotOccupied = (hour) => {
    return occupiedSlots.includes(hour);
  };

  const handleTimeSlotClick = (timeSlot) => {
    if (!isSlotOccupied(timeSlot.hour)) {
      setSelectedTime(timeSlot.value);
    }
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className={`px-4 py-0.5 bg-orange-400 text-white rounded-xl hover:bg-orange-500 hover:scale-105 transition-all duration-200 ${
          isClicked ? 'ring-2 ring-orange-300 ring-opacity-50' : ''
        }`}
      >
        {buttonText}
      </button>

      {/* Time Selection Modal */}
      {showTimeModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: 'blur(4px)'
          }}
        >
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Appointment Time</h3>
            
            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time:
                {checkingSlots && <span className="text-gray-500 text-xs ml-2">(Checking availability...)</span>}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((timeSlot) => {
                  const isOccupied = isSlotOccupied(timeSlot.hour);
                  const isSelected = selectedTime === timeSlot.value;
                  
                  return (
                    <button
                      key={timeSlot.value}
                      onClick={() => handleTimeSlotClick(timeSlot)}
                      disabled={isOccupied || checkingSlots}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        isOccupied
                          ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-orange-400 text-white border-orange-400'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
                      }`}
                      title={isOccupied ? 'This time slot is already booked' : ''}
                    >
                      {timeSlot.label}
                      {isOccupied && <div className="text-xs">Booked</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={isLoading || !selectedDate || !selectedTime || checkingSlots}
                className={`px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors ${
                  (isLoading || !selectedDate || !selectedTime || checkingSlots) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}