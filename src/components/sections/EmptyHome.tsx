import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import Button from "../ui/Button";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/Container";
import SectionHeading from "../ui/SectionHeading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { gsap } from "gsap";
import { FaCheck, FaTimesCircle, FaClipboardList } from "react-icons/fa";
import {
  FaClock,
  FaTools,
  FaCheckCircle,
  FaThLarge,
  FaShieldAlt,
} from "react-icons/fa";

interface Service {
  title: string;
  price: string;
  originalPrice: string;
  image: string;
  features: {
    label: string;
    icon: React.ReactNode;
    desc: string | null;
  }[];
  requirements: {
    label: string;
    icon: React.ReactNode | null;
  }[];
  exclusions: {
    label: string;
    icon: React.ReactNode | null;
  }[];
  popular: boolean;
  whatsappMessage: string;
  pricing: {
    bhk: string;
    price: string;
    time: string;
  }[];
}

const whatsappNumber = "918638167421";

const pricingTable = [
  { bhk: "1BHK", normal: 1999, deep: 2599, time: "2-4 Hours" },
  { bhk: "2BHK", normal: 2399, deep: 3299, time: "3-5 Hours" },
  { bhk: "3BHK", normal: 3499, deep: 4399, time: "4-7 Hours" },
  { bhk: "4BHK", normal: 4499, deep: 5899, time: "7-10 Hours" },
  { bhk: "5BHK", normal: 5599, deep: 8599, time: "9-11 Hours" },
];

const services: Service[] = [
  {
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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedService && dialogRef.current) {
      gsap.from(dialogRef.current, {
        duration: 0.3,
        opacity: 0,
        y: 20,
        ease: "power2.out",
      });
    }
  }, [selectedService]);

  const handleCloseDialog = () => {
    if (dialogRef.current) {
      gsap.to(dialogRef.current, {
        duration: 0.2,
        opacity: 0,
        y: -10,
        ease: "power2.in",
        onComplete: () => setSelectedService(null),
      });
    } else {
      setSelectedService(null);
    }
  };

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <section
      id="empty-home-cleaning"
      className="relative py-24 bg-cover bg-fixed bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/banner.webp')",
      }}
    >
      <Container className="py-12">
        <SectionHeading
          title="Professional Empty Home Cleaning Services"
          subtitle="Perfect for post-construction or pre-move-in cleaning - get your empty property spotless"
          center={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`relative flex flex-col transition-all hover:shadow-lg ${
                service.popular ? "border-2 border-sky-500" : ""
              }`}
            >
              {service.popular && (
                <Badge className="absolute -top-3 -right-3 bg-sky-400 text-white">
                  Most Popular
                </Badge>
              )}
              <div className="flex-1 p-4 w-full">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-xl font-[500]">
                        {service.title}
                      </h3>
                      <div className="flex items-end gap-2 mt-2">
                        <span className="text-2xl sm:text-3xl text-rose-600 font-bold">
                          {service.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {service.originalPrice}
                        </span>
                      </div>
                    </div>
                    <div className="w-full sm:w-32 h-32 overflow-hidden rounded-xl">
                      <img
                        src={service.image}
                        className="w-full h-full object-cover"
                        alt={service.title}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="mt-4 flex flex-col gap-2">
                  <button
                    className="w-full text-center text-sky-600 hover:text-sky-800 font-medium transition-colors"
                    onClick={() => setSelectedService(service)}
                  >
                    View More Details
                  </button>
                  <Button
                    className="w-full bg-sky-500 hover:bg-sky-600 transition-colors"
                    onClick={() => openWhatsApp(service.whatsappMessage)}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        {/* Pricing Table */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
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
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Service Details
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">
                All Cleaning Includes:
              </h3>
              <ul className="space-y-2">
                {serviceDetails.includes.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">Note:</h3>
              <ul className="space-y-2">
                {serviceDetails.notes.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* Modal for showing service details */}
      {selectedService && (
        <Dialog open={!!selectedService} onOpenChange={handleCloseDialog}>
          <DialogContent
            ref={dialogRef}
            className="max-h-screen overflow-hidden flex flex-col"
          >
            <DialogHeader className="flex-shrink-0">
              <DialogTitle
                className="text-2xl py-20 px-4 text-white font-bold rounded-lg bg-cover bg-center relative after:content-[''] after:absolute after:inset-0 after:bg-black/40 after:rounded-lg"
                style={{
                  backgroundImage: `url(${selectedService.image})`,
                }}
              >
                <span className="relative z-10">{selectedService.title}</span>
              </DialogTitle>
              <div className="flex items-end gap-2 mb-4 pt-2">
                <span className="text-2xl font-bold text-rose-600">
                  {selectedService.price}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {selectedService.originalPrice}
                </span>
              </div>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[50vh] pr-2">
              <DialogDescription className="space-y-6">
                <div>
                  <h2 className="font-medium mb-2 pt-2 flex items-center gap-2">
                    <span>Services Included:</span>
                  </h2>
                  <ul className="space-y-2 pl-4">
                    {selectedService.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaCheck className="text-green-500" />{" "}
                        <span>{feature.label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 pt-6">
                    {selectedService.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center text-gray-600"
                      >
                        <div className="text-5xl sm:text-6xl">
                          {feature.icon}
                        </div>
                        <span className="text-center text-sm md:text-base mt-2">
                          {feature.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <span>Pricing Details:</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left border">BHK Size</th>
                          <th className="p-2 text-center border">Price</th>
                          <th className="p-2 text-center border">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedService.pricing.map((price, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="p-2 border">{price.bhk}</td>
                            <td className="p-2 border text-center">{price.price}</td>
                            <td className="p-2 border text-center">{price.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <span>Not Included:</span>
                  </h3>
                  <ul className="space-y-2 pl-4">
                    {selectedService.exclusions.map((exclude, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaTimesCircle className="text-red-500" />{" "}
                        <span>{exclude.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <span>What We Need:</span>
                  </h3>
                  <ul className="space-y-2 pl-4">
                    {selectedService.requirements.map((require, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaClipboardList className="text-sky-500" />{" "}
                        <span>{require.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </DialogDescription>
            </div>

            <div className="mt-4 flex gap-3 flex-shrink-0 pt-4 border-t">
              <Button
                className="flex-1 bg-sky-500 hover:bg-sky-600"
                onClick={() => {
                  openWhatsApp(selectedService.whatsappMessage);
                  handleCloseDialog();
                }}
              >
                Book This Service
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCloseDialog}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default EmptyHome;