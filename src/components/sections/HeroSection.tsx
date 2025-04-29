"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Search, Sparkles, Clock, Shield } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);
type FormData = {
  service: string;
  zip: string;
  date: string;
};

const HeroSection: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availabilityMsg, setAvailabilityMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Assuming Indian PIN code starts with '781' for Guwahati area
    if (data.zip.startsWith("781")) {
      setAvailabilityMsg("✅ Service is available in your area 🎉");
    } else {
      setAvailabilityMsg("❌ Sorry, we currently only serve Guwahati");
    }
    setDialogOpen(true);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: target,
          offsetY: 80, // adjust if you have a fixed navbar
        },
        ease: "power3.inOut",
      });
    }
  };
  

  return (
    <section
      id="home"
      className="relative mt-[130px] pt-20 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-r from-sky-900 to-sky-500 text-white"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582817978681-6385de02d82a?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-20"></div>

      <Container className="relative z-10 py-0 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Expert Home Services for Urban Living
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
              Professional cleaning, painting, repairs, and more. Bringing
              quality and reliability to every home in the city.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/booking">
                <Button size="lg">Book A Service</Button>
              </Link>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, "#services")}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  Explore Services
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="mr-3 bg-blue-700/50 p-2 rounded-full">
                  <Shield size={20} className="text-blue-200" />
                </div>
                <span className="text-blue-100">100% Satisfaction</span>
              </div>
              <div className="flex items-center">
                <div className="mr-3 bg-blue-700/50 p-2 rounded-full">
                  <Sparkles size={20} className="text-blue-200" />
                </div>
                <span className="text-blue-100">Vetted Professionals</span>
              </div>
              <div className="flex items-center">
                <div className="mr-3 bg-blue-700/50 p-2 rounded-full">
                  <Clock size={20} className="text-blue-200" />
                </div>
                <span className="text-blue-100">On-time Service</span>
              </div>
              <div className="flex items-center">
                <div className="mr-3 bg-blue-700/50 p-2 rounded-full">
                  <Search size={20} className="text-blue-200" />
                </div>
                <span className="text-blue-100">Transparent Pricing</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg text-gray-800">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Book Your Service
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service Type
                </label>
                <select
                  id="service"
                  {...register("service", {
                    required: "Please select a service",
                  })}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.service ? "border-red-500" : "border-gray-300"
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option value="cleaning">Cleaning Services</option>
                  <option value="painting">Painting Services</option>
                  <option value="pest">Pest Control</option>
                  <option value="repair">Home Repairs</option>
                  <option value="moving">Packers & Movers</option>
                </select>
                {errors.service && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.service.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  PIN Code
                </label>
                <input
                  type="text"
                  id="zip"
                  placeholder="Enter your 6-digit PIN code"
                  {...register("zip", {
                    required: "PIN code is required",
                    pattern: {
                      value: /^[1-9][0-9]{5}$/,
                      message: "Enter a valid Indian PIN code",
                    },
                  })}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.zip ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.zip && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.zip.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="date"
                  {...register("date", {
                    required: "Please select a preferred date",
                  })}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg">
                Check Availability
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                No credit card required to check availability
              </p>
            </form>
          </div>
        </div>
      </Container>

      {/* Dialog Popup */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Availability Status</DialogTitle>
            <DialogDescription>{availabilityMsg}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDialogOpen(false);
                reset(); // Reset form after closing dialog
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
