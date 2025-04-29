import React from 'react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import TestimonialCard from '../common/TestimonialCard';
import { testimonials } from '../../data/testimonials';
import '../../styles/swiper.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Button from '../ui/Button';

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <Container>
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Don't just take our word for it - here's what our satisfied customers have to say"
          center
        />

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ 
              clickable: true, 
              el: '.swiper-pagination',
              type: 'bullets',
            }}
            autoplay={{ 
              delay: 5000, 
              disableOnInteraction: false 
            }}
            className="pb-12"
            loop={true}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            className="swiper-button-prev absolute top-1/2 -left-4 transform -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-2 h-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="swiper-button-next absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Next testimonial"
          >
            <svg
              className="w-2 h-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>

          {/* Pagination */}
          <div className="swiper-pagination relative mt-8 flex justify-center gap-2"></div>
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;