import ServiceComponent from "../common/ServiceComponent";
import {
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaCrown,
  FaShieldAlt,
  FaEraser,
  FaTools,
  FaWater,
  FaTintSlash,
  FaFire,
  FaUtensils,
  FaBox,
  FaBroom,
  FaSprayCan,
  FaWind
} from "react-icons/fa";

const whatsappNumber = "918638167421";

const services = [
  {
    title: "Empty Kitchen Slab Cleaning",
    price: "₹849",
    originalPrice: "₹799",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    features: [
      {
        label: "Wall tiles deep cleaning",
        icon: <FaBroom />,
        desc: "Walls"
      },
      { 
        label: "Tap and fixture polishing", 
        icon: <FaWater />, 
        desc: "Fixtures" 
      },
      { 
        label: "Floor scrubbing and mopping", 
        icon: <FaEraser />, 
        desc: "Floor" 
      },
      { 
        label: "Sink and drain cleaning", 
        icon: <FaTintSlash />, 
        desc: "Sink" 
      },
      { 
        label: "Window and exhaust fan cleaning", 
        icon: <FaWind />, 
        desc: "Ventilation" 
      },
      { 
        label: "Slab degreasing and polishing", 
        icon: <FaSprayCan />, 
        desc: "Slab" 
      }
    ],
    requirements: [
      { label: "Clear countertop space", icon: null },
      { label: "Access to water source", icon: null },
      { label: "Power plug point access", icon: null }
    ],
    exclusions: [
      { label: "Utensil cleaning", icon: null },
      { label: "Cabinet interior cleaning", icon: null },
      { label: "Appliance cleaning", icon: null }
    ],
    popular: false,
    whatsappMessage: "Hi, I'd like to book Empty Kitchen Slab Cleaning (₹849). Please provide available slots."
  },
  {
    title: "Full Kitchen Slab Cleaning",
    price: "₹949",
    originalPrice: "₹899",
    image: "https://images.unsplash.com/photo-1556909114-44e1cd5b1b07?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    features: [
      {
        label: "Everything in Empty Slab Cleaning",
        icon: <FaCheckCircle />,
        desc: "Basic"
      },
      { 
        label: "Utensil removal and placing back", 
        icon: <FaUtensils />, 
        desc: "Utensils" 
      },
      { 
        label: "Enhanced degreasing treatment", 
        icon: <FaFire />, 
        desc: "Degreasing" 
      },
      { 
        label: "Extended service time", 
        icon: <FaClock />, 
        desc: "Time" 
      }
    ],
    requirements: [
      { label: "Access to water source", icon: null },
      { label: "Power plug point access", icon: null },
      { label: "Clear storage space for temporary utensil removal", icon: null }
    ],
    exclusions: [
      { label: "Cabinet interior cleaning", icon: null },
      { label: "Appliance internal cleaning", icon: null }
    ],
    popular: true,
    whatsappMessage: "Hi, I'd like to book Full Kitchen Slab Cleaning (₹949). Please provide available slots."
  },
  {
    title: "Empty Modular Kitchen Cleaning",
    price: "₹1,108",
    originalPrice: "₹1,049",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    features: [
      {
        label: "Complete modular kitchen cleaning",
        icon: <FaBroom />,
        desc: "Full Clean"
      },
      { 
        label: "Wall tiles and backsplash cleaning", 
        icon: <FaShieldAlt />, 
        desc: "Walls" 
      },
      { 
        label: "Tap and fixture polishing", 
        icon: <FaTools />, 
        desc: "Fixtures" 
      },
      { 
        label: "Floor deep cleaning", 
        icon: <FaEraser />, 
        desc: "Floor" 
      },
      { 
        label: "Sink and drain sanitization", 
        icon: <FaTintSlash />, 
        desc: "Sink" 
      },
      { 
        label: "Complete oil stain removal", 
        icon: <FaFire />, 
        desc: "Stains" 
      }
    ],
    requirements: [
      { label: "Clear countertop space", icon: null },
      { label: "Access to water source", icon: null },
      { label: "Power plug point access", icon: null }
    ],
    exclusions: [
      { label: "Utensil cleaning", icon: null },
      { label: "Appliance internal cleaning", icon: null }
    ],
    popular: false,
    whatsappMessage: "Hi, I'd like to book Empty Modular Kitchen Cleaning (₹1,108). Please provide available slots."
  },
  {
    title: "Full Modular Kitchen Cleaning",
    price: "₹1,558",
    originalPrice: "₹1,499",
    image: "https://images.unsplash.com/photo-1600566752227-8f3e8a57d521?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    features: [
      {
        label: "Everything in Empty Modular Cleaning",
        icon: <FaCheckCircle />,
        desc: "Basic"
      },
      { 
        label: "Utensil removal and placing back", 
        icon: <FaUtensils />, 
        desc: "Utensils" 
      },
      { 
        label: "Cabinet exterior polishing", 
        icon: <FaBox />, 
        desc: "Cabinets" 
      },
      { 
        label: "Premium degreasing treatment", 
        icon: <FaCrown />, 
        desc: "Premium" 
      },
      { 
        label: "Extended service time (4-5 hours)", 
        icon: <FaClock />, 
        desc: "Time" 
      }
    ],
    requirements: [
      { label: "Access to water source", icon: null },
      { label: "Power plug point access", icon: null },
      { label: "Clear storage space for temporary utensil removal", icon: null }
    ],
    exclusions: [
      { label: "Appliance internal cleaning", icon: null }
    ],
    popular: false,
    whatsappMessage: "Hi, I'd like to book Full Modular Kitchen Cleaning (₹1,558). Please provide available slots."
  }
];


const serviceDetails = {
  includes: [
    { icon: <FaCheck className="text-green-500 mt-1" size={16} />, label: "Professional degreasing of all surfaces" },
    { icon: <FaCheck className="text-green-500 mt-1" size={16} />, label: "Eco-friendly cleaning products" },
    { icon: <FaCheck className="text-green-500 mt-1" size={16} />, label: "Stainless steel polishing" }
  ],
  notes: [
    { icon: <FaClock className="text-yellow-500 mt-1" size={16} />, label: "Service duration: 3-5 hours depending on kitchen size" },
    { icon: <FaTools className="text-yellow-500 mt-1" size={16} />, label: "Our team brings all necessary equipment and supplies" },
    { icon: <FaCheckCircle className="text-yellow-500 mt-1" size={16} />, label: "Click 'Book Now' to schedule your cleaning" }
  ]
};

const Kitchen = () => {
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