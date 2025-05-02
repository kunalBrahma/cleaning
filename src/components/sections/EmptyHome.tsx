/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import HomeServiceComponent from "../common/HomeServiceComponent";
import {
  FaClock,
  FaTools,
  FaCheckCircle,
  FaThLarge,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";
import { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  FaClock,
  FaTools,
  FaCheckCircle,
  FaThLarge,
  FaShieldAlt,
  FaCheck,
};

const whatsappNumber = "918638167421";

const EmptyHome = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/services-by-category")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data); // Debug: Log raw API response

        // Get all services from all categories
        const allServices = Object.values(data).flat() as any[];

        // Filter for subCategory === "Empty Home"
        const emptyHomeServices = allServices.filter(
          (service) => service.subCategory === "Empty Home"
        );

        console.log("Filtered Empty Home Services:", emptyHomeServices); // Debug: Log filtered services

        if (emptyHomeServices.length === 0) {
          setError("No Empty Home services found");
          setLoading(false);
          return;
        }

        const mappedServices = emptyHomeServices.map((service) => ({
          id: service.service_code,
          title: service.name,
          price: service.price, // e.g., "From ₹1999"
          image: service.image,
          features: (service.features || []).map((f: any) => ({
            ...f,
            icon:
              f.icon && iconMap.hasOwnProperty(f.icon)
                ? React.createElement(iconMap[f.icon as keyof typeof iconMap])
                : null,
          })),
          pricing: (service.pricetable || []).map((p: any) => ({
            bhk: p.bhk,
            price: p.price, // e.g., "₹1999"
            time: p.time,
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

        console.log("Mapped Services:", mappedServices); // Debug: Log mapped services

        setServices(mappedServices);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setError(`Failed to load services: ${err.message}`);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const serviceDetails = {
    includes: [
      {
        icon: <FaCheck className="text-green-500 mt-1" size={16} />,
        label: "Thorough cleaning of empty properties",
      },
      {
        icon: <FaCheck className="text-green-500 mt-1" size={16} />,
        label: "Special attention to corners and hard-to-reach areas",
      },
      {
        icon: <FaCheck className="text-green-500 mt-1" size={16} />,
        label: "Sanitization of all surfaces",
      },
    ],
    notes: [
      {
        icon: <FaClock className="text-yellow-500 mt-1" size={16} />,
        label: "Service duration: 2-11 hours depending on property size",
      },
      {
        icon: <FaTools className="text-yellow-500 mt-1" size={16} />,
        label: "Ideal for post-construction or pre-move-in cleaning",
      },
      {
        icon: <FaCheckCircle className="text-yellow-500 mt-1" size={16} />,
        label: "Click 'Book Now' to schedule your service",
      },
    ],
  };

  // Generate pricing table for display
  const pricingTable = services.reduce((acc: any[], service: any) => {
    service.pricing.forEach((p: any, index: number) => {
      if (!acc[index]) {
        acc[index] = { bhk: p.bhk, time: p.time };
      }
      const serviceKey = service.title.toLowerCase().replace(/\s/g, "");
      acc[index][serviceKey] = p.price.replace("₹", "");
    });
    return acc;
  }, []);

  console.log("Pricing Table:", pricingTable); // Debug: Log pricing table

  return (
    <HomeServiceComponent
      services={services}
      whatsappNumber={whatsappNumber}
      id="empty-home-cleaning"
      backgroundImage="/banner.webp"
      title="Professional Empty Home Cleaning Services"
      subtitle="Perfect for post-construction or pre-move-in cleaning - get your empty property spotless"
      serviceDetails={serviceDetails}
      showTypeSelection={true}
      pricingTable={
        pricingTable.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Empty Home Cleaning Services Pricing
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Flat / House Size</th>
                    {services.map((service) => (
                      <th key={service.id} className="p-3 text-center border">
                        {service.title}
                      </th>
                    ))}
                    <th className="p-3 text-center border">Timing</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingTable.map((row: any, index: number) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-3 border font-medium">{row.bhk}</td>
                      {services.map((service) => (
                        <td key={service.id} className="p-3 border text-center">
                          ₹{row[service.title.toLowerCase().replace(/\s/g, "")] || "N/A"}
                        </td>
                      ))}
                      <td className="p-3 border text-center">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div>No pricing data available</div>
        )
      }
    />
  );
};

export default EmptyHome;