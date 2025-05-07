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
  FaCrown,
  FaCheck,
  FaCouch,
  FaSprayCan,
  FaRecycle,
  FaPumpSoap,
  FaHandsWash,
  FaShower,
  FaToilet,
  FaFan,
  FaImage,
  FaTint,
  FaWater,
  FaTintSlash,
  FaEraser,
  FaFire,
  FaUtensils,
  FaBox,
  FaWind,
  FaBroom,
} from "react-icons/fa";
import { IconType } from "react-icons";

// Complete icon map with all icons used in your services
const iconMap: Record<string, IconType> = {
  FaClock,
  FaTools,
  FaCheckCircle,
  FaThLarge,
  FaShieldAlt,
  FaCrown,
  FaCheck,
  FaCouch,
  FaSprayCan,
  FaRecycle,
  FaPumpSoap,
  FaHandsWash,
  FaShower,
  FaToilet,
  FaFan,
  FaImage,
  FaTint,
  FaWater,
  FaTintSlash,
  FaEraser,
  FaFire,
  FaUtensils,
  FaBox,
  FaWind,
  FaBroom,
};

const whatsappNumber = "918638167421";

const FullHome = () => {
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
          (service: any) => service.subCategory === "Full Home"
        );
        
        console.log("Filtered Full Home Services:", fullHomeServices); // Debug: Log filtered services
        
        if (fullHomeServices.length === 0) {
          setError("No Full Home services found");
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

  if (loading) return <div className="flex justify-center items-center h-64">Loading services...</div>;
  if (error) return (
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

  // Common elements that describe the service
  const serviceDetails = {
    includes: [
      {
        icon: <FaCheck className="text-green-500 mt-1" size={16} />,
        label: "Professional cleaning of entire home areas",
      },
      {
        icon: <FaCheck className="text-green-500 mt-1" size={16} />,
        label: "Eco-friendly and safe cleaning products",
      },
      {
        icon: <FaCheck className="text-green-500 mt-1" size={16} />,
        label: "Sanitization of high-contact areas",
      },
    ],
    notes: [
      {
        icon: <FaClock className="text-yellow-500 mt-1" size={16} />,
        label: "Service duration: 2-12 hours depending on BHK size",
      },
      {
        icon: <FaTools className="text-yellow-500 mt-1" size={16} />,
        label: "Our team brings necessary equipment",
      },
      {
        icon: <FaCheckCircle className="text-yellow-500 mt-1" size={16} />,
        label: "Click 'Book Now' to schedule your service",
      },
    ],
  };

  // Create the pricing table rows
  // First, collect all unique BHK types across all services
  const allBhkTypes = new Set<string>();
  services.forEach(service => {
    if (service.pricing && service.pricing.length > 0) {
      service.pricing.forEach((p: any) => allBhkTypes.add(p.bhk));
    }
  });

  // Convert to array and sort (1BHK should come before 2BHK, etc.)
  const sortedBhkTypes = Array.from(allBhkTypes).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });

  // Create the pricing table rows
  const pricingTable = sortedBhkTypes.map(bhk => {
    // Start with the BHK type
    const row: any = { bhk };
    
    // Add time and price for each service
    services.forEach(service => {
      const pricing = service.pricing?.find((p: any) => p.bhk === bhk);
      if (pricing) {
        row[service.serviceKey] = pricing.price.replace(/^₹/, ""); // Remove ₹ symbol
        row.time = pricing.time; // All should have the same time for the same BHK
      } else {
        row[service.serviceKey] = "N/A";
      }
    });
    
    return row;
  });

  console.log("Pricing Table:", pricingTable); // Debug: Log pricing table

  return (
    <HomeServiceComponent
      services={services}
      whatsappNumber={whatsappNumber}
      id="full-home-cleaning"
      backgroundImage="/banner.webp"
      title="Professional Full Home Cleaning Services"
      subtitle="Deep cleaning, stain removal, and complete home sanitization - book your expert home care today"
      serviceDetails={serviceDetails}
      showTypeSelection={true}
      pricingTable={
        pricingTable.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Full Home Cleaning Services Pricing
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
                  {pricingTable.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-3 border font-medium">{row.bhk}</td>
                      {services.map((service) => (
                        <td key={service.id} className="p-3 border text-center">
                          ₹{row[service.serviceKey] || "N/A"}
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
          <div className="text-center p-6">No pricing data available</div>
        )
      }
    />
  );
};

export default FullHome;