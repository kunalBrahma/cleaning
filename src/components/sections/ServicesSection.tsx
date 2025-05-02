// src/components/ServicesSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import Container from '../ui/Container';
import ServiceCard from '../common/ServiceCard';


gsap.registerPlugin(ScrollTrigger);

// Define Service interface
interface Service {
  id: number;
  category: string;
  subCategory: string;
  icon: string;
  path: string;
  status: string;
  createdAt: string;
}

const ServicesSection: React.FC = () => {
  const [servicesByCategory, setServicesByCategory] = useState<{
    [key: string]: Service[];
  }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch services from API
  const fetchServices = async (): Promise<Service[]> => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  };

  // Fetch services and group by category using useEffect
  useEffect(() => {
    const loadServices = async () => {
      const services = await fetchServices();
      // Filter services with status 'Active'
      const activeServices = services.filter(
        (service) => service.status === 'Active'
      );

      // Group services by category
      const grouped = activeServices.reduce((acc, service) => {
        if (!acc[service.category]) {
          acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
      }, {} as { [key: string]: Service[] });

      setServicesByCategory(grouped);
      const categoryList = Object.keys(grouped);
      setCategories(categoryList);
      setActiveCategory(categoryList[0] || '');
    };

    loadServices();
  }, []);

  // GSAP animation using useEffect
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      className="relative pt-20 bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1627905646269-7f034dcc5738?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
      ref={sectionRef}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-sky-900 to-gray-500 opacity-50"></div>

      <div className="relative z-10">
        <Container>
          <h2 className="text-3xl text-center md:text-4xl font-bold text-white mb-3">
            Our Services
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto text-center">
            Discover a wide range of reliable, professional services tailored to
            make your life easier — all in one place.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-10 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow ${
                  activeCategory === category
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-rose-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 pb-10">
            {servicesByCategory[activeCategory]?.slice(0, 6).map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                textColor="text-white"
              />
            ))}
          </div>

         
        </Container>
      </div>
    </section>
  );
};

export default ServicesSection;