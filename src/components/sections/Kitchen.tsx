/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ServiceComponent from "../common/ServiceComponent";
import {
  FaCheck,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaBroom,
  FaWater,
  FaTintSlash,
  FaWind,
  FaSprayCan,
  FaUtensils,
  FaFire,
  FaBox,
  FaCrown,
  FaEraser,
  FaShieldAlt,
} from "react-icons/fa";
import { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  FaCheck,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaBroom,
  FaWater,
  FaTintSlash,
  FaWind,
  FaSprayCan,
  FaUtensils,
  FaFire,
  FaBox,
  FaCrown,
  FaEraser,
  FaShieldAlt,
};

const whatsappNumber = "918638167421";

const Kitchen = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/services-by-category")
      .then((res) => res.json())
      .then((data) => {
        // Get all services from all categories
        const allServices = Object.values(data).flat();

        // Filter for subCategory === "Kitchen"
        const kitchenServices = allServices.filter(
          (service: any) => service.subCategory === "Kitchen"
        );

        const mappedServices = kitchenServices.map((service: any) => ({
          id: service.service_code,
          title: service.name,
          price: Number(service.price),
          image: service.image,
          features: (service.features || []).map((f: any) => ({
            ...f,
            icon:
              f.icon && iconMap.hasOwnProperty(f.icon)
                ? React.createElement(iconMap[f.icon as keyof typeof iconMap])
                : null,
          })),
          requirements: (service.requirements || []).map((r: any) => ({
            ...r,
            icon:
              r.icon && iconMap.hasOwnProperty(r.icon)
                ? React.createElement(iconMap[r.icon as keyof typeof iconMap])
                : null,
          })),
          exclusions: (service.exclusions || []).map((e: any) => ({
            ...e,
            icon:
              e.icon && iconMap.hasOwnProperty(e.icon)
                ? React.createElement(iconMap[e.icon as keyof typeof iconMap])
                : null,
          })),
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

  const serviceDetails = {
    includes: [
      {
        icon: <FaCheck className="text-green-500 mt-1" size={16} />,
        label: "Professional degreasing of all surfaces",
      },
      {
        icon: <FaCheck className="text-green-500 mt-1" size={16} />,
        label: "Eco-friendly cleaning products",
      },
      {
        icon: <FaCheck className="text-green-500 mt-1" size={16} />,
        label: "Stainless steel polishing",
      },
    ],
    notes: [
      {
        icon: <FaClock className="text-yellow-500 mt-1" size={16} />,
        label: "Service duration: 3-5 hours depending on kitchen size",
      },
      {
        icon: <FaTools className="text-yellow-500 mt-1" size={16} />,
        label: "Our team brings all necessary equipment and supplies",
      },
      {
        icon: <FaCheckCircle className="text-yellow-500 mt-1" size={16} />,
        label: "Click 'Book Now' to schedule your cleaning",
      },
    ],
  };

  return (
    <ServiceComponent
      services={services}
      whatsappNumber={whatsappNumber}
      id="kitchen-cleaning"
      backgroundImage="/banner.webp"
      title="Professional Kitchen & Chimney Cleaning"
      subtitle="Complete degreasing and sanitization for your kitchen - from slabs to modular units"
      serviceDetails={serviceDetails}
    />
  );
};

export default Kitchen;