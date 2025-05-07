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
      const fetchServices = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/services-by-category");
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("API Response:", data); // Debug: Log raw API response
          
          // Get all services from the Cleaning Services category
          const cleaningServices = data["Cleaning Services"] || [];
          
          // Filter for subCategory === "Full Home"
          const fullHomeServices = cleaningServices.filter(
            (service: any) => service.subCategory === "Empty Home"
          );
          
          console.log("Filtered Empty Home Services:", fullHomeServices); // Debug: Log filtered services
          
          if (fullHomeServices.length === 0) {
            setError("No Empty Home services found");
            return;
          }
          
          const mappedServices = fullHomeServices.map((service: any) => {
            // Parse features, requirements, exclusions, and pricetable if they're strings
            let parsedFeatures = [];
            let parsedRequirements = [];
            let parsedExclusions = [];
            let parsedPricetable = [];
            
            try {
              parsedFeatures = typeof service.features === 'string' 
                ? JSON.parse(service.features) 
                : service.features || [];
            } catch (e) {
              console.error("Error parsing features:", e);
              parsedFeatures = [];
            }
            
            try {
              parsedRequirements = typeof service.requirements === 'string' 
                ? JSON.parse(service.requirements) 
                : service.requirements || [];
            } catch (e) {
              console.error("Error parsing requirements:", e);
              parsedRequirements = [];
            }
            
            try {
              parsedExclusions = typeof service.exclusions === 'string' 
                ? JSON.parse(service.exclusions) 
                : service.exclusions || [];
            } catch (e) {
              console.error("Error parsing exclusions:", e);
              parsedExclusions = [];
            }
            
            try {
              parsedPricetable = typeof service.pricetable === 'string' 
                ? JSON.parse(service.pricetable) 
                : service.pricetable || [];
            } catch (e) {
              console.error("Error parsing pricetable:", e);
              parsedPricetable = [];
            }
            
            // Map the icon strings to actual React components
            const mappedFeatures = parsedFeatures.map((f: any) => ({
              ...f,
              icon: f.icon && iconMap[f.icon] ? React.createElement(iconMap[f.icon]) : null,
            }));
            
            const mappedRequirements = parsedRequirements.map((r: any) => ({
              ...r,
              icon: r.icon && iconMap[r.icon] ? React.createElement(iconMap[r.icon]) : null,
            }));
            
            const mappedExclusions = parsedExclusions.map((e: any) => ({
              ...e,
              icon: e.icon && iconMap[e.icon] ? React.createElement(iconMap[e.icon]) : null,
            }));
            
            // Create a clean service object with all the parsed data
            return {
              id: service.service_code,
              title: service.name,
              price: service.price, // e.g., "From ₹2699"
              image: service.image,
              description: service.description,
              features: mappedFeatures,
              pricing: parsedPricetable.map((p: any) => ({
                bhk: p.bhk,
                price: p.price, // e.g., "₹2699"
                time: p.time,
              })),
              requirements: mappedRequirements,
              exclusions: mappedExclusions,
              popular: !!service.popular,
              whatsappMessage: service.whatsapp_message,
              // Add a simplified identifier for the pricing table
              serviceKey: service.name.toLowerCase().replace(/\s+/g, ""),
            };
          });
          
          console.log("Mapped Services:", mappedServices); // Debug: Log mapped services
          
          setServices(mappedServices);
        } catch (err) {
          console.error("Error fetching services:", err);
          setError("Failed to load services");
        } finally {
          setLoading(false);
        }
      };
      
      fetchServices();
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