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
  React.useEffect(() => {
    document.title = "City Home Service - Professional Home Services";
  }, []);

  return (
    <Router>
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
          <Route path="/painting" element={<PaintingServicePage />} />
          <Route path="/pest-control" element={<PestControlPage />} />
          <Route path="/repairs" element={<HomeRepair />} />
          <Route path="/moving" element={<PackersMoversPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsAncConditionsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
