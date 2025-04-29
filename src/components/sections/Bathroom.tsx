import ServiceComponent from "../common/ServiceComponent";
import {
  FaCheck,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaThLarge,
  FaShower,
  FaToilet,
  FaFan,
  FaImage,
  FaTint,
  FaTintSlash,
  FaShieldAlt,
  FaPaintRoller,
  FaCrown,
  FaEraser,
  FaWater,
} from "react-icons/fa";

const whatsappNumber = "918638167421";

const services = [
  {
    id: "BTN001",
    title: "Normal Bathroom Cleaning",
    price: 458,
    image:
      "https://images.unsplash.com/photo-1571712707792-82c3cc4243f5?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    features: [
      {
        label: "Floor & wall tiles cleaning",
        icon: <FaThLarge />,
        desc: "Tiles",
      },
      { label: "Tap fixtures polishing", icon: <FaShower />, desc: "Tap" },
      {
        label: "Toilet & basin sanitization",
        icon: <FaToilet />,
        desc: "Toilet",
      },
      { label: "Window & exhaust cleaning", icon: <FaFan />, desc: "Window" },
      {
        label: "Partition & mirror cleaning",
        icon: <FaImage />,
        desc: "Mirror",
      },
      { label: "Normal stain removal", icon: <FaTint />, desc: "Stain" },
    ],
    requirements: [
      { label: "Ladder (if needed)", icon: null },
      { label: "Bucket & mug provided by customer", icon: null },
    ],
    exclusions: [
      { label: "Scrubbing machine cleaning", icon: null },
      { label: "Cabinet interior cleaning", icon: null },
      { label: "Bucket/mug/stool not provided", icon: null },
    ],
    popular: false,
    whatsappMessage:
      "Hi, I'd like to book Normal Bathroom Cleaning (₹458). Please provide available slots.",
  },
  {
    id: "BTD002",
    title: "Bathroom Deep Cleaning",
    price: 548,
    image:
      "https://img.freepik.com/free-photo/man-doing-professional-home-cleaning-service_23-2150358986.jpg?t=st=1745862096~exp=1745865696~hmac=d00a582f8afb8de2d3e06015fb303b44e31731e3b4ce3484b5354756afc13a73&w=996",
    features: [
      {
        label: "Everything in Normal Cleaning",
        icon: <FaCheckCircle />,
        desc: "Normal",
      },
      {
        label: "Hard water stain removal",
        icon: <FaWater />,
        desc: "Hard Water",
      },
      {
        label: "Yellow/brown stain removal",
        icon: <FaTintSlash />,
        desc: "Stain",
      },
      {
        label: "Enhanced sanitization",
        icon: <FaShieldAlt />,
        desc: "Sanitization",
      },
      {
        label: "Extended service time",
        icon: <FaClock />,
        desc: "Service Time",
      },
    ],
    requirements: [
      { label: "Ladder (if needed)", icon: null },
      { label: "Bucket & mug provided by customer", icon: null },
      { label: "Power plug point access", icon: null },
    ],
    exclusions: [{ label: "Bucket/mug/stool not provided", icon: null }],
    popular: true,
    whatsappMessage:
      "Hi, I'd like to book Bathroom Deep Cleaning (₹548). Please provide available slots.",
  },
  {
    id: "BTP003",
    title: "Premium Deep Cleaning",
    price: 618,
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    features: [
      {
        label: "Everything in Deep Cleaning",
        icon: <FaCheckCircle />,
        desc: "Deep",
      },
      { label: "Gap stain removal", icon: <FaEraser />, desc: "Stain" },
      {
        label: "Paint/cement stain removal",
        icon: <FaPaintRoller />,
        desc: "Paint",
      },
      { label: "Rust stain treatment", icon: <FaTools />, desc: "Rust" },
      {
        label: "Premium cleaning products",
        icon: <FaCrown />,
        desc: "Premium",
      },
    ],
    requirements: [
      { label: "Ladder (if needed)", icon: null },
      { label: "Bucket & mug provided by customer", icon: null },
      { label: "Power plug point access", icon: null },
    ],
    exclusions: [{ label: "Bucket/mug/stool not provided", icon: null }],
    popular: false,
    whatsappMessage:
      "Hi, I'd like to book Premium Deep Cleaning (₹618). Please provide available slots.",
  },
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
      label: "Service duration: 2-3 hours depending on bathroom size",
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

const Bathroom = () => {
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

export default Bathroom;