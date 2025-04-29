import React from 'react';
import { CalendarCheck, UserCheck, ClipboardList, Sparkles } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <CalendarCheck size={32} className="text-sky-400" />,
      title: 'Book a Service',
      description: 'Choose your service, select a date and time that works for you, and book in minutes.',
    },
    {
      icon: <UserCheck size={32} className="text-sky-400" />,
      title: 'Get Matched with a Pro',
      description: 'We assign the best qualified professional for your specific service needs.',
    },
    {
      icon: <ClipboardList size={32} className="text-sky-400" />,
      title: 'Get Your Service Done',
      description: 'Our professionals arrive on time and complete the service to your satisfaction.',
    },
    {
      icon: <Sparkles size={32} className="text-sky-400" />,
      title: 'Enjoy the Results',
      description: 'Relax and enjoy your clean, well-maintained, and beautiful home.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeading 
          title="How It Works" 
          subtitle="Our simple process to get your home service done right"
          center
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center transition-all duration-300 hover:shadow-md"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;