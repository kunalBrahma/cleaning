import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as LucideIcons from "lucide-react";
import { Service } from "../../types";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const IconComponent = LucideIcons[
    service.icon as keyof typeof LucideIcons
  ] as React.ElementType;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.1,
          delay: index * 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <Link
      to={
        service.path ||
        `/services/${service.category.toLowerCase().replace(/\s/g, "-")}/${
          service.id
        }`
      }
    >
      <div
        ref={cardRef}
        className="relative rounded-xl overflow-hidden transition-all duration-300 group p-4 flex flex-col items-center text-center "
      >
        {/* Icon */}
        <div className="p-4 bg-sky-50 rounded-full mb-3">
          {IconComponent && (
            <IconComponent size={28} className="text-sky-500" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-lg font-medium text-white/80 mb-2">
          {service.name}
        </h3>
      </div>
    </Link>
  );
};

export default ServiceCard;
