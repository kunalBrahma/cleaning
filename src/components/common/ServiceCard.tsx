// src/components/common/ServiceCard.tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface ServiceCardProps {
  service: {
    id: number;
    category: string;
    subCategory: string;
    icon: string;
    path: string;
    status: string;
    createdAt: string;
  };
  index: number;
  textColor?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  textColor = 'text-white',
}) => {
  const IconComponent = LucideIcons[
    service.icon as keyof typeof LucideIcons
  ] as React.ElementType;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
          },
        }
      );

      const hoverAnimation = gsap.to(cardRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
        paused: true,
        onStart: () => {
          gsap.to(cardRef.current, {
           
            duration: 0.3,
          });
        },
        onReverseComplete: () => {
          gsap.to(cardRef.current, {
            
            duration: 0.3,
          });
        },
      });

      cardRef.current?.addEventListener('mouseenter', () => hoverAnimation.play());
      cardRef.current?.addEventListener('mouseleave', () =>
        hoverAnimation.reverse()
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <Link to={service.path || '#'}>
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden transition-all duration-300 group p-6 flex flex-col items-center text-center"
      >
        <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-4 transform transition-all duration-300 group-hover:rotate-[15deg]">
          {IconComponent && <IconComponent size={32} className="text-white" />}
        </div>

        <h3
          className={`text-lg font-semibold ${textColor} mb-2 transition-colors duration-300`}
        >
          {service.subCategory}
        </h3>
      </div>
    </Link>
  );
};

export default ServiceCard;