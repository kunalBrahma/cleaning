import {
  FaClock,
  FaTools,
  FaCheckCircle,
  FaThLarge,
  FaShieldAlt,
  FaCrown,
  FaCheck,
} from "react-icons/fa";
import HomeServiceComponent from "../common/HomeServiceComponent";

// const whatsappNumber = "918638167421";

const pricingTable = [
  { bhk: "1BHK", normal: 2699, deep: 3399, master: 4999, time: "2-4 Hours" },
  { bhk: "2BHK", normal: 3199, deep: 4199, master: 5899, time: "3-5 Hours" },
  { bhk: "3BHK", normal: 3999, deep: 4999, master: 7199, time: "4-7 Hours" },
  { bhk: "4BHK", normal: 5399, deep: 6399, master: 9199, time: "7-10 Hours" },
  { bhk: "5BHK", normal: 6399, deep: 9499, master: 12499, time: "9-11 Hours" },
  {
    bhk: "6BHK",
    normal: 7399,
    deep: 10299,
    master: 13899,
    time: "10-12 Hours",
  },
];

const services = [
  {
    id: "full-home-normal-cleaning",
    title: "Full Home Normal Cleaning",
    price: "From ₹2699",
    originalPrice: "₹3499",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    features: [
      {
        label: "Sweeping & mopping of floors",
        icon: <FaThLarge />,
        desc: null,
      },
      { label: "Surface dusting & wiping", icon: <FaShieldAlt />, desc: null },
      {
        label: "Basic kitchen & bathroom cleaning",
        icon: <FaCheckCircle />,
        desc: null,
      },
    ],
    pricing: pricingTable.map(({ bhk, normal, time }) => ({
      bhk,
      price: `₹${normal}`,
      time,
    })),
    requirements: [
      { label: "Water and electricity access", icon: null },
      { label: "Customer to provide ladder (if needed)", icon: null },
    ],
    exclusions: [{ label: "Deep stain or sofa cleaning", icon: null }],
    popular: false,
    whatsappMessage:
      "Hi, I'd like to book Full Home Normal Cleaning. Please share available slots.",
  },
  {
    id: "full-home-deep-cleaning",
    title: "Full Home Deep Cleaning",
    price: "From ₹3399",
    originalPrice: "₹4199",
    image:
      "https://images.unsplash.com/photo-1581579185169-1f31b9d38f59?q=80&w=2070&auto=format&fit=crop",
    features: [
      {
        label: "Everything in Normal Cleaning",
        icon: <FaCheckCircle />,
        desc: null,
      },
      { label: "Bathroom deep cleaning", icon: <FaShieldAlt />, desc: null },
      { label: "Kitchen deep cleaning", icon: <FaShieldAlt />, desc: null },
      { label: "Ceiling & fan dusting", icon: <FaTools />, desc: null },
    ],
    pricing: pricingTable.map(({ bhk, deep, time }) => ({
      bhk,
      price: `₹${deep}`,
      time,
    })),
    requirements: [
      { label: "Water and electricity access", icon: null },
      { label: "Customer to provide ladder (if needed)", icon: null },
    ],
    exclusions: [{ label: "Sofa shampoo or upholstery cleaning", icon: null }],
    popular: true,
    whatsappMessage:
      "Hi, I'd like to book Full Home Deep Cleaning. Please share available slots.",
  },
  {
    id: "full-home-master-deep-cleaning",
    title: "Full Home Master Deep Cleaning",
    price: "From ₹4999",
    originalPrice: "₹5999",
    image:
      "https://images.unsplash.com/photo-1598300054281-1193c695fb7d?q=80&w=2070&auto=format&fit=crop",
    features: [
      {
        label: "Everything in Deep Cleaning",
        icon: <FaCheckCircle />,
        desc: null,
      },
      {
        label: "Paint, cement & rust stain removal",
        icon: <FaTools />,
        desc: null,
      },
      { label: "Premium eco-friendly products", icon: <FaCrown />, desc: null },
      { label: "Extended service time", icon: <FaClock />, desc: null },
    ],
    pricing: pricingTable.map(({ bhk, master, time }) => ({
      bhk,
      price: `₹${master}`,
      time,
    })),
    requirements: [
      { label: "Water and electricity access", icon: null },
      { label: "Customer to provide ladder (if needed)", icon: null },
    ],
    exclusions: [{ label: "Pest control and upholstery shampoo", icon: null }],
    popular: false,
    whatsappMessage:
      "Hi, I'd like to book Full Home Master Deep Cleaning. Please share available slots.",
  },
];

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

const FullHome = () => {
  return (
    <HomeServiceComponent
      services={services}
      whatsappNumber="918638167421"
      id="full-home-cleaning"
      backgroundImage="/banner.webp"
      title="Professional Full Home Cleaning Services"
      subtitle="Deep cleaning, stain removal, and complete home sanitization - book your expert home care today"
      serviceDetails={serviceDetails}
      showTypeSelection={true}
      pricingTable={
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Full Home Cleaning Services Pricing
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border">Flat / House Size</th>
                  <th className="p-3 text-center border">
                    Full Home Normal Cleaning
                  </th>
                  <th className="p-3 text-center border">
                    Full Home Deep Cleaning
                  </th>
                  <th className="p-3 text-center border">
                    Full Home Master Deep Cleaning
                  </th>
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
                    <td className="p-3 border text-center">₹{row.normal}</td>
                    <td className="p-3 border text-center">₹{row.deep}</td>
                    <td className="p-3 border text-center">₹{row.master}</td>
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

export default FullHome;
