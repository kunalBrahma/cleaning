import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../../types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  return (
    <Card className="bg-white border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader>
        <div className="flex">{renderStars(testimonial.rating)}</div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 italic">&quot;{testimonial.content}&quot;</p>
      </CardContent>
      <CardFooter className="flex items-center">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="text-gray-900 font-semibold">{testimonial.name}</h4>
          <p className="text-gray-500 text-sm">{testimonial.role}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestimonialCard;