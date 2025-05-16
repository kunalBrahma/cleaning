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
  FaPumpSoap,
  FaCogs,
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
  FaPumpSoap,
  FaCogs,
};


const whatsappNumber = "918638167421";

const Kitchen = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/api/services-by-category");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Log the entire response

        // Check if we have the "Cleaning Services" category in the response
        if (data && data["Cleaning Services"]) {
          // Filter for subCategory === "Bathroom" services
          const bathroomServices = data["Cleaning Services"].filter(
            (service: any) => service.subCategory === "Kitchen"
          );

          console.log("Kitchen Cleaning:", bathroomServices); // Log filtered services

          if (bathroomServices.length === 0) {
            setError("No Kitchen services found");
          }

          const mappedServices = bathroomServices.map((service: any) => {
            // Parse features, requirements, exclusions if they're strings
            let parsedFeatures = [];
            let parsedRequirements = [];
            let parsedExclusions = [];

            try {
              parsedFeatures =
                typeof service.features === "string"
                  ? JSON.parse(service.features)
                  : service.features || [];
            } catch (e) {
              console.error("Error parsing features:", e);
              parsedFeatures = [];
            }

            try {
              parsedRequirements =
                typeof service.requirements === "string"
                  ? JSON.parse(service.requirements)
                  : service.requirements || [];
            } catch (e) {
              console.error("Error parsing requirements:", e);
              parsedRequirements = [];
            }

            try {
              parsedExclusions =
                typeof service.exclusions === "string"
                  ? JSON.parse(service.exclusions)
                  : service.exclusions || [];
            } catch (e) {
              console.error("Error parsing exclusions:", e);
              parsedExclusions = [];
            }

            return {
              id: service.service_code,
              title: service.name,
              price: Number(service.price),
              image: service.image,
              description: service.description,
              features: parsedFeatures.map((f: any) => ({
                ...f,
                icon:
                  f.icon && iconMap.hasOwnProperty(f.icon)
                    ? React.createElement(
                        iconMap[f.icon as keyof typeof iconMap]
                      )
                    : null,
              })),
              requirements: parsedRequirements.map((r: any) => ({
                ...r,
                icon:
                  r.icon && iconMap.hasOwnProperty(r.icon)
                    ? React.createElement(
                        iconMap[r.icon as keyof typeof iconMap]
                      )
                    : null,
              })),
              exclusions: parsedExclusions.map((e: any) => ({
                ...e,
                icon:
                  e.icon && iconMap.hasOwnProperty(e.icon)
                    ? React.createElement(
                        iconMap[e.icon as keyof typeof iconMap]
                      )
                    : null,
              })),
              popular: !!service.popular,
              whatsappMessage: service.whatsapp_message,
            };
          });

          setServices(mappedServices);
        } else {
          setError(
            "Invalid API response format or missing Cleaning Services category"
          );
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to fetch services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading services...
      </div>
    );

  if (error)
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-red-600">Error</h3>
        <p className="mt-2">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );

  let serviceDetails = {
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
        label: "Service duration: 1-6 hours depending on kitchen size",
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
      title="Expert Kitchen, Chimney & Fridge Cleaning Services"
      subtitle="Thorough degreasing and deep sanitization – from countertops to modular cabinets"
      serviceDetails={serviceDetails}
    />
  );
};

export default Kitchen;
