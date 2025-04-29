import { Service } from "../types";

export const services: Service[] = [
  // Cleaning Services
  {
    id: "bathroom-cleaning",
    name: "Bathroom Cleaning",
    description: "Thorough cleaning of all bathroom surfaces, fixtures, and floors.",
    icon: "Bath",
    price: "From Rs 299",
    category: "Cleaning Services",
    subCategory: "Bathroom Cleaning",
    path:"/cleaning/bathroom-cleaning"
  },
  {
    id: "sofa-cleaning",
    name: "Sofa Cleaning",
    description: "Professional cleaning for all types of sofas and upholstery.",
    icon: "Sofa",
    price: "From $69",
    category: "Cleaning Services",
    subCategory: "Sofa Cleaning",
    path:"/cleaning/sofa-cleaning"
  },
  {
    id: "carpet-cleaning",
    name: "Carpet Cleaning",
    description: "Deep extraction and cleaning for all types of carpets and rugs.",
    icon: "BrickWall",
    price: "From $59",
    category: "Cleaning Services",
    subCategory: "",
    path:"/cleaning/carpet-cleaning"
  },
  {
    id: "kitchen-chimney",
    name: "Kitchen & Chimney Cleaning",
    description: "Cleaning of countertops, appliances, sink, chimney, and floors.",
    icon: "UtensilsCrossed",
    price: "From $59",
    category: "Cleaning Services",
    subCategory: "Kitchen & Chimney Cleaning",
    path:"/cleaning/kitchen-chimney",
  },
  {
    id: "full-home",
    name: "Full Home Cleaning",
    description: "Comprehensive cleaning service for your entire home.",
    icon: "Home",
    price: "From $149",
    category: "Cleaning Services",
    subCategory: "",
    path:"/cleaning/full-home"
  },


  {
    id: "empty-home",
    name: "Empty Home Cleaning",
    description: "Comprehensive cleaning service for your entire home.",
    icon: "Home",
    price: "From $149",
    category: "Cleaning Services",
    subCategory: "",
    path:"/cleaning/empty-home"
  },
  // Subcategory services for Bathroom Cleaning
  {
    id: "normal-cleaning",
    name: "Normal Cleaning Service",
    description: "Standard bathroom cleaning service with disinfectant and sanitization.",
    icon: "Droplet",
    price: "From $149",
    category: "Cleaning Services",
    subCategory: "Bathroom Cleaning",
    path:""
  },
  {
    id: "deep-cleaning",
    name: "Deep Cleaning Service",
    description: "Detailed bathroom deep cleaning including descaling, stain removal, and sanitization.",
    icon: "ShieldCheck",
    price: "From $199",
    category: "Cleaning Services",
    subCategory: "Bathroom Cleaning",
    path:""
  },

  // Subcategory services for Kitchen & Chimney Cleaning
  {
    id: "chimney-deep-cleaning",
    name: "Chimney Deep Cleaning",
    description: "Intensive cleaning and degreasing for kitchen chimneys and exhausts.",
    icon: "Fan",
    price: "From $249",
    category: "Cleaning Services",
    subCategory: "Kitchen & Chimney Cleaning",
    path:""
  },
  {
    id: "kitchen-full-cleaning",
    name: "Kitchen Full Cleaning",
    description: "Comprehensive cleaning service for kitchen surfaces, cabinets, and appliances.",
    icon: "UtensilsCrossed",
    price: "From $199",
    category: "Cleaning Services",
    subCategory: "Kitchen & Chimney Cleaning",
    path:""
  },
  // Painting Services
  {
    id: "interior-painting",
    name: "Interior Painting",
    description:
      "Professional painting service for interior walls and ceilings.",
    icon: "PaintBucket",
    price: "From $299",
    category: "Painting Services",
    subCategory:"",
    path:""
  },
  {
    id: "exterior-painting",
    name: "Exterior Painting",
    description: "Weather-resistant painting for exterior surfaces.",
    icon: "PaintBucket",
    price: "From $399",
    category: "Painting Services",
    subCategory:"",
    path:""
  },
  {
    id: "furniture-painting",
    name: "Furniture Painting",
    description: "Custom painting and refinishing for furniture pieces.",
    icon: "Palette",
    price: "From $99",
    category: "Painting Services",
    subCategory:"",
    path:""
  },

  // Pest Control
  {
    id: "general-pest",
    name: "General Pest Control",
    description:
      "Treatment for common household pests including ants, spiders, and roaches.",
    icon: "Bug",
    price: "From $89",
    category: "Pest Control",
    subCategory:"",
    path:""
  },
  {
    id: "termite-treatment",
    name: "Termite Treatment",
    description: "Specialized termite inspection and treatment solutions.",
    icon: "Bug",
    price: "From $199",
    category: "Pest Control",
    subCategory:"",
    path:""
  },
  {
    id: "bed-bug",
    name: "Bed Bug Treatment",
    description: "Comprehensive bed bug elimination and prevention.",
    icon: "Bug",
    price: "From $149",
    category: "Pest Control",
    subCategory:"",
    path:""
  },

  // Home Repair Services
  {
    id: "plumbing",
    name: "Plumbing Services",
    description: "Repairs and maintenance for all plumbing issues.",
    icon: "Wrench",
    price: "From $79",
    category: "Home Repair Services",
    subCategory:"",
    path:""
  },
  {
    id: "electrical",
    name: "Electrical Repairs",
    description:
      "Safe solutions for all electrical problems and installations.",
    icon: "Zap",
    price: "From $89",
    category: "Home Repair Services",
    subCategory:"",
    path:""
  },
  {
    id: "carpentry",
    name: "Carpentry Services",
    description: "Custom carpentry, repairs, and installations.",
    icon: "Hammer",
    price: "From $99",
    category: "Home Repair Services",
    subCategory:"",
    path:""
  },

  // Packers and Movers
  {
    id: "local-moving",
    name: "Local Moving Services",
    description: "Professional packing and moving within the city.",
    icon: "Truck",
    price: "From $299",
    category: "Packers and Movers",
    subCategory:"",
    path:""
  },
  {
    id: "long-distance",
    name: "Long Distance Moving",
    description: "Interstate moving services with proper care and handling.",
    icon: "Truck",
    price: "From $599",
    category: "Packers and Movers",
    subCategory:"",
    path:""
  },
  {
    id: "packing-only",
    name: "Packing Services",
    description:
      "Professional packing of your belongings with quality materials.",
    icon: "Package",
    price: "From $149",
    category: "Packers and Movers",
    subCategory:"",
    path:""
  },
];

export const getServicesByCategory = () => {
  const categories: Record<string, Service[]> = {};

  services.forEach((service) => {
    if (!categories[service.category]) {
      categories[service.category] = [];
    }
    categories[service.category].push(service);
  });

  return categories;
};

export const getServicesBySubCategory = (subCategory: string) => {
  return services.filter(service => service.subCategory === subCategory);
};

export const getServiceById = (id: string) => {
  return services.find((service) => service.id === id);
};
export const getServiceByPath = (path: string) => {
  return services.find((service) => service.path === path);
};
