import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';

// Define form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  serviceType: z.string().min(1, { message: 'Please select a service category' }),
  specificService: z.string().optional(), // Making specificService optional
  date: z.string().min(1, { message: 'Please select a date' }),
  time: z.string().min(1, { message: 'Please select a time slot' }),
  address: z.string().min(5, { message: 'Please enter a valid address' }),
  city: z.string().min(2, { message: 'Please enter a valid city' }),
  state: z.string().min(2, { message: 'Please enter a valid state' }),
  zip: z.string().min(3, { message: 'Please enter a valid ZIP code' }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const BookingSection: React.FC = () => {
  const formElement = useRef<HTMLFormElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    watch,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Watch for changes in the serviceType field
  const serviceType = watch('serviceType');
  
  // Update the selectedCategory state when serviceType changes
  useEffect(() => {
    setSelectedCategory(serviceType || '');
    // Reset the specificService value when changing categories
    if (serviceType !== selectedCategory) {
      setValue('specificService', '');
    }
  }, [serviceType, selectedCategory, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      // Send email using EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        data,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
  
      // Reset form after submission
      reset();
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  // Function to render specific service options based on selected category
  const renderSpecificServiceOptions = () => {
    switch (selectedCategory) {
      case 'cleaning':
        return (
          <>
            <option value="" disabled>Select a service</option>
            <option value="bathroom">Bathroom Cleaning</option>
            <option value="kitchen">Kitchen Cleaning</option>
            <option value="fullhome">Full Home Cleaning</option>
            <option value="empty">Empty Home Cleaning</option>
            <option value="carpet">Carpet Cleaning</option>
          </>
        );
      case 'painting':
        return (
          <>
            <option value="" disabled>Select a service</option>
            <option value="repainting">Re-Painting</option>
            <option value="interior">New Interior Painting</option>
            <option value="texture">Texture Painting</option>
          </>
        );
      default:
        return (
          <option value="" disabled>Select a service</option>
        );
    }
  };

  return (
    <section
      id="booking"
      className="py-20 bg-cover bg-fixed bg-center bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500"
      style={{
        backgroundImage:
          'url("/banner.webp")',
      }}
    >
      <Container>
        <SectionHeading 
          title="Book Your Service" 
          subtitle="Schedule a service appointment in a few simple steps"
          center
        />
        
        <div className="w-full mx-auto flex flex-col lg:flex-row gap-8 items-center">
          {/* Form Section */}
          <div className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-200 transition-all hover:shadow-2xl">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for your booking. We've sent a confirmation to your email.
                </p>
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
                  Book Another Service
                </Button>
              </div>
            ) : (
              <form 
                ref={formElement}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6"
              >
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className={`w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        {...register('firstName')}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className={`w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Service Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Service Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                        Service Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="serviceType"
                        className={`w-full p-3 border ${errors.serviceType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        defaultValue=""
                        {...register('serviceType')}
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="cleaning">Cleaning Services</option>
                        <option value="painting">Painting Services</option>
                        <option value="pest">Pest Control</option>
                        <option value="repair">Home Repairs</option>
                        <option value="moving">Packers & Movers</option>
                         <option value="wood">Wood Cutting Service</option>
                      </select>
                      {errors.serviceType && (
                        <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="specificService" className="block text-sm font-medium text-gray-700 mb-1">
                        Specific Service 
                      </label>
                      <select
                        id="specificService"
                        className={`w-full p-3 border ${errors.specificService ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        defaultValue=""
                        {...register('specificService')}
                      >
                        {renderSpecificServiceOptions()}
                      </select>
                      {errors.specificService && (
                        <p className="mt-1 text-sm text-red-600">{errors.specificService.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        className={`w-full p-3 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        {...register('date')}
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="time"
                        className={`w-full p-3 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        defaultValue=""
                        {...register('time')}
                      >
                        <option value="" disabled>Select a time</option>
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 4PM)</option>
                        <option value="evening">Evening (4PM - 7PM)</option>
                      </select>
                      {errors.time && (
                        <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-4`}
                      placeholder="Street Address"
                      {...register('address')}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <input
                          type="text"
                          id="city"
                          placeholder="City"
                          className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          {...register('city')}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          id="state"
                          placeholder="State"
                          className={`w-full p-3 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          {...register('state')}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          id="zip"
                          placeholder="ZIP Code"
                          className={`w-full p-3 border ${errors.zip ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          {...register('zip')}
                        />
                        {errors.zip && (
                          <p className="mt-1 text-sm text-red-600">{errors.zip.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Additional Information
                  </h3>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Please share any special instructions or details about your service needs"
                      {...register('notes')}
                    ></textarea>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    fullWidth
                    disabled={isSubmitting}
                    className="relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'Processing...' : 'Book Your Service'}
                    </span>
                    <span className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  </Button>
                  <p className="text-sm text-gray-500 text-center mt-4">
                    By submitting this form, you agree to our terms of service and privacy policy.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-1/2 h-full hidden lg:block relative rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-900 opacity-50"></div>
            <img
              src="https://images.unsplash.com/photo-1608752503489-db8970c276aa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Professional service team"
              width={800}
              height={1000}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Why Choose Us?</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Professional & Certified Experts
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Same Day Service Available
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Satisfaction Guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BookingSection;