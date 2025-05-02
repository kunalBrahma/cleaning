
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

const Repair: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Consultation & Assessment",
      description:
        "Friendly consultation and property inspection to assess issues, discuss solutions, and provide a transparent estimate.",
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
            d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Expert Repairs & Quality Workmanship",
      description:
        "Experienced technicians handle repairs safely and professionally using high-quality materials and trusted tools.",
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
            d="M3 10h11M9 21V3m8 18h4M17 3h4"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Final Check & Satisfaction Guarantee",
      description:
        "After completion, we conduct a final walkthrough with you, tidy up, and back our work with a satisfaction guarantee.",
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

  const [repairServices, setRepairServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
  

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services");
        const services: Service[] = response.data;
        // Filter for Cleaning category and Active status
        const filteredServices = services.filter(
          (service) =>
            service.category === "Home Repair Services" && service.status === "Active"
        );
        setRepairServices(filteredServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [])

  useEffect(() => {
    if (!loading && repairServices.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".repair-section-block", {
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

      return () => ctx.revert();
    }
  }, [loading, repairServices]);

  if (loading)
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading services...</p>
      </div>
    );

  return (
    <section id="repair" className="py-24 bg-white">
      <Container>
        <div className="relative z-10" ref={sectionRef}>
          <div className="max-w-3xl mx-auto text-center mb-14 repair-section-block">
            <SectionHeading
              title="Reliable Home Repair Services You Can Trust"
              subtitle="From minor fixes to major renovations — we restore comfort, safety, and value to your home."
              center
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 repair-section-block">
            {repairServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} textColor="text-gray-800" />
            ))}
          </div>

          <ProcessSteps
            title="Our Home Repair Process"
            subtitle="A seamless, professional workflow from start to finish"
            steps={steps}
          />
        </div>
      </Container>
    </section>
  );
};

export default Repair;
