import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Container from '../ui/Container';
import ServiceCard from '../common/ServiceCard';
import Button from '../ui/Button';
import { getServicesByCategory } from '../../data/services';

gsap.registerPlugin(ScrollTrigger);

const ServicesSection: React.FC = () => {
  const servicesByCategory = getServicesByCategory();
  const categories = Object.keys(servicesByCategory);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      className="relative pt-20 bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1627905646269-7f034dcc5738?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`, // Replace with your image URL
      }}
      ref={sectionRef}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-sky-900 to-gray-500 opacity-50"></div> {/* Overlay */}

      <div className="relative z-10">
        <Container>
        <h2 className="text-3xl text-center md:text-4xl font-bold text-white mb-3">Our Sevices</h2>
        <p className="text-lg text-white/80 max-w-3xl mx-auto text-center">Discover a wide range of reliable, professional services tailored to make your life easier — all in one place.</p>

          <div className="flex flex-wrap justify-center gap-3 pt-10 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow ${
                  activeCategory === category
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-gray-800 hover:bg-rose-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {servicesByCategory[activeCategory]?.slice(0, 5).map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>

          {servicesByCategory[activeCategory]?.length > 12 && (
            <div className="text-center">
              <Button variant="outline" className="group">
                View All {activeCategory}
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}
        </Container>
      </div>
    </section>
  );
};

export default ServicesSection;
