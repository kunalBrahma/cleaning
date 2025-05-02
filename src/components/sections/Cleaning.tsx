/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import ServiceCard from '../common/ServiceCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProcessSteps from '../common/ProcessSteps';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

// Define Service interface based on the main table structure
interface Service {
  id: number;
  category: string;
  subCategory: string;
  icon: string;
  path: string;
  status: string;
  createdAt: string;
}

const Cleaning: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Initial Assessment',
      description:
        'We inspect your space to identify areas requiring special attention and determine the ideal cleaning strategy.',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2a4 4 0 014-4h7"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h18M3 12h18M3 17h18"
          />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Deep Cleaning Execution',
      description:
        'Our professional team uses eco-friendly products and advanced tools to clean every nook and corner with care.',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h18M9 3v18M15 3v18"
          />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Final Inspection',
      description:
        'We conduct a thorough walkthrough to ensure every area meets our high-quality standards before handing it back to you.',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
  ];

  const [cleaningServices, setCleaningServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services and filter for Cleaning category
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        const services: Service[] = response.data;
        // Filter for Cleaning category and Active status
        const filteredServices = services.filter(
          (service) =>
            service.category === 'Cleaning Services' && service.status === 'Active'
        );
        setCleaningServices(filteredServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // GSAP animations
  useEffect(() => {
    // Animate section elements
    gsap.from('.section-block', {
      scrollTrigger: {
        trigger: '#cleaning',
        start: 'top center',
      },
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.2,
    });

    // Animate process steps
    gsap.from('.process-step', {
      scrollTrigger: {
        trigger: '.process-steps',
        start: 'top center',
      },
      opacity: 0,
      x: -50,
      duration: 0.8,
      stagger: 0.3,
      ease: 'back.out(1.4)',
    });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading services...</p>
      </div>
    );
  }

  return (
    <section
      id="cleaning"
      className="py-20 bg-gradient-to-b from-white to-blue-50"
    >
      <Container>
        <div className="max-w-4xl mx-auto text-center mb-16 section-block">
          <SectionHeading
            title="Effortless Cleaning Solutions"
            subtitle="Book trusted cleaners in minutes and enjoy a spotless space."
            center
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {cleaningServices.slice(0, 6).map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              textColor="text-gray-800"
            />
          ))}
        </div>

        <ProcessSteps
          title="Our Cleaning Service Process"
          subtitle="A structured, professional workflow to leave your space spotless and fresh"
          steps={steps}
        />
      </Container>
    </section>
  );
};

export default Cleaning;