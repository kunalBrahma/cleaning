
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

const Movers: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Quick Survey & Customized Quote",
      description:
        "We assess your belongings and shifting requirements via an online or in-person survey, offering a transparent, tailored quote.",
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
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12A9 9 0 113 12a9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Secure Packing & Hassle-Free Loading",
      description:
        "Our trained crew carefully packs and labels every item using premium materials and securely loads them into transport vehicles.",
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
      title: "Safe Transport & On-Time Delivery",
      description:
        "We safely transport your belongings, track the move, and ensure timely delivery with careful unloading and final placement.",
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

  
    const [moversServices, setMoversServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
  

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("api/api/services");
        const services: Service[] = response.data;
       
        const filteredServices = services.filter(
          (service) =>
            service.category === "Packers and Movers" &&
            service.status === "Active"
        );
        setMoversServices(filteredServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
 

  useEffect(() => {
    if (!loading && moversServices.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".movers-section-block", {
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
  }, [loading, moversServices]);

  if (loading)
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading services...</p>
      </div>
    );

  return (
    <section id="movers" className="py-24 bg-white">
      <Container>
        <div className="relative z-10" ref={sectionRef}>
          <div className="max-w-3xl mx-auto text-center mb-14 movers-section-block">
            <SectionHeading
              title="Stress-Free Packers & Movers Services"
              subtitle="Moving made easy — from careful packing to safe delivery, we handle it all so you don’t have to."
              center
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 movers-section-block">
            {moversServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} textColor="text-gray-800" />
            ))}
          </div>

          <ProcessSteps
            title="Our Smooth 3-Step Moving Process"
            subtitle="Making your move simple, secure, and stress-free."
            steps={steps}
          />
        </div>
      </Container>
    </section>
  );
};

export default Movers;
