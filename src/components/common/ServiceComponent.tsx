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
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

interface Service {
  id: string;
  title: string;
  price: number;
  image: string;
  features: {
    label: string;
    icon: React.ReactNode;
    desc: string;
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
}

interface ServiceComponentProps {
  services: Service[];
  whatsappNumber: string;
  id: string;
  backgroundImage: string;
  title: string;
  subtitle: string;
  serviceDetails: {
    includes: {
      icon: React.ReactNode;
      label: string;
    }[];
    notes: {
      icon: React.ReactNode;
      label: string;
    }[];
  };
}

const ServiceComponent = ({
  services,
  whatsappNumber,
  id,
  backgroundImage,
  title,
  subtitle,
  serviceDetails,
}: ServiceComponentProps) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

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

  const handleAddToCart = (service: Service) => {
    console.log("Adding to cart:", service); // Debug log
    addToCart({
      id: service.id,
      name: service.title,
      price: Number(service.price), // Ensure price is a number
      image: service.image,
      quantity: 1,
    });
    toast.success(`${service.title} has been added to your cart.`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      className: "bg-sky-400 text-white border-rose-800",
    });
    console.log("Toast triggered for:", service.title); // Debug log
  };

  return (
    <section
      id={id}
      className="relative py-24 bg-cover bg-fixed bg-center overflow-hidden"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <Container className="py-12">
        <SectionHeading title={title} subtitle={subtitle} center={true} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
                        <span className="text-2xl text-rose-600 font-bold">
                          Rs. {service.price}
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
                  {/* <Button
                    className="w-full bg-sky-500 hover:bg-sky-600 transition-colors"
                    onClick={() => openWhatsApp(service.whatsappMessage)}
                  >
                    Book Now
                  </Button> */}
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(service)}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
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
                  Rs. {selectedService.price}
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
                        <FaCheck className="text-green-500" />
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
                    <span>Not Included:</span>
                  </h3>
                  <ul className="space-y-2 pl-4">
                    {selectedService.exclusions.map((exclude, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaTimesCircle className="text-red-500" />
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
                        <FaClipboardList className="text-sky-500" />
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
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={() => {
                  handleAddToCart(selectedService);
                  handleCloseDialog();
                }}
              >
                Add to Cart
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

export default ServiceComponent;