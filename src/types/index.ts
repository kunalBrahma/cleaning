export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  price?: string;
  category: string;
  subCategory:string;
  path:string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface FAQ {
  question: string;
  answer: string;
}