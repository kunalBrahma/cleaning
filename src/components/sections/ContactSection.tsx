import React, { useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Define form schema with Zod
const formSchema = z.object({
  contactName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  contactEmail: z.string().email({ message: 'Please enter a valid email address' }),
  contactSubject: z.string().min(2, { message: 'Subject must be at least 2 characters' }),
  contactMessage: z.string().min(0, { message: 'Message must be at least 10 characters' }),
});

type FormData = z.infer<typeof formSchema>;

const ContactSection: React.FC = () => {
  const contactInfo = [
    {
      icon: <MapPin size={24} className="text-blue-700" />,
      title: 'Our Location',
      content: 'Dakhingaon Khanka Mini Tajmahal Road Insaf Nagar Path, Guwhatai, Assam ',
    },
    {
      icon: <Phone size={24} className="text-blue-700" />,
      title: 'Phone Number',
      content: '+91 81330 39362',
    },
    {
      icon: <Mail size={24} className="text-blue-700" />,
      title: 'Email Address',
      content: 'info@cityhomeservice.com',
    },
    {
      icon: <Clock size={24} className="text-blue-700" />,
      title: 'Working Hours',
      content: 'Mon-Sat: 8:00 AM - 7:00 PM',
    },
  ];

  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom center',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/api/api/contact', {
        name: data.contactName,
        email: data.contactEmail,
        subject: data.contactSubject,
        message: data.contactMessage,
      });
      reset();
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      // Optionally, display an error to the user
      alert('Failed to submit the form. Please try again later.');
    }
  };

  return (
    <section
      id="contact"
      className="py-20 bg-cover bg-fixed bg-center bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500"
      style={{
        backgroundImage: 'url("/banner2.webp")',
      }}
      ref={sectionRef}
    >
      <Container>
        <SectionHeading
          title="Contact Us"
          subtitle="Reach out to us for any questions or to schedule a service"
          center
        />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-4 rounded-lg py-4 md:py-20 flex-col shadow-md border border-gray-100">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Send Us a Message</h3>
            {isSubmitSuccessful ? (
              <div className="text-center py-10">
                <svg
                  className="w-16 h-16 mx-auto text-green-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for your message. We'll get back to you soon!
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      className={`w-full p-3 border ${errors.contactName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      {...register('contactName')}
                    />
                    {errors.contactName && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      className={`w-full p-3 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      {...register('contactEmail')}
                    />
                    {errors.contactEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contactSubject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="contactSubject"
                    className={`w-full p-3 border ${errors.contactSubject ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    {...register('contactSubject')}
                  />
                  {errors.contactSubject && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactSubject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="contactMessage"
                    rows={5}
                    className={`w-full p-3 border ${errors.contactMessage ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    {...register('contactMessage')}
                  ></textarea>
                  {errors.contactMessage && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactMessage.message}</p>
                  )}
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Contact Information</h3>
              <p className="text-gray-600 mb-8">
                Have questions about our services or need to schedule an appointment?
                Get in touch with us using any of the methods below:
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{info.title}</h4>
                      <p className="text-gray-600">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Map Placeholder */}
            <div className="mt-8 h-60 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14325.88184497933!2d91.7698908153851!3d26.148803495400198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a59edf114993d%3A0x5c17cf47df92b0e7!2sSite%20Maker%20Web%20Design!5e0!3m2!1sen!2sin!4v1745559407812!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactSection;