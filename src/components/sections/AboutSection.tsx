/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import { CheckCircle, Users, Award, ThumbsUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '10,000+', label: 'Happy Customers' },
    { icon: <CheckCircle className="w-6 h-6" />, value: '15,000+', label: 'Services Completed' },
    { icon: <Award className="w-6 h-6" />, value: '50+', label: 'Expert Professionals' },
    { icon: <ThumbsUp className="w-6 h-6" />, value: '98%', label: 'Satisfaction Rate' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image animation
      gsap.from(imageRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });

      // Content animation
      gsap.from(contentRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });

      // Stats animations
      stats.forEach((_, index) => {
        const statElement = statsRef.current[index];
        if (statElement) {
          const valueElement = statElement.querySelector('p:first-child');
          const labelElement = statElement.querySelector('p:last-child');
          
          // Entry animation
          gsap.from([valueElement, labelElement], {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: statElement,
              start: "top 80%",
            }
          });

          // Counter animation
          const target = parseInt(stats[index].value.replace(/[^0-9]/g, ''));
          const counter = statElement.querySelector('.counter');
          
          gsap.to(counter, {
            innerText: target,
            duration: 2,
            scrollTrigger: {
              trigger: statElement,
              start: "top 80%",
            },
            snap: { innerText: 1 },
            modifiers: {
              innerText: (innerText) => {
                const value = Math.floor(innerText);
                const formatted = value.toLocaleString();
                return stats[index].value.includes('%') 
                  ? `${value}%` 
                  : `${formatted}+`;
              }
            }
          });
        }
      });

      // Floating animation for image
      gsap.to(imageRef.current, {
        y: 20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
    >
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image with floating effect */}
          <div 
            ref={imageRef}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1580256081112-e49377338b7f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Our professional team" 
              className="w-full h-auto rounded-xl shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-sky-400 rounded-lg text-white">
                <span className="text-2xl font-bold">15+</span>
              </div>
              <p className="mt-2 text-xs text-center text-gray-600">Years Experience</p>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            <SectionHeading 
              title="About City Home Service" 
              subtitle="Your trusted partner for all home service needs since 2015"
              center={false}
            />

            <p className="text-gray-600 mb-6 leading-relaxed">
              At City Home Service, we understand that your home is your sanctuary. That's why we're committed to providing the highest quality services to keep your living space clean, comfortable, and functioning perfectly.
            </p>

            <p className="text-gray-600 mb-10 leading-relaxed">
              Our team of vetted professionals brings years of experience, proper training, and a customer-first attitude to every job. Whether you need a deep cleaning, a fresh coat of paint, or comprehensive pest control, we deliver exceptional results that exceed your expectations.
            </p>

            {/* Stats grid with animated counters */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  ref={el => statsRef.current[index] = el}
                  className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mr-4">
                      {React.cloneElement(stat.icon, { className: "text-sky-400 w-6 h-6" })}
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        <span className="counter">0</span>
                      </p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

           
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;