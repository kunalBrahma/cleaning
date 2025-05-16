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
  gradientFrom?: string;
  gradientTo?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  index,
  textColor = 'text-white',
  
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Normalize icon name (handle "<Bath />", "https://cityhomeservice.inBath", or "Bath")
  const normalizeIconName = (icon: string): string => {
    
    if (icon.startsWith('<') && icon.endsWith('/>')) {
      return icon.replace(/[<>/]/g, '');
    }
    // Remove URL prefix (e.g., "https://cityhomeservice.inBath" → "Bath")
    if (icon.startsWith('https://cityhomeservice.in')) {
      return icon.replace('https://cityhomeservice.in', '');
    }
    // Return plain icon name
    return icon;
  };

  // Map custom icon names to Lucide icons (if needed)
  const iconMap: { [key: string]: string } = {
    // Painting related icons
    PaintBucket: 'PaintBucket',
    Brush: 'Brush',
    Roller: 'Roller',
    Palette: 'Palette',
    SprayCan: 'SprayCan',
    Droplet: 'Droplet',
    ColorWand: 'Wand2', // Using Wand2 as a substitute for color wand
    
    // Wood cutting related icons
    Axe: 'Axe',
    Saw: 'TreePine', // Using TreePine as saw alternative
    Wood: 'TreePine',
    Lumber: 'SquareStack', // Using SquareStack for lumber
    HardHat: 'HardHat',
    Ruler: 'Ruler',
    Measure: 'TapeMeasure',
    Hammer: 'Hammer',
    Chisel: 'Chisel', // If available in your icon set
    
    // General home service icons
    Sofa: 'Sofa',
    Bug: 'Bug',
    Home: 'Home',
    ShieldCheck: 'ShieldCheck',
    Fan: 'Fan',
    UtensilsCrossed: 'Utensils',
    Wrench: 'Wrench',
    Zap: 'Zap',
    Truck: 'Truck',
    Package: 'Package',
    BrickWall: 'BrickWall',
    Bath: 'Bath',
  };

  const iconName = normalizeIconName(service.icon);
  const lucideIconName = iconMap[iconName] || 'AlertCircle'; // Fallback to AlertCircle
  const IconComponent = LucideIcons[lucideIconName as keyof typeof LucideIcons] as React.ElementType;

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
      });

      const cardElement = cardRef.current;
      cardElement?.addEventListener('mouseenter', () => hoverAnimation.play());
      cardElement?.addEventListener('mouseleave', () => hoverAnimation.reverse());

      return () => {
        cardElement?.removeEventListener('mouseenter', () => hoverAnimation.play());
        cardElement?.removeEventListener('mouseleave', () => hoverAnimation.reverse());
      };
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <Link to={service.path || '#'} className={service.path ? '' : 'pointer-events-none'}>
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