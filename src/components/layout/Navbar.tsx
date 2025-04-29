import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLDivElement | null)[]>([]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.fromTo(menuRef.current,
          { height: 0, opacity: 0 },
          {
            height: 'auto',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          }
        );

        gsap.fromTo(navItemsRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.1,
            delay: 0.2,
            ease: 'back.out(1.7)'
          }
        );
      } else {
        gsap.to(menuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        });
      }
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsServicesOpen(false);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleServices = () => {
    if (!isMenuOpen) return;

    const servicesDropdown = navItemsRef.current[2]?.querySelector('.mobile-dropdown');
    if (servicesDropdown) {
      if (isServicesOpen) {
        gsap.to(servicesDropdown, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power1.in'
        });
      } else {
        gsap.fromTo(servicesDropdown,
          { height: 0, opacity: 0 },
          {
            height: 'auto',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          }
        );
      }
    }
    setIsServicesOpen(!isServicesOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    {
      label: 'Services',
      path: '/services',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Cleaning Services', path: '/cleaning' },
        { label: 'Painting Services', path: '/painting' },
        { label: 'Pest Control', path: '/pest-control' },
        { label: 'Home Repair', path: '/repairs' },
        { label: 'Packers and Movers', path: '/moving' },
      ]
    },
    { label: 'Book Now', path: '/booking' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all bg-white duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-4'}`}>
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-700 flex items-center">
            <img src="/logo.png" alt="logo" className="w-[150px] h-[100px] mr-2" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.hasDropdown ? (
                  <button
                    onClick={toggleServices}
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-700 rounded-md transition-colors"
                  >
                    {item.label}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className="px-4 py-2 text-gray-700 hover:text-blue-700 rounded-md transition-colors"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown for Services */}
                {item.hasDropdown && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md z-100 shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="py-1">
                      {item.dropdownItems?.map((dropdownItem, idx) => (
                        <Link
                          key={idx}
                          to={dropdownItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call Now Button */}
          <div className="hidden md:block">
          <a href="tel:+918761055295">
            <Button variant="primary" size="md" className="flex items-center">
              <Phone size={16} className="mr-2" />
              Call Now
            </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className="transform transition-transform duration-300" />
            ) : (
              <Menu size={24} className="transform transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          ref={menuRef}
          className="lg:hidden bg-white overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="mt-4 pb-4 space-y-2">
            {navItems.map((item, index) => (
              <div
                key={index}
                ref={el => navItemsRef.current[index] = el}
                className="relative"
              >
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={toggleServices}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`ml-1 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <div
                      className="mobile-dropdown pl-4 overflow-hidden"
                      style={{ height: isServicesOpen ? 'auto' : 0 }}
                    >
                      <div className="space-y-1">
                        {item.dropdownItems?.map((dropdownItem, idx) => (
                          <Link
                            key={idx}
                            to={dropdownItem.path}
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                            onClick={closeMenu}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="block px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="mt-3 px-4">
              <a href="tel:+918761055295">
              <Button
                variant="primary"
                size="md"
                className="flex items-center w-full justify-center"
                onClick={closeMenu}
              >
                <Phone size={16} className="mr-2" />
                Call Now
              </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
