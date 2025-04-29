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

const whatsappNumber = "918638167421";

const sofaPrices = [479, 629, 729, 879, 979, 1129, 1229, 1329, 1579, 1679];
const images = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
];

const services = [
  ...sofaPrices.map((price, index) => {
    const seats = index + 3;

    return {
      title: `Sofa Cleaning - ${seats} Seats`,
      price: `₹${price}`,
      originalPrice: ``,
      image: images[index],
      features: [
        { label: "Vacuum cleaning", icon: <FaCouch />, desc: "Vacuum" },
        { label: "Stain treatment", icon: <FaSprayCan />, desc: "Stain" },
        { label: "Dry & wet cleaning", icon: <FaRecycle />, desc: "Cleaning" },
        {
          label: "Shampooing & sanitizing",
          icon: <FaPumpSoap />,
          desc: "Sanitize",
        },
        { label: "Fabric-safe chemicals", icon: <FaHandsWash />, desc: "Safe" },
      ],
      requirements: [
        { label: "Power plug point access", icon: null },
        { label: "Water supply (if required)", icon: null },
      ],
      exclusions: [
        { label: "Cushion covers dry-cleaning", icon: null },
        { label: "Carpet cleaning", icon: null },
      ],
      popular: seats === 5 || seats === 7, // Mark 5 and 7 seats as popular just for variety
      whatsappMessage: `Hi, I'd like to book Sofa Cleaning for ${seats} Seats (₹${price}). Please provide available slots.`,
    };
  }),
];

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
  return (
    <ServiceComponent
      services={services}
      whatsappNumber={whatsappNumber}
      id="bathroom-cleaning"
      backgroundImage="/banner.webp"
      title="Professional Bathroom Cleaning Services"
      subtitle="Sparkling clean bathrooms with disinfecting treatments - book your expert cleaning today"
      serviceDetails={serviceDetails}
    />
  );
};

export default Sofa;
