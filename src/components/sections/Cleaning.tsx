import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import ServiceCard from '../common/ServiceCard';
import Button from '../ui/Button';
import { getServicesByCategory } from '../../data/services';

const Cleaning: React.FC = () => {
  const servicesByCategory = getServicesByCategory();
  const categories = Object.keys(servicesByCategory);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section
      id="cleaning"
      className="relative py-24 bg-cover bg-fixed bg-center overflow-hidden"
      style={{
        backgroundImage: `url('/banner.webp')`, // Replace with your image URL
      }}
      
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-sky-900 to-gray-500 opacity-50"></div> {/* Overlay */}
      <Container>
        <SectionHeading 
          title="Effortless Cleaning Solutions" 
          subtitle="Book trusted cleaners in minutes and enjoy a spotless space."
          center
        />

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
  {categories
    .filter((category) => category === 'Cleaning Services')
    .map((category) => (
      <button
        key={category}
        onClick={() => setActiveCategory(category)}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
          activeCategory === category
            ? 'bg-rose-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {category}
      </button>
    ))}
</div>

        {/* Service Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3  gap-6 mb-12">
          {servicesByCategory[activeCategory]?.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} index={0} />
          ))}
        </div>

        {/* View All Button */}
        {servicesByCategory[activeCategory]?.length > 12 && (
          <div className="text-center">
            <Button 
              variant="outline"
              className="group"
            >
              View All {activeCategory}
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Cleaning;