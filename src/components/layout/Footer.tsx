import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">City Home Service</h3>
            <p className="text-gray-300 mb-4">Your trusted partner for all home services. Professional, reliable, and affordable solutions for your home needs.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/booking" className="text-gray-300 hover:text-white transition-colors">Book a Service</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link to="/cleaning" className="text-gray-300 hover:text-white transition-colors">Cleaning Services</Link></li>
              <li><Link to="/painting" className="text-gray-300 hover:text-white transition-colors">Painting Services</Link></li>
              <li><Link to="/pest-control" className="text-gray-300 hover:text-white transition-colors">Pest Control</Link></li>
              <li><Link to="/repairs" className="text-gray-300 hover:text-white transition-colors">Home Repairs</Link></li>
              <li><Link to="/moving" className="text-gray-300 hover:text-white transition-colors">Packers and Movers</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">Dakhingaon Khanka Mini Tajmahal Road Insaf Nagar Path, Guwhatai, Assam </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">+91 81330 39362 </span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">info@cityhomeservice.com</span>
              </li>
              <li className="flex items-start">
                <Clock size={20} className="mr-2 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">Mon-Sat: 8:00 AM - 7:00 PM<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {year} City Home Service. All rights reserved. | Design by <a href='https://sitemakerlab.com/' target='_blank'> Sitemaker Lab</a> </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
                
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;