"use client";
import React, { useState } from "react";
import { FaWhatsapp, FaPhone, FaTimes } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";

const WhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-14 md:bottom-8 right-6 flex flex-col items-end gap-3 z-50">
      <div className="relative">
        <div
          className={`flex flex-col gap-4 transition-all duration-500 ease-in-out origin-bottom ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <a
            href="tel:+918133039362"
            className="bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 transition-all duration-300 flex items-center justify-center transform hover:scale-110"
          >
            <FaPhone size={32} />
          </a>
          <a
            href="https://wa.me/918133039362?text=Hi,%20can%20I%20get%20more%20info%20about%20your%20service"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center transform hover:scale-110"
          >
            <FaWhatsapp size={32} />
          </a>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-rose-600 text-white p-4 mt-4 rounded-full shadow-lg hover:bg-rose-900 transition-all duration-500 flex items-center justify-center transform hover:scale-110 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          {isOpen ? <FaTimes size={32} /> : <FiMessageSquare size={32} />}
        </button>
      </div>
    </div>
  );
};

export default WhatsApp;