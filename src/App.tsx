import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import ServicesSection from "./components/sections/ServicesSection";
import HowItWorksSection from "./components/sections/HowItWorksSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import BookingSection from "./components/sections/BookingSection";
import FAQSection from "./components/sections/FAQSection";
import CTASection from "./components/sections/CTASection";
import ContactSection from "./components/sections/ContactSection";
import AboutPage from "./pages/AboutPage";
import CleaningPage from "./pages/CleaningPage";
import BathroomCleaningPage from "./pages/BathroomCleaningPage";
import NotFoundPage from "./pages/NotFoundPage";
import KitchenCleaningPage from "./pages/KitchenCleaningPage";
import PaintingServicePage from "./pages/PaintingServicePage";
import PestControlPage from "./pages/PestControlPage";
import HomeRepair from "./pages/HomeRepair";
import PackersMoversPage from "./pages/PackersMoversPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsAncConditionsPage from "./pages/TermsAncConditionsPage";
import SofaCleaninngPage from "./pages/SofaCleaninngPage";
import FullHomeCleaningPage from "./pages/FullHomeCleaningPage";
import EmptyHomeCleaningPage from "./pages/EmptyHomeCleaningPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankyouPage from "./pages/ThankyouPage";
import { CartProvider } from "./contexts/CartContext"; 
import { AuthProvider } from "./contexts/AuthContext"; 
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 


function HomePage() {
  // This component renders all your home sections
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <BookingSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
    </>
  );
}

function App() {
  // Dynamic page title based on route (optional enhancement)
  React.useEffect(() => {
    const updateTitle = () => {
      const path = window.location.pathname;
      let title = "City Home Service - Professional Home Services";
      if (path === "/about") title = "About Us - City Home Service";
      else if (path === "/cart") title = "Your Cart - City Home Service";
      else if (path === "/checkout") title = "Checkout - City Home Service";
      else if (path === "/dashboard") title = "Dashboard - City Home Service";
      else if (path === "/thank-you") title = "Thank You - City Home Service";
      else if (path.startsWith("/cleaning")) title = "Cleaning Services - City Home Service";
      else if (path === "/painting") title = "Painting Services - City Home Service";
      else if (path === "/pest-control") title = "Pest Control - City Home Service";
      else if (path === "/repairs") title = "Home Repairs - City Home Service";
      else if (path === "/moving") title = "Packers & Movers - City Home Service";
      else if (path === "/booking") title = "Book a Service - City Home Service";
      else if (path === "/contact") title = "Contact Us - City Home Service";
      else if (path === "/privacy") title = "Privacy Policy - City Home Service";
      else if (path === "/terms") title = "Terms and Conditions - City Home Service";
      document.title = title;
    };

    updateTitle();
    window.addEventListener("popstate", updateTitle);
    return () => window.removeEventListener("popstate", updateTitle);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cleaning" element={<CleaningPage />} />
              <Route
                path="/cleaning/bathroom-cleaning"
                element={<BathroomCleaningPage />}
              />
              <Route
                path="/cleaning/kitchen-chimney"
                element={<KitchenCleaningPage />}
              />
              <Route
                path="/cleaning/sofa-cleaning"
                element={<SofaCleaninngPage />}
              />
              <Route
                path="/cleaning/full-home"
                element={<FullHomeCleaningPage />}
              />
              <Route
                path="/cleaning/empty-home"
                element={<EmptyHomeCleaningPage />}
              />
              <Route path="/painting" element={<PaintingServicePage />} />
              <Route path="/pest-control" element={<PestControlPage />} />
              <Route path="/repairs" element={<HomeRepair />} />
              <Route path="/moving" element={<PackersMoversPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsAncConditionsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/thank-you" element={<ThankyouPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <ToastContainer /> {/* Add ToastContainer */}
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;