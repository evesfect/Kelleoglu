'use client';
import { useState } from "react";

export default function BookAppointmentButton() {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <button 
      onClick={handleClick}
      className={`px-4 py-0.5 bg-orange-400 text-white rounded-xl hover:bg-orange-500 hover:scale-105 transition-all duration-200 ${
        isClicked ? 'ring-2 ring-orange-300 ring-opacity-50' : ''
      }`}
    >
      Book an Appointment
    </button>
  );
}