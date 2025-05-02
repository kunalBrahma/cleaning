/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ServiceComponent from "../common/ServiceComponent";
import {
  FaCheck,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaCouch,
  FaSprayCan,
  FaRecycle,
  FaPumpSoap,
  FaHandsWash,
} from "react-icons/fa";
import { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  FaCheck,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaCouch,
  FaSprayCan,
  FaRecycle,
  FaPumpSoap,
  FaHandsWash,
};

const whatsappNumber = "918638167421";

const serviceDetails = {
  includes: [
    {
      icon: <FaCheck className="text-green-500 mt-1" size={16} />,
      label: "Professional cleaning of all surfaces",
    },
    {
      icon: <FaCheck className="text-green-500 mt-1" size={16} />,
      label: "Eco-friendly cleaning products",
    },
    {
      icon: <FaCheck className="text-green-500 mt-1" size={16} />,
      label: "Complete sanitization",
    },
  ],
  notes: [
    {
      icon: <FaClock className="text-yellow-500 mt-1" size={16} />,
      label: "Service duration: 2-3 hours depending on number of seats",
    },
    {
      icon: <FaTools className="text-yellow-500 mt-1" size={16} />,
      label: "Our team brings all necessary equipment",
    },
    {
      icon: <FaCheckCircle className="text-yellow-500 mt-1" size={16} />,
      label: "Click 'Book Now' to schedule your cleaning",
    },
  ],
};

const Sofa = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/services-by-category")
      .then((res) => res.json())
      .then((data) => {
        // Get all services under "Cleaning Services" with subCategory "Sofa Cleaning"
        const allCleaning = data["Cleaning Services"] || [];
        const sofaServices = allCleaning.filter(
          (service: any) => service.subCategory === "Sofa Cleaning"
        );

        const mappedServices = sofaServices.map((service: any) => ({
          id: service.service_code,
          title: service.name,
          price: Number(service.price),
          image: service.image,
          features: Array.isArray(service.features)
            ? service.features.map((f: any) => ({
                ...f,
                icon:
                  f.icon && iconMap.hasOwnProperty(f.icon)
                    ? React.createElement(iconMap[f.icon as keyof typeof iconMap])
                    : null,
              }))
            : [],
          requirements: Array.isArray(service.requirements)
            ? service.requirements.map((r: any) => ({
                ...r,
                icon:
                  r.icon && iconMap.hasOwnProperty(r.icon)
                    ? React.createElement(iconMap[r.icon as keyof typeof iconMap])
                    : null,
              }))
            : [],
          exclusions: Array.isArray(service.exclusions)
            ? service.exclusions.map((e: any) => ({
                ...e,
                icon:
                  e.icon && iconMap.hasOwnProperty(e.icon)
                    ? React.createElement(iconMap[e.icon as keyof typeof iconMap])
                    : null,
              }))
            : [],
          popular: !!service.popular,
          whatsappMessage: service.whatsapp_message,
        }));

        setServices(mappedServices);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setServices([]);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ServiceComponent
      services={services}
      whatsappNumber={whatsappNumber}
      id="sofa-cleaning"
      backgroundImage="/banner.webp"
      title="Professional Sofa Cleaning Services"
      subtitle="Revitalize your furniture with our deep cleaning treatments - book your expert cleaning today"
      serviceDetails={serviceDetails}
    />
  );
};

export default Sofa;
