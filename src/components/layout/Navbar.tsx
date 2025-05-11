import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, LogIn, ShoppingCart, User } from "lucide-react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AuthDialog } from "../ui/AuthDailog";
import { useAuth } from "@/contexts/AuthContext";
import CartModal from "../ui/CartModal";
import { useCart } from "@/contexts/CartContext";



const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const { cartItems, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const cartModalRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.fromTo(
          menuRef.current,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          navItemsRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.1,
            delay: 0.2,
            ease: "back.out(1.7)",
          }
        );
      } else {
        gsap.to(menuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (cartModalRef.current) {
      if (showCartModal) {
        gsap.fromTo(
          cartModalRef.current,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          }
        );

        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      } else {
        gsap.to(cartModalRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [showCartModal, isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsServicesOpen(false);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleServices = () => {
    if (!isMenuOpen) return;

    const servicesDropdown =
      navItemsRef.current[2]?.querySelector(".mobile-dropdown");
    if (servicesDropdown) {
      if (isServicesOpen) {
        gsap.to(servicesDropdown, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power1.in",
        });
      } else {
        gsap.fromTo(
          servicesDropdown,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
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

  const toggleCartModal = () => {
    setShowCartModal(!showCartModal);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    {
      label: "Services",
      path: "/services",
      hasDropdown: true,
      dropdownItems: [
        { label: "Cleaning Services", path: "/cleaning" },
        { label: "Painting Services", path: "/painting" },
        { label: "Pest Control", path: "/pest-control" },
        { label: "Home Repair", path: "/repairs" },
        { label: "Packers and Movers", path: "/moving" },
      ],
    },
    { label: "Book Now", path: "/booking" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all bg-white duration-300 ${
        isScrolled ? "bg-white shadow-md py-4" : "bg-transparent py-4"
      }`}
    >
      <Container>
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-700 flex items-center"
          >
            <img
              src="/logo.png"
              alt="logo"
              className="w-[150px] h-[100px] mr-2"
            />
          </Link>

          <div className="flex items-center space-x-1">
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

          <div className="flex items-center gap-4">
            <button
              onClick={toggleCartModal}
              className="text-gray-700 hover:text-blue-700 relative"
            >
              <ShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium hover:text-primary hidden md:block"
                >
                  My Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <span
                onClick={() => setShowAuthModal(true)}
                className="rounded-full cursor-pointer"
              >
                <User />
              </span>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex items-center justify-between lg:hidden">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X
                size={24}
                className="transform transition-transform duration-300"
              />
            ) : (
              <Menu
                size={24}
                className="transform transition-transform duration-300"
              />
            )}
          </button>

          <Link
            to="/"
            className="text-2xl font-bold text-blue-700 flex items-center justify-center"
          >
            <img src="/logo.png" alt="logo" className="w-[120px] h-[80px]" />
          </Link>

          <button onClick={toggleCartModal} className="text-gray-700 relative">
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        <div
          ref={menuRef}
          className="lg:hidden bg-white overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="mt-4 pb-4 space-y-2">
            {navItems.map((item, index) => (
              <div
                key={index}
                ref={(el) => (navItemsRef.current[index] = el)}
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
                        className={`ml-1 transition-transform duration-200 ${
                          isServicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className="mobile-dropdown pl-4 overflow-hidden"
                      style={{ height: isServicesOpen ? "auto" : 0 }}
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
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    My Dashboard
                  </Link>
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatar.png" alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setShowAuthModal(true);
                    closeMenu();
                  }}
                  className="w-full gap-2 justify-center"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
      <AuthDialog open={showAuthModal} onOpenChange={setShowAuthModal} />

      {showCartModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeCartModal}
          />
          <CartModal
            isOpen={showCartModal}
            onClose={closeCartModal}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            calculateTotal={calculateTotal}
          />
        </>
      )}
    </nav>
  );
};

export default Navbar;