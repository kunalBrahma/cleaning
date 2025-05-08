import React, { useEffect, useState, useRef } from "react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import ServiceCard from "../common/ServiceCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProcessSteps from "../common/ProcessSteps";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: number;
  category: string;
  subCategory: string;
  icon: string;
  path: string;
  status: string;
  createdAt: string;
}
const Painting: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Surface Preparation",
      description:
        "We meticulously clean, repair, and prime all surfaces for optimal paint adhesion.",
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Precision Painting",
      description:
        "Expert application using premium paints and professional techniques.",
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
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Quality Assurance",
      description:
        "Rigorous inspection to ensure perfection before we consider the job complete.",
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const [paintingServices, setPaintingServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Refs for GSAP scoping
  const sectionRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services");
        const services: Service[] = response.data;
        // Filter for Cleaning category and Active status
        const filteredServices = services.filter(
          (service) =>
            service.category === "Painting Services" &&
            service.status === "Active"
        );
        setPaintingServices(filteredServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!loading && paintingServices.length > 0) {
      // Service cards animation
      const ctx = gsap.context(() => {
        gsap.from(".painting-section-block", {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        });
      }, sectionRef);

      // Process steps animation
      const ctx2 = gsap.context(() => {
        gsap.from(".painting-process-step", {
          scrollTrigger: {
            trigger: processRef.current,
            start: "top 85%",
          },
          opacity: 0,
          y: 40,
          duration: 0.7,
          stagger: 0.2,
          ease: "back.out(1.2)",
        });
      }, processRef);

      return () => {
        ctx.revert();
        ctx2.revert();
      };
    }
  }, [loading, paintingServices]);

  if (loading)
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading services...</p>
      </div>
    );

  return (
    <section id="painting" className="py-24 bg-white">
      <Container>
        <div className="relative z-10" ref={sectionRef}>
          <div className="max-w-3xl mx-auto text-center mb-14 painting-section-block">
            <SectionHeading
              title="Professional Painting Services"
              subtitle="Transform your spaces with our expert painting solutions – quality finishes guaranteed"
              center
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 painting-section-block">
            {paintingServices.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                textColor="text-gray-800"
              />
            ))}
          </div>
          

          {/* Painting Process */}
          <ProcessSteps
            title="Our Painting Process"
            subtitle="A systematic approach to deliver flawless results every time"
            steps={steps}
          />
        </div>
      </Container>
    </section>
  );
};

export default Painting;
