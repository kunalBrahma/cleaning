import {
  FaClock,
  FaTools,
  FaCheckCircle,
  FaThLarge,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";
import HomeServiceComponent from "../common/HomeServiceComponent";


const pricingTable = [
  { bhk: "1BHK", normal: 1999, deep: 2599, time: "2-4 Hours" },
  { bhk: "2BHK", normal: 2399, deep: 3299, time: "3-5 Hours" },
  { bhk: "3BHK", normal: 3499, deep: 4399, time: "4-7 Hours" },
  { bhk: "4BHK", normal: 4499, deep: 5899, time: "7-10 Hours" },
  { bhk: "5BHK", normal: 5599, deep: 8599, time: "9-11 Hours" },
];

const services = [
  {
    id: "empty-home-normal-cleaning",
    title: "Empty Home Normal Cleaning",
    price: "From ₹1999",
    originalPrice: "₹2499",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    features: [
      { label: "Complete floor cleaning", icon: <FaThLarge />, desc: null },
      { label: "Wall and ceiling dusting", icon: <FaShieldAlt />, desc: null },
      { label: "Window frames cleaning", icon: <FaCheckCircle />, desc: null },
      { label: "Basic bathroom cleaning", icon: <FaTools />, desc: null },
    ],
    pricing: pricingTable.map(({ bhk, normal, time }) => ({
      bhk,
      price: `₹${normal}`,
      time,
    })),
    requirements: [
      { label: "Empty property with no furniture", icon: null },
      { label: "Water and electricity access", icon: null },
    ],
    exclusions: [{ label: "Construction debris removal", icon: null }],
    popular: false,
    whatsappMessage:
      "Hi, I'd like to book Empty Home Normal Cleaning. Please share available slots.",
  },
  {
    id: "empty-home-deep-cleaning",
    title: "Empty Home Deep Cleaning",
    price: "From ₹2599",
    originalPrice: "₹3299",
    image:
      "https://images.unsplash.com/photo-1581579185169-1f31b9d38f59?q=80&w=2070&auto=format&fit=crop",
    features: [
      { label: "Everything in Normal Cleaning", icon: <FaCheckCircle />, desc: null },
      { label: "Deep grout and tile cleaning", icon: <FaShieldAlt />, desc: null },
      { label: "Cabinet interior cleaning", icon: <FaShieldAlt />, desc: null },
      { label: "Light fixture cleaning", icon: <FaTools />, desc: null },
    ],
    pricing: pricingTable.map(({ bhk, deep, time }) => ({
      bhk,
      price: `₹${deep}`,
      time,
    })),
    requirements: [
      { label: "Empty property with no furniture", icon: null },
      { label: "Water and electricity access", icon: null },
    ],
    exclusions: [{ label: "Paint or stain removal", icon: null }],
    popular: true,
    whatsappMessage:
      "Hi, I'd like to book Empty Home Deep Cleaning. Please share available slots.",
  },
];

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

const EmptyHome = () => {
  return (
    <HomeServiceComponent
      services={services}
      whatsappNumber="918638167421"
      id="empty-home-cleaning"
      backgroundImage="/banner.webp"
      title="Professional Empty Home Cleaning Services"
      subtitle="Perfect for post-construction or pre-move-in cleaning - get your empty property spotless"
      serviceDetails={serviceDetails}
      showTypeSelection={true}
      pricingTable={
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Empty Home Cleaning Services Pricing
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border">Flat / House Size</th>
                  <th className="p-3 text-center border">Empty Home Normal Cleaning</th>
                  <th className="p-3 text-center border">Empty Home Deep Cleaning</th>
                  <th className="p-3 text-center border">Timing</th>
                </tr>
              </thead>
              <tbody>
                {pricingTable.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border font-medium">{row.bhk}</td>
                    <td className="p-3 border text-center">₹{row.normal}</td>
                    <td className="p-3 border text-center">₹{row.deep}</td>
                    <td className="p-3 border text-center">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
    />
  );
};

export default EmptyHome;