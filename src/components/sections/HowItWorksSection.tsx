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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center transition-all duration-300 hover:shadow-md relative"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;